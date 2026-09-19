import { categoryMeta, scoredCategories } from "@/lib/domain/categories";
import { actualActivityMinutes, actualMinutesByCategory } from "@/lib/domain/scoring";
import { dateLabel, formatDuration } from "@/lib/domain/dates";
import { DayTimeline } from "./day-timeline";
import type { useTimeBudgetStore } from "@/lib/storage/store";

type Store = ReturnType<typeof useTimeBudgetStore>;

export function HistoryScreen({ store }: { store: Store }) {
  const plans = [...store.state.plans].filter((plan) => plan.state === "finalized").sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="screen">
      <div className="screen-heading"><div><span className="eyebrow">REFLECT</span><h1>History</h1></div></div>
      {!plans.length && <div className="empty-panel"><h2>No completed days yet.</h2><p>Finalized daily loops will appear here with target-versus-actual analytics.</p></div>}
      {plans.map((plan) => {
        const actual = actualMinutesByCategory(plan.activities);
        const tracked = plan.activities.reduce((sum, activity) => sum + actualActivityMinutes(activity), 0);
        const allTotals = plan.activities.reduce<Record<string, number>>((result, activity) => {
          result[activity.category] = (result[activity.category] ?? 0) + actualActivityMinutes(activity);
          return result;
        }, {});
        const total = Object.values(allTotals).reduce((sum, value) => sum + value, 0) || 1;
        let cursor = 0;
        const gradient = Object.entries(allTotals).map(([category, minutes]) => {
          const start = cursor;
          cursor += (minutes / total) * 360;
          return `${categoryMeta[category as keyof typeof categoryMeta].color} ${start}deg ${cursor}deg`;
        }).join(", ");
        return (
          <section className="history-card" key={plan.id}>
            <div className="history-top"><div><span className="eyebrow">{dateLabel(plan.date)}</span><h2>{plan.finalScore ?? 0} balance score</h2><p>{formatDuration(tracked)} actually tracked</p></div><div className="pie" style={{ background: gradient ? `conic-gradient(${gradient})` : "var(--track)" }} /></div>
            <div className="history-bars">
              {scoredCategories.map((category) => {
                const target = plan.targets[category];
                const value = actual[category];
                const width = target ? Math.min(100, (value / target) * 100) : value ? 100 : 0;
                return <div className="history-row" key={category}><div><span>{categoryMeta[category].label}</span><strong>{formatDuration(value)} / {formatDuration(target)}</strong></div><div className="bar"><span style={{ width: `${width}%`, background: categoryMeta[category].color }} /></div></div>;
              })}
            </div>
            <div className="history-timeline"><span className="eyebrow">DAY TIMELINE</span><DayTimeline activities={plan.activities} /></div>
          </section>
        );
      })}
    </div>
  );
}
