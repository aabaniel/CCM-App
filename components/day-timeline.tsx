import { categoryMeta } from "@/lib/domain/categories";
import { formatMinutes } from "@/lib/domain/dates";
import type { Activity } from "@/lib/domain/types";

export function DayTimeline({ activities }: { activities: Activity[] }) {
  const sorted = [...activities].sort((a, b) => a.plannedStartMinutes - b.plannedStartMinutes);
  return (
    <div className="timeline-list">
      {sorted.map((activity) => (
        <div key={activity.id} className="timeline-item">
          <div className="timeline-time">
            <strong>{formatMinutes(activity.plannedStartMinutes)}</strong>
            <span>{formatMinutes(activity.plannedEndMinutes)}</span>
          </div>
          <div className="timeline-rail"><span style={{ background: categoryMeta[activity.category].color }} /></div>
          <div className="timeline-content">
            <strong>{activity.title}</strong>
            <span>{categoryMeta[activity.category].label} · {activity.flexibility === "fixed" ? "Fixed" : "Flexible"}</span>
          </div>
        </div>
      ))}
      {!sorted.length && <div className="empty-state">Your timeline is empty. Add the first block for tomorrow.</div>}
    </div>
  );
}
