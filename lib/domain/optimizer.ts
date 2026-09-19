import type {
  CategoryTargets,
  OptimizationChange,
  OptimizationItem,
  OptimizationRequest,
  OptimizationResponse,
} from "./types";
import { validateNonOverlapping } from "./schedule";

const SCORED = new Set<keyof CategoryTargets>([
  "health",
  "relationships",
  "identity",
  "challengeInterest",
]);

function totals(items: OptimizationItem[]): CategoryTargets {
  const result: CategoryTargets = { health: 0, relationships: 0, identity: 0, challengeInterest: 0 };
  for (const item of items) {
    if (SCORED.has(item.category as keyof CategoryTargets)) {
      result[item.category as keyof CategoryTargets] += item.endMinutes - item.startMinutes;
    }
  }
  return result;
}

function targetsRecord(request: OptimizationRequest): CategoryTargets {
  const result: CategoryTargets = { health: 0, relationships: 0, identity: 0, challengeInterest: 0 };
  for (const target of request.targets) result[target.category] = Math.max(0, target.minutes);
  return result;
}

export function deterministicOptimize(request: OptimizationRequest): OptimizationResponse {
  const originalById = new Map(request.activities.map((item) => [item.id, item]));
  const items = request.activities
    .map((item) => ({ ...item }))
    .sort((a, b) => a.startMinutes - b.startMinutes);
  const target = targetsRecord(request);
  const current = totals(items);

  const surplus: Partial<Record<keyof CategoryTargets, number>> = {};
  const deficit: Partial<Record<keyof CategoryTargets, number>> = {};
  for (const category of Object.keys(target) as (keyof CategoryTargets)[]) {
    const delta = current[category] - target[category];
    if (delta > 0) surplus[category] = delta;
    if (delta < 0) deficit[category] = -delta;
  }

  // First shrink flexible activities in scored categories that exceed the user's target.
  // Keep every existing activity at least 15 minutes long.
  for (const item of [...items].reverse()) {
    const category = item.category as keyof CategoryTargets;
    const availableSurplus = surplus[category] ?? 0;
    if (!availableSurplus || item.flexibility !== "flexible" || !SCORED.has(category)) continue;
    const duration = item.endMinutes - item.startMinutes;
    const shrink = Math.min(availableSurplus, Math.max(0, duration - 15));
    if (shrink > 0) {
      item.endMinutes -= shrink;
      surplus[category] = availableSurplus - shrink;
    }
  }

  // Then use adjacent unallocated space to expand existing flexible activities in deficit categories.
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const category = item.category as keyof CategoryTargets;
    let need = deficit[category] ?? 0;
    if (!need || item.flexibility !== "flexible" || !SCORED.has(category)) continue;

    const previousEnd = index === 0 ? 0 : items[index - 1].endMinutes;
    const nextStart = index === items.length - 1 ? 1440 : items[index + 1].startMinutes;

    const afterGap = Math.max(0, nextStart - item.endMinutes);
    const after = Math.min(need, afterGap);
    item.endMinutes += after;
    need -= after;

    const beforeGap = Math.max(0, item.startMinutes - previousEnd);
    const before = Math.min(need, beforeGap);
    item.startMinutes -= before;
    need -= before;

    deficit[category] = need;
  }

  validateNonOverlapping(
    items.map((item) => ({
      id: item.id,
      startMinutes: item.startMinutes,
      endMinutes: item.endMinutes,
      flexibility: item.flexibility,
    })),
  );

  const changes: OptimizationChange[] = [];
  for (const item of items) {
    const original = originalById.get(item.id);
    if (!original) continue;
    if (item.startMinutes !== original.startMinutes || item.endMinutes !== original.endMinutes) {
      changes.push({
        activity_id: item.id,
        new_start_minutes: item.startMinutes,
        new_end_minutes: item.endMinutes,
      });
    }
  }
  return { changes };
}

export function validateOptimizationResponse(
  request: OptimizationRequest,
  response: OptimizationResponse,
): OptimizationResponse {
  const byId = new Map(request.activities.map((item) => [item.id, item]));
  const seen = new Set<string>();
  const next = request.activities.map((item) => ({ ...item }));

  for (const change of response.changes) {
    const original = byId.get(change.activity_id);
    if (!original) throw new Error("Optimizer returned an unknown activity id.");
    if (seen.has(change.activity_id)) throw new Error("Optimizer returned a duplicate activity id.");
    if (original.flexibility !== "flexible") throw new Error("Optimizer attempted to modify a fixed activity.");
    if (!Number.isInteger(change.new_start_minutes) || !Number.isInteger(change.new_end_minutes)) {
      throw new Error("Optimizer returned non-integer schedule minutes.");
    }
    if (change.new_start_minutes < 0 || change.new_end_minutes > 1440 || change.new_end_minutes <= change.new_start_minutes) {
      throw new Error("Optimizer returned an invalid interval.");
    }
    const item = next.find((candidate) => candidate.id === change.activity_id);
    if (!item) throw new Error("Optimizer activity lookup failed.");
    item.startMinutes = change.new_start_minutes;
    item.endMinutes = change.new_end_minutes;
    seen.add(change.activity_id);
  }

  validateNonOverlapping(
    next.map((item) => ({
      id: item.id,
      startMinutes: item.startMinutes,
      endMinutes: item.endMinutes,
      flexibility: item.flexibility,
    })),
  );

  return response;
}
