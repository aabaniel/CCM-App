export function ScoreRing({ score, label = "Projected" }: { score: number; label?: string }) {
  const degrees = Math.max(0, Math.min(100, score)) * 3.6;
  return (
    <div className="score-ring" style={{ background: `conic-gradient(var(--accent) ${degrees}deg, var(--track) 0deg)` }}>
      <div className="score-ring-inner">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
