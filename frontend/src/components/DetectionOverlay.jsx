export default function DetectionOverlay({ bbox }) {
  if (!bbox) return null;
  const isCritical = bbox.label === 'CRACK';
  const color = isCritical ? '#DC2626' : bbox.label === 'SCRATCH' ? '#B58863' : '#F59E0B';

  return (
    <div
      className="absolute animate-bbox-in pointer-events-none"
      style={{
        left: `${bbox.x}%`, top: `${bbox.y}%`,
        width: `${bbox.w}%`, height: `${bbox.h}%`,
      }}
    >
      {/* Corner brackets */}
      {[
        'top-0 left-0 border-t-2 border-l-2',
        'top-0 right-0 border-t-2 border-r-2',
        'bottom-0 left-0 border-b-2 border-l-2',
        'bottom-0 right-0 border-b-2 border-r-2',
      ].map((cls, i) => (
        <span
          key={i}
          className={`absolute w-4 h-4 ${cls}`}
          style={{ borderColor: color, filter: `drop-shadow(0 0 6px ${color})` }}
        />
      ))}

      {/* Label */}
      <div
        className="absolute -top-7 left-0 px-2 py-1 rounded-md text-[10px] font-bold
                   tracking-wider font-mono flex items-center gap-1.5 whitespace-nowrap"
        style={{
          background: color,
          color: '#0B1114',
          boxShadow: `0 0 16px ${color}99`,
        }}
      >
        {bbox.label} <span className="opacity-70">{bbox.conf}%</span>
      </div>

      {/* Scanline */}
      <div
        className="absolute inset-x-0 h-px animate-scan"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </div>
  );
}