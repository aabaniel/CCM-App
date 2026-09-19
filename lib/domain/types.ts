export const CATEGORY_VALUES = [
  "health",
  "relationships",
  "identity",
  "challengeInterest",
  "maintenance",
  "free",
] as const;

export type ActivityCategory = (typeof CATEGORY_VALUES)[number];
export type ActivityStatus = "planned" | "active" | "completed" | "skipped" | "missed";
export type ActivityFlexibility = "fixed" | "flexible";
export type DayPlanState = "draft" | "active" | "finalized";

export type CategoryTargets = Record<
  "health" | "relationships" | "identity" | "challengeInterest",
  number
>;

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  plannedStartMinutes: number;
  plannedEndMinutes: number;
  actualStartISO?: string;
  actualEndISO?: string;
  flexibility: ActivityFlexibility;
  status: ActivityStatus;
}

export interface DayPlan {
  id: string;
  date: string;
  state: DayPlanState;
  committedAt?: string;
  targets: CategoryTargets;
  projectedScore: number;
  finalScore?: number;
  createdAt: string;
  finalizedAt?: string;
  activities: Activity[];
}

export interface UserProgress {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedLoopDate?: string;
  awardedEvents: string[];
}

export interface AppState {
  version: 1;
  onboardingCompleted: boolean;
  plans: DayPlan[];
  progress: UserProgress;
}

export interface OptimizationTarget {
  category: keyof CategoryTargets;
  minutes: number;
}

export interface OptimizationItem {
  id: string;
  category: ActivityCategory;
  startMinutes: number;
  endMinutes: number;
  flexibility: ActivityFlexibility;
}

export interface OptimizationRequest {
  targets: OptimizationTarget[];
  activities: OptimizationItem[];
}

export interface OptimizationChange {
  activity_id: string;
  new_start_minutes: number;
  new_end_minutes: number;
}

export interface OptimizationResponse {
  changes: OptimizationChange[];
}
