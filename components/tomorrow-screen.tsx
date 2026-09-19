"use client";

import { useEffect, useMemo, useState } from "react";
import { AddActivityForm } from "./add-activity-form";
import { DayTimeline } from "./day-timeline";
import { ScoreRing } from "./score-ring";
import { categoryMeta } from "@/lib/domain/categories";
import { dateLabel, formatDuration, offsetDateKey } from "@/lib/domain/dates";
import { plannedMinutesByCategory, scoreAllocation } from "@/lib/domain/scoring";
import { unallocatedRanges } from "@/lib/domain/schedule";
import { validateOptimizationResponse } from "@/lib/domain/optimizer";
import type { CategoryTargets, OptimizationRequest, OptimizationResponse } from "@/lib/domain/types";
import type { useTimeBudgetStore } from "@/lib/storage/store";

type Store = ReturnType<typeof useTimeBudgetStore>;

export function TomorrowScreen({ store }: { store: Store }) {
  const date = offsetDateKey(1);
  const plan = store.state.plans.find((candidate) => candidate.date === date);
  const [optimizing, setOptimizing] = useState(false);
  const [proposal, setProposal] = useState<OptimizationResponse | null>(null);
  const [optSource, setOptSource] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => store.ensurePlan(date), [date, store.ensurePlan]);

  const totals = useMemo(() => (plan ? plannedMinutesByCategory(plan.activities) : null), [plan]);
  const gaps = useMemo(() => {
    try { return plan ? unallocatedRanges(plan.activities) : []; } catch { return []; }
  }, [plan]);
  const unallocated = gaps.reduce((sum, gap) => sum + gap.endMinutes - gap.startMinutes, 0);

  if (!plan || !totals) return <div className="loading-card">Preparing tomorrow…</div>;

  const setTarget = (key: keyof CategoryTargets, value: number) => {
    store.setTargets(date, { ...plan.targets, [key]: value });
  };

  const optimize = async () => {
    setOptimizing(true);
    setError("");
    try {
      const request: OptimizationRequest = {
        targets: Object.entries(plan.targets).map(([category, minutes]) => ({ category: category as keyof CategoryTargets, minutes })),
        activities: plan.activities.map((activity) => ({
          id: activity.id,
          category: activity.category,
          startMinutes: activity.plannedStartMinutes,
          endMinutes: activity.plannedEndMinutes,
          flexibility: activity.flexibility,
        })),
      };
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (!response.ok) throw new Error("Optimizer request failed.");
      const data = (await response.json()) as OptimizationResponse & { source?: string };
      setProposal(validateOptimizationResponse(request, data));
      setOptSource(data.source ?? "optimizer");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not optimize this plan.");
    } finally {
      setOptimizing(false);
    }
  };

  const previewActivities = proposal
    ? plan.activities.map((activity) => {
        const change = proposal.changes.find((item) => item.activity_id === activity.id);
        return change ? { ...activity, plannedStartMinutes: change.new_start_minutes, plannedEndMinutes: change.new_end_minutes } : activity;
      })
    : plan.activities;
  const previewScore = scoreAllocation(plan.targets, plannedMinutesByCategory(previewActivities));

  return (
    <div className="screen">
      <div className="screen-heading">
        <div><span className="eyebrow">PLAN TOMORROW</span><h1>{dateLabel(date)}</h1></div>
        <ScoreRing score={plan.projectedScore} />
      </div>

      <section className="card">
        <div className="section-heading"><div><span className="eyebrow">YOUR TARGET</span><h2>What should tomorrow reflect?</h2></div><span className="muted">Daily</span></div>
        <div className="compact-targets">
          {(Object.keys(plan.targets) as (keyof CategoryTargets)[]).map((key) => (
            <label key={key} className="compact-target">
              <div><span>{categoryMeta[key].label}</span><strong>{formatDuration(plan.targets[key])}</strong></div>
              <input type="range" min="0" max="720" step="15" value={plan.targets[key]} onChange={(event) => setTarget(key, Number(event.target.value))} />
              <small>Planned {formatDuration(totals[key])}</small>
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-heading"><div><span className="eyebrow">24-HOUR BUDGET</span><h2>{formatDuration(1440 - unallocated)} allocated · {formatDuration(unallocated)} open</h2></div></div>
        <DayTimeline activities={plan.activities} />
        {!!plan.activities.length && (
          <div className="remove-row">
            {plan.activities.map((activity) => <button key={activity.id} className="chip" onClick={() => store.removeActivity(date, activity.id)}>× {activity.title}</button>)}
          </div>
        )}
      </section>

      <section className="card"><span className="eyebrow">ADD BLOCK</span><h2>What are you making time for?</h2><AddActivityForm existing={plan.activities} onAdd={(activity) => store.addActivity(date, activity)} /></section>

      <section className="action-card">
        <div><span className="eyebrow">AI / RULE-BASED OPTIMIZER</span><h2>Improve alignment without inventing tasks.</h2><p>Only existing flexible blocks can move or resize. Fixed activities stay fixed.</p></div>
        <button className="secondary-button" onClick={optimize} disabled={optimizing || !plan.activities.length}>{optimizing ? "Optimizing…" : "Optimize my day"}</button>
      </section>
      {error && <p className="form-error">{error}</p>}

      {proposal && (
        <section className="proposal-card">
          <div className="proposal-score"><span>Projected score</span><strong>{plan.projectedScore} <em>→</em> {previewScore}</strong><small>{optSource === "openai" ? "OpenAI proposal" : "Deterministic demo proposal"}</small></div>
          <div className="proposal-changes">{proposal.changes.length ? `${proposal.changes.length} block${proposal.changes.length === 1 ? "" : "s"} adjusted` : "No safe improvement found with the current activities."}</div>
          <div className="button-row"><button className="primary-button" disabled={!proposal.changes.length} onClick={() => { store.applyOptimization(date, proposal); setProposal(null); }}>Apply changes</button><button className="ghost-button" onClick={() => setProposal(null)}>Keep original</button></div>
        </section>
      )}

      <button className="primary-button full large" onClick={() => store.commitPlan(date)} disabled={!plan.activities.length}>{plan.committedAt ? "Tomorrow committed ✓" : "Commit tomorrow"}</button>
      <p className="fine-print centered">Web demo note: browser timers are not a substitute for native iOS background notifications. Keep the page open for demo alerts.</p>
    </div>
  );
}
