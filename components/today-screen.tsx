"use client";

import { useEffect, useRef, useState } from "react";
import { ScoreRing } from "./score-ring";
import { categoryMeta } from "@/lib/domain/categories";
import { dateLabel, formatMinutes, localDateKey } from "@/lib/domain/dates";
import { allocationRecommendations } from "@/lib/domain/recommendations";
import { actualEndOverrunMinutes, actualMinutesByCategory } from "@/lib/domain/scoring";
import { levelForXP } from "@/lib/domain/xp";
import type { DayPlan } from "@/lib/domain/types";
import type { useTimeBudgetStore } from "@/lib/storage/store";

type Store = ReturnType<typeof useTimeBudgetStore>;

function NewDayReview({ plan, totalXP }: { plan: DayPlan; totalXP: number }) {
  const recommendations = allocationRecommendations(plan.targets, actualMinutesByCategory(plan.activities));
  const level = levelForXP(totalXP);

  return (
    <section className="new-day-review">
      <div className="review-top">
        <div>
          <span className="eyebrow">NEW DAY REVIEW</span>
          <h2>{dateLabel(plan.date)} in review</h2>
          <p>{level} · {totalXP} total XP</p>
        </div>
        <ScoreRing score={plan.finalScore ?? 0} label="Final" />
      </div>
      <div className="recommendation-copy">
        <strong>Today&apos;s focus</strong>
        {recommendations.length ? (
          <ul className="recommendation-list">
            {recommendations.map((recommendation) => (
              <li key={recommendation.category}>
                {recommendation.direction === "add" ? "Make room for" : "Consider trimming"} {recommendation.minutes}m {recommendation.direction === "add" ? "more for" : "from"} {categoryMeta[recommendation.category].label}.
              </li>
            ))}
          </ul>
        ) : <p>Your actual allocation matched every target. Keep building on it.</p>}
      </div>
    </section>
  );
}

export function TodayScreen({ store }: { store: Store }) {
  const date = localDateKey();
  const plan = store.state.plans.find((candidate) => candidate.date === date);
  const previousPlan = [...store.state.plans]
    .filter((candidate) => candidate.state === "finalized" && candidate.date < date)
    .sort((left, right) => right.date.localeCompare(left.date))[0];
  const [notice, setNotice] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const enableAlerts = async () => {
    if (!("Notification" in window)) return setNotice("This browser does not support notifications.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return setNotice("Notification permission was not granted.");
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (!plan) return;
    const now = new Date();
    let scheduled = 0;
    const scheduleAlert = (atMinutes: number, title: string, body: string) => {
      const alertAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, atMinutes);
      const delay = alertAt.getTime() - now.getTime();
      if (delay <= 0 || delay >= 86_400_000) return;
      timers.current.push(window.setTimeout(() => new Notification(title, { body }), delay));
      scheduled += 1;
    };

    for (const activity of plan.activities.filter((item) => item.status === "planned" || item.status === "active")) {
      if (activity.status === "planned") {
        scheduleAlert(activity.plannedStartMinutes, `Time for ${activity.title}`, "Open TimeBudget and tap Start.");
      }
      scheduleAlert(
        activity.plannedEndMinutes,
        `${activity.title} is scheduled to end`,
        "Tap Done when you finish so TimeBudget can record any extra time.",
      );
    }
    setNotice(scheduled ? `${scheduled} start/end demo alert${scheduled === 1 ? "" : "s"} scheduled while this page remains open.` : "There are no remaining alerts to schedule today.");
  };

  if (!plan) {
    return (
      <div className="screen"><div className="screen-heading"><div><span className="eyebrow">TODAY</span><h1>{dateLabel(date)}</h1></div></div>{previousPlan && <NewDayReview plan={previousPlan} totalXP={store.state.progress.totalXP} />}<div className="empty-panel"><h2>No plan for today.</h2><p>Plan tomorrow from the Tomorrow tab, or load the demo data to walk through execution now.</p><button className="secondary-button" onClick={store.loadDemo}>Load demo data</button></div></div>
    );
  }

  const sorted = [...plan.activities].sort((a, b) => a.plannedStartMinutes - b.plannedStartMinutes);
  const overruns = sorted
    .map((activity) => ({ activity, minutes: actualEndOverrunMinutes(activity, date) }))
    .filter(({ minutes }) => minutes > 0);
  return (
    <div className="screen">
      <div className="screen-heading"><div><span className="eyebrow">EXECUTE TODAY</span><h1>{dateLabel(date)}</h1></div><ScoreRing score={plan.projectedScore} label="Plan" /></div>
      {previousPlan && <NewDayReview plan={previousPlan} totalXP={store.state.progress.totalXP} />}
      <div className="notification-row"><button className="ghost-button" onClick={enableAlerts}>Enable demo alerts</button>{notice && <span>{notice}</span>}</div>
      <div className="execution-list">
        {sorted.map((activity) => (
          <article className={activity.status === "active" ? "execution-card active" : "execution-card"} key={activity.id}>
            <div className="execution-accent" style={{ background: categoryMeta[activity.category].color }} />
            <div className="execution-main">
              <div className="execution-header"><div><strong>{activity.title}</strong><span>{formatMinutes(activity.plannedStartMinutes)}–{formatMinutes(activity.plannedEndMinutes)} · {categoryMeta[activity.category].label}</span></div><span className={`status ${activity.status}`}>{activity.status}</span></div>
              {activity.status === "completed" && actualEndOverrunMinutes(activity, date) > 0 && <span className="overrun-chip">+{actualEndOverrunMinutes(activity, date)}m after scheduled end</span>}
              <div className="button-row small-gap">
                {activity.status === "planned" && <button className="primary-button small" onClick={() => store.startActivity(date, activity.id)}>Start</button>}
                {activity.status === "planned" && <button className="ghost-button small" onClick={() => store.skipActivity(date, activity.id)}>Skip</button>}
                {activity.status === "active" && <button className="primary-button small" onClick={() => { const error = store.completeActivity(date, activity.id); if (error) setNotice(error.message); }}>Done</button>}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!!overruns.length && <section className="overrun-summary"><span className="eyebrow">EXTRA TIME LOGGED</span><h2>Schedule overages</h2><ul>{overruns.map(({ activity, minutes }) => <li key={activity.id}><strong>{activity.title}</strong><span>+{minutes}m after its scheduled end</span></li>)}</ul></section>}
      <p className="fine-print centered">Done records actual end time. If an overrun collides with later flexible blocks, the schedule cascades forward. Fixed collisions are surfaced instead of silently moved.</p>
    </div>
  );
}
