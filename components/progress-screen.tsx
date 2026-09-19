import { levelForXP } from "@/lib/domain/xp";
import type { use1440Store } from "@/lib/storage/store";

type Store = ReturnType<typeof use1440Store>;

export function ProgressScreen({ store }: { store: Store }) {
  const progress = store.state.progress;
  const level = levelForXP(progress.totalXP);
  const intoLevel = progress.totalXP % 500;
  return (
    <div className="screen">
      <div className="screen-heading"><div><span className="eyebrow">KEEP SHOWING UP</span><h1>Progress</h1></div></div>
      <section className="level-card"><span>LEVEL</span><strong>{level}</strong><div><div className="bar"><span style={{ width: `${(intoLevel / 500) * 100}%` }} /></div><small>{intoLevel} / 500 XP to next level</small></div></section>
      <div className="metric-grid"><div className="metric-card"><span>Current streak</span><strong>{progress.currentStreak}</strong><small>daily loops</small></div><div className="metric-card"><span>Longest streak</span><strong>{progress.longestStreak}</strong><small>days</small></div><div className="metric-card"><span>Total XP</span><strong>{progress.totalXP}</strong><small>participation XP</small></div><div className="metric-card"><span>Days stored</span><strong>{store.state.plans.length}</strong><small>local browser</small></div></div>
      <section className="card"><span className="eyebrow">XP PHILOSOPHY</span><h2>Reward the loop, not perfection.</h2><p className="body-copy">XP comes from planning, starting, completing, and reflecting—not from achieving a high balance score. A hard day can still be an intentional day.</p><div className="xp-grid"><span>Commit tomorrow <strong>+30</strong></span><span>Start an activity <strong>+20</strong></span><span>Complete an activity <strong>+20</strong></span><span>Finalize the loop <strong>+30</strong></span></div></section>
      <button className="danger-button" onClick={store.reset}>Reset local demo data</button>
    </div>
  );
}
