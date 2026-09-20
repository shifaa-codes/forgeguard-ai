# 🔷 ForgeGuard AI — Industrial Quality Inspection Platform

**Real-time AI-powered defect detection for manufacturing production lines.**

*Built for **Hack Devengers 2.0** (2026)*

![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![React](https://img.shields.io/badge/React-18-61DAFB)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 The Problem

Manual quality inspection in manufacturing is:
- **Slow** — human inspectors can check only a fraction of products
- **Inconsistent** — judgment varies by shift, fatigue, and experience
- **Error-prone** — defects slip through undetected
- **Untraceable** — no reliable data for process improvement

This causes **costly recalls, wasted material, and unreliable quality metrics**.

---

## 💡 The Solution

**ForgeGuard AI** transforms industrial cameras into intelligent quality inspectors.

It combines a **trained YOLOv8 model**, an **OpenCV pipeline**, a **FastAPI backend**, and a **React industrial dashboard** into one unified real-time inspection system.

### How It Works
Standard Product (Reference)
↓
Live Camera / Image Upload
↓
OpenCV Preprocessing
↓
YOLOv8 Defect Detection
→ Crazing, Inclusion, Patches,
Pitted Surface, Rolled-in Scale, Scratches
↓
Severity Assessment → Low / Medium / High / Critical
↓
Standard Conformity Check → Match Score (0–100%)
↓
Decision Engine → ✅ PASS | ❌ REJECT | ⚠️ REVIEW
↓
Database + Analytics → Dashboard, Trends, Alerts



---

## ✨ Key Features

| Feature | Description |
|---|---|
| **🎯 Real YOLO Detection** | 6 defect classes, 73% mAP50, 4.4ms inference |
| **📦 Standard Product** | Register an approved reference image |
| **📊 Live Dashboard** | KPI cards, defect trends, severity distribution |
| **📋 Inspection History** | Full searchable audit log |
| **📈 Analytics** | Defect trends, severity breakdown, quality alerts |
| **⚡ Live Inspection** | WebSocket-based real-time frame processing |
| **🎬 Demo Mode** | Runs in mock mode if YOLO model is unavailable |
| **🔒 Modular API** | FastAPI backend ready for Supabase / PostgreSQL |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI/ML** | YOLOv8 (Ultralytics), PyTorch, OpenCV |
| **Backend** | Python 3.11, FastAPI, Uvicorn, Pydantic |
| **Frontend** | React 18, Vite, TailwindCSS, Recharts, Lucide |
| **Database** | SQLite (dev) · Supabase-ready (prod) |
| **Real-time** | WebSocket (`/api/inspection/live`) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) A trained `best.pt` YOLO model — the app runs in **demo mode** without one

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
Backend runs at http://localhost:8000
Swagger docs at http://localhost:8000/docs

Frontend Setup

bash
cd frontend
npm install
npm run dev
Frontend runs at http://localhost:5173

Add the YOLO Model (Optional)

Place your trained best.pt inside backend/models/ and restart the backend. It will auto-switch from mock to real mode.

📡 API Endpoints

Method	Endpoint	Description
GET	/api/health	Service status + model mode
GET	/api/standard	Get active standard product
POST	/api/standard/upload	Register a new standard
POST	/api/inspection/image	Run single-image inspection
GET	/api/inspection/history	Paginated inspection history
GET	/api/inspection/{id}	Inspection details
WS	/api/inspection/live	Live frame inspection
GET	/api/dashboard/stats	KPI stats
GET	/api/analytics/defects	Defect distribution
GET	/api/analytics/severity	Severity distribution
GET	/api/analytics/trend	Time-series trends
GET	/api/analytics/alerts	Quality alert
🧠 Model Details

Dataset: NEU Surface Defect Database
Images: 1,799 (1,439 train + 360 validation)
Classes: Crazing, Inclusion, Patches, Pitted Surface, Rolled-in Scale, Scratches
Architecture: YOLOv8n
Epochs: 30
mAP50: 0.734
Inference Speed: 4.4 ms per image
⚠️ Disclaimer

The standard-product conformity score is a prototype heuristic — not industrial-grade metrology.
Severity thresholds are prototype values and should be calibrated with real data.
In mock mode, the backend does not fabricate detections — it clearly reports model_mode: "mock".
🔮 Roadmap

□ Deploy on-premise with Jetson Nano for edge inference
□ Multi-material support (glass, plastic, aluminium)
□ Continuous learning pipeline (operator feedback → retraining)
□ Supabase production database
□ Role-based user authentication
□ PDF/CSV export for quality reports
📄 License

MIT License — free for educational and commercial use.

Built with ❤️ for Hack Devengers 2.0 · 2026
