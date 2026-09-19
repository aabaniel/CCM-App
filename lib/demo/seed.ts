import { scoreAllocation, plannedMinutesByCategory } from "../domain/scoring";
import { offsetDateKey } from "../domain/dates";
import type { Activity, AppState, DayPlan } from "../domain/types";

function activity(
  title: string,
  category: Activity["category"],
  start: number,
  end: number,
  flexibility: Activity["flexibility"] = "flexible",
): Activity {
  return {
    id: crypto.randomUUID(),
    title,
    category,
    plannedStartMinutes: start,
    plannedEndMinutes: end,
    flexibility,
    status: "planned",
  };
}

function plan(date: string, activities: Activity[], state: DayPlan["state"] = "draft"): DayPlan {
  const targets = { health: 480, relationships: 60, identity: 60, challengeInterest: 390 };
  return {
    id: crypto.randomUUID(),
    date,
    state,
    committedAt: state !== "draft" ? new Date().toISOString() : undefined,
    targets,
    projectedScore: scoreAllocation(targets, plannedMinutesByCategory(activities)),
    createdAt: new Date().toISOString(),
    activities,
  };
}

export function demoState(): AppState {
  const today = offsetDateKey(0);
  const tomorrow = offsetDateKey(1);
  const yesterday = offsetDateKey(-1);

  const yesterdayActivities = [
    activity("Sleep", "health", 0, 450, "fixed"),
    activity("Class", "challengeInterest", 540, 720, "fixed"),
    activity("Study algorithms", "challengeInterest", 780, 960),
    activity("Gym", "health", 990, 1050),
    activity("Call parents", "relationships", 1140, 1200),
    activity("Guitar", "identity", 1260, 1320),
  ].map((item) => {
    const start = new Date(`${yesterday}T00:00:00`);
    start.setMinutes(item.plannedStartMinutes);
    const end = new Date(`${yesterday}T00:00:00`);
    end.setMinutes(item.plannedEndMinutes);
    return { ...item, status: "completed" as const, actualStartISO: start.toISOString(), actualEndISO: end.toISOString() };
  });
  const yesterdayPlan = plan(yesterday, yesterdayActivities, "finalized");
  yesterdayPlan.finalScore = 92;
  yesterdayPlan.finalizedAt = new Date().toISOString();

  const todayPlan = plan(
    today,
    [
      activity("Sleep", "health", 0, 480, "fixed"),
      activity("Morning routine", "maintenance", 480, 540),
      activity("Class", "challengeInterest", 540, 720, "fixed"),
      activity("Lunch", "health", 720, 780),
      activity("Study algorithms", "challengeInterest", 810, 990),
      activity("Gym", "health", 1020, 1080),
      activity("Call parents", "relationships", 1140, 1200),
      activity("Gaming", "free", 1260, 1380),
    ],
    "active",
  );

  const tomorrowPlan = plan(tomorrow, [
    activity("Sleep", "health", 0, 420, "fixed"),
    activity("Morning routine", "maintenance", 420, 480),
    activity("Class", "challengeInterest", 540, 720, "fixed"),
    activity("Study algorithms", "challengeInterest", 780, 990),
    activity("Call parents", "relationships", 1020, 1050),
    activity("Gym", "health", 1080, 1140),
    activity("Guitar", "identity", 1200, 1260),
    activity("Gaming", "free", 1260, 1380),
  ]);

  return {
    version: 1,
    onboardingCompleted: true,
    plans: [yesterdayPlan, todayPlan, tomorrowPlan],
    progress: {
      totalXP: 620,
      currentStreak: 3,
      longestStreak: 5,
      lastCompletedLoopDate: yesterday,
      awardedEvents: [`${yesterday}:finalize`, `${today}:commit`],
    },
  };
}
