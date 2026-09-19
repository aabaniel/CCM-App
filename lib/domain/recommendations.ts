import { scoredCategories } from "./categories";
import type { CategoryTargets } from "./types";

export interface AllocationRecommendation {
  category: keyof CategoryTargets;
  direction: "add" | "reduce";
  minutes: number;
}

/**
 * Produces advisory-only, target-based suggestions. It never creates or
 * changes activities; persistence and schedule edits remain user actions.
 */
export function allocationRecommendations(
  targets: CategoryTargets,
  observed: CategoryTargets,
  limit = 2,
): AllocationRecommendation[] {
  return scoredCategories
    .map((category) => {
      const difference = Math.round((observed[category] ?? 0) - (targets[category] ?? 0));
      return {
        category,
        direction: difference < 0 ? "add" as const : "reduce" as const,
        minutes: Math.abs(difference),
      };
    })
    .filter((recommendation) => recommendation.minutes > 0)
    .sort((left, right) => right.minutes - left.minutes)
    .slice(0, Math.max(0, limit));
}
