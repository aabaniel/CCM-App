import { actualMinutesByCategory, plannedMinutesByCategory, scoreAllocation } from "./scoring";
import type { AppState, CategoryTargets, DayPlan } from "./types";
import { awardXP, updateStreak } from "./xp";

export const DEFAULT_TARGETS: CategoryTargets = {
  health: 480,
  relationships: 60,
  identity: 60,
  challengeInterest: 420,
};

export function createPlan(date: string, targets: CategoryTargets = DEFAULT_TARGETS): DayPlan {
  return {
    id: crypto.randomUUID(),
    date,
    state: "draft",
    targets: { ...targets },
    projectedScore: 0,
    createdAt: new Date().toISOString(),
    activities: [],
  };
}

export function recalculateProjectedScore(plan: DayPlan): DayPlan {
  return {
    ...plan,
    projectedScore: scoreAllocation(plan.targets, plannedMinutesByCategory(plan.activities)),
  };
}

export function finalizePlan(plan: DayPlan, now = new Date()): DayPlan {
  if (plan.state === "finalized") return plan;
  const activities = plan.activities.map((activity) =>
    activity.status === "planned" || activity.status === "active"
      ? { ...activity, status: "missed" as const }
      : activity,
  );
  return {
    ...plan,
    activities,
    state: "finalized",
    finalScore: scoreAllocation(plan.targets, actualMinutesByCategory(activities)),
    finalizedAt: now.toISOString(),
  };
}

export function normalizeStateForToday(state: AppState, today: string): AppState {
  let progress = state.progress;
  let changed = false;
  const plans = state.plans.map((plan) => {
    if (plan.date < today && plan.state !== "finalized") {
      changed = true;
      const finalized = finalizePlan(plan);
      progress = awardXP(progress, plan.date, "finalize");
      progress = updateStreak(progress, plan.date);
      return finalized;
    }
    if (plan.date === today && plan.state === "draft" && plan.committedAt) {
      changed = true;
      return { ...plan, state: "active" as const };
    }
    return plan;
  });
  return changed ? { ...state, plans, progress } : state;
}
