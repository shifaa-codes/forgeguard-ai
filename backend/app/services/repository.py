"""Storage layer. Uses SQLite by default; Supabase can be plugged in later."""
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional


class SQLiteRepo:
    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        self._init_schema()

    @contextmanager
    def _conn(self):
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()

    def _init_schema(self) -> None:
        with self._conn() as c:
            c.executescript("""
                CREATE TABLE IF NOT EXISTS standard_products (
                    id TEXT PRIMARY KEY,
                    product_id TEXT UNIQUE,
                    name TEXT,
                    image_url TEXT,
                    status TEXT,
                    created_at TEXT
                );
                CREATE TABLE IF NOT EXISTS inspections (
                    id TEXT PRIMARY KEY,
                    inspection_id TEXT UNIQUE,
                    product_id TEXT,
                    timestamp TEXT,
                    standard_match REAL,
                    decision TEXT,
                    image_url TEXT,
                    mode TEXT
                );
                CREATE TABLE IF NOT EXISTS defects (
                    id TEXT PRIMARY KEY,
                    inspection_id TEXT,
                    defect_type TEXT,
                    confidence REAL,
                    severity TEXT,
                    x1 REAL, y1 REAL, x2 REAL, y2 REAL
                );
            """)

    # ---- Standard
    def save_standard(self, rec: Dict[str, Any]) -> None:
        with self._conn() as c:
            c.execute("UPDATE standard_products SET status='inactive' WHERE status='active'")
            c.execute(
                """INSERT INTO standard_products (id, product_id, name, image_url, status, created_at)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (rec["id"], rec["product_id"], rec["name"], rec["image_url"],
                 rec["status"], rec["created_at"]),
            )

    def get_active_standard(self) -> Optional[Dict[str, Any]]:
        with self._conn() as c:
            row = c.execute(
                "SELECT * FROM standard_products WHERE status='active' ORDER BY created_at DESC LIMIT 1"
            ).fetchone()
            return dict(row) if row else None

    def deactivate_standard(self, product_id: str) -> bool:
        with self._conn() as c:
            cur = c.execute(
                "UPDATE standard_products SET status='inactive' WHERE product_id=?",
                (product_id,),
            )
            return cur.rowcount > 0

    # ---- Inspections
    def save_inspection(self, ins: Dict[str, Any], defects: List[Dict[str, Any]]) -> None:
        with self._conn() as c:
            c.execute(
                """INSERT OR REPLACE INTO inspections
                   (id, inspection_id, product_id, timestamp, standard_match, decision, image_url, mode)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (ins["id"], ins["inspection_id"], ins["product_id"], ins["timestamp"],
                 ins["standard_match"], ins["decision"], ins.get("image_url"), ins.get("mode", "demo")),
            )
            for d in defects:
                c.execute(
                    """INSERT INTO defects
                       (id, inspection_id, defect_type, confidence, severity, x1, y1, x2, y2)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (str(uuid.uuid4()), ins["inspection_id"], d["class_name"], d["confidence"],
                     d.get("severity", "low"), d["bbox"]["x1"], d["bbox"]["y1"],
                     d["bbox"]["x2"], d["bbox"]["y2"]),
                )

    def list_inspections(self, page: int, limit: int, filters: Dict[str, Any]) -> Dict[str, Any]:
        where, params = self._build_filters(filters)
        offset = (page - 1) * limit
        with self._conn() as c:
            total = c.execute(f"SELECT COUNT(*) FROM inspections {where}", params).fetchone()[0]
            rows = c.execute(
                f"SELECT * FROM inspections {where} ORDER BY timestamp DESC LIMIT ? OFFSET ?",
                (*params, limit, offset),
            ).fetchall()
            items = []
            for r in rows:
                d = dict(r)
                defects = c.execute(
                    "SELECT * FROM defects WHERE inspection_id=? ORDER BY confidence DESC",
                    (d["inspection_id"],),
                ).fetchall()
                d["defects"] = [dict(x) for x in defects]
                items.append(d)
        return {"items": items, "total": total}

    def get_inspection(self, inspection_id: str) -> Optional[Dict[str, Any]]:
        with self._conn() as c:
            row = c.execute(
                "SELECT * FROM inspections WHERE inspection_id=?", (inspection_id,)
            ).fetchone()
            if not row:
                return None
            d = dict(row)
            defects = c.execute(
                "SELECT * FROM defects WHERE inspection_id=?", (inspection_id,)
            ).fetchall()
            d["defects"] = [dict(x) for x in defects]
            return d

    def stats(self) -> Dict[str, Any]:
        with self._conn() as c:
            total = c.execute("SELECT COUNT(*) FROM inspections").fetchone()[0]
            passed = c.execute("SELECT COUNT(*) FROM inspections WHERE decision='PASS'").fetchone()[0]
            rejected = c.execute("SELECT COUNT(*) FROM inspections WHERE decision='REJECT'").fetchone()[0]
        defect_rate = round((rejected / total * 100) if total else 0.0, 2)
        return {"total_inspected": total, "passed": passed, "rejected": rejected, "defect_rate": defect_rate}

    def defect_distribution(self) -> Dict[str, int]:
        with self._conn() as c:
            rows = c.execute(
                "SELECT defect_type, COUNT(*) as cnt FROM defects GROUP BY defect_type"
            ).fetchall()
        out = {"scratch": 0, "crack": 0, "dent": 0, "surface_defect": 0, "deformation": 0}
        for r in rows:
            key = r["defect_type"].lower().replace(" ", "_")
            if key in out:
                out[key] = r["cnt"]
        return out

    def severity_distribution(self) -> Dict[str, int]:
        with self._conn() as c:
            rows = c.execute(
                "SELECT severity, COUNT(*) as cnt FROM defects GROUP BY severity"
            ).fetchall()
        out = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        for r in rows:
            if r["severity"] in out:
                out[r["severity"]] = r["cnt"]
        return out

    def trend(self, hours: int = 12) -> List[Dict[str, Any]]:
        with self._conn() as c:
            rows = c.execute(
                """SELECT substr(timestamp, 12, 5) as hr,
                          COUNT(*) as inspected,
                          SUM(CASE WHEN decision='REJECT' THEN 1 ELSE 0 END) as defects
                   FROM inspections GROUP BY hr ORDER BY hr DESC LIMIT ?""",
                (hours,),
            ).fetchall()
        return [
            {"time": r["hr"], "inspected": r["inspected"], "defects": r["defects"] or 0}
            for r in reversed(rows)
        ]

    def most_common_defect(self) -> str:
        with self._conn() as c:
            row = c.execute(
                "SELECT defect_type, COUNT(*) as cnt FROM defects GROUP BY defect_type ORDER BY cnt DESC LIMIT 1"
            ).fetchone()
        return row["defect_type"] if row else "none"

    def _build_filters(self, f: Dict[str, Any]) -> tuple:
        clauses, params = [], []
        if f.get("decision"):
            clauses.append("decision = ?")
            params.append(f["decision"])
        if f.get("search"):
            clauses.append("(product_id LIKE ? OR inspection_id LIKE ?)")
            like = f"%{f['search']}%"
            params.extend([like, like])
        if f.get("severity") or f.get("defect_type"):
            sub = []
            if f.get("severity"):
                sub.append("severity = ?")
                params.append(f["severity"])
            if f.get("defect_type"):
                sub.append("defect_type = ?")
                params.append(f["defect_type"])
            clauses.append(f"inspection_id IN (SELECT inspection_id FROM defects WHERE {' AND '.join(sub)})")
        where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        return where, params


def create_repo() -> SQLiteRepo:
    db_file = Path("forgeguard.db")
    return SQLiteRepo(db_file)


repo = create_repo()