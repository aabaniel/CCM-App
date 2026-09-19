import { scoredCategories } from "./categories";
import type { Activity, CategoryTargets } from "./types";

export type ScoredMinutes = CategoryTargets;

export function blankScoredMinutes(): ScoredMinutes {
  return { health: 0, relationships: 0, identity: 0, challengeInterest: 0 };
}

export function scoreAllocation(target: CategoryTargets, observed: CategoryTargets): number {
  let discrepancy = 0;
  let normalization = 0;

  for (const category of scoredCategories) {
    const targetValue = Math.max(0, target[category] ?? 0);
    const observedValue = Math.max(0, observed[category] ?? 0);
    discrepancy += Math.abs(observedValue - targetValue);
    normalization += Math.max(observedValue, targetValue);
  }

  if (normalization === 0) return 100;
  const raw = 100 * (1 - discrepancy / normalization);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function plannedMinutesByCategory(activities: Activity[]): CategoryTargets {
  const result = blankScoredMinutes();
  for (const activity of activities) {
    if (activity.category in result) {
      result[activity.category as keyof CategoryTargets] += Math.max(
        0,
        activity.plannedEndMinutes - activity.plannedStartMinutes,
      );
    }
  }
  return result;
}

export function actualActivityMinutes(activity: Activity): number {
  if (!activity.actualStartISO || !activity.actualEndISO) return 0;
  const start = Date.parse(activity.actualStartISO);
  const end = Date.parse(activity.actualEndISO);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(0, Math.round((end - start) / 60000));
}

export function actualEndOverrunMinutes(activity: Activity, dateKey: string): number {
  if (!activity.actualEndISO) return 0;
  const actualEnd = new Date(activity.actualEndISO);
  if (!Number.isFinite(actualEnd.getTime())) return 0;

  const [year, month, day] = dateKey.split("-").map(Number);
  if (![year, month, day].every(Number.isInteger)) return 0;

  const scheduledDay = Date.UTC(year, month - 1, day);
  const actualDay = Date.UTC(actualEnd.getFullYear(), actualEnd.getMonth(), actualEnd.getDate());
  const dayOffset = Math.round((actualDay - scheduledDay) / 86_400_000);
  const actualEndMinutes = dayOffset * 1440 + actualEnd.getHours() * 60 + actualEnd.getMinutes();

  return Math.max(0, actualEndMinutes - activity.plannedEndMinutes);
}

export function actualMinutesByCategory(activities: Activity[]): CategoryTargets {
  const result = blankScoredMinutes();
  for (const activity of activities) {
    if (activity.category in result) {
      result[activity.category as keyof CategoryTargets] += actualActivityMinutes(activity);
    }
  }
  return result;
}
