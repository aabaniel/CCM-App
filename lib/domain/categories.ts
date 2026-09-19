import type { ActivityCategory } from "./types";

export const scoredCategories = [
  "health",
  "relationships",
  "identity",
  "challengeInterest",
] as const;

export const categoryMeta: Record<
  ActivityCategory,
  { label: string; shortLabel: string; scored: boolean; color: string }
> = {
  health: { label: "Health", shortLabel: "Health", scored: true, color: "#61d095" },
  relationships: { label: "Relationships", shortLabel: "Relations", scored: true, color: "#f3a65a" },
  identity: { label: "Identity", shortLabel: "Identity", scored: true, color: "#bf8cff" },
  challengeInterest: {
    label: "Challenge / Interest",
    shortLabel: "Challenge",
    scored: true,
    color: "#68a7ff",
  },
  maintenance: { label: "Maintenance", shortLabel: "Maintenance", scored: false, color: "#8994a8" },
  free: { label: "Free", shortLabel: "Free", scored: false, color: "#f3dc70" },
};

export function isScoredCategory(category: ActivityCategory): category is (typeof scoredCategories)[number] {
  return scoredCategories.includes(category as (typeof scoredCategories)[number]);
}
