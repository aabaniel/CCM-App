import type { Activity, ActivityFlexibility } from "./types";

export interface ScheduleBlock {
  id: string;
  startMinutes: number;
  endMinutes: number;
  flexibility: ActivityFlexibility;
}

export interface TimeRange {
  startMinutes: number;
  endMinutes: number;
}

export class ScheduleError extends Error {
  constructor(
    public readonly code: "invalid_interval" | "overlap" | "fixed_collision" | "day_overflow",
    public readonly activityId: string,
    message: string,
  ) {
    super(message);
  }
}

export function validateNonOverlapping(blocks: ScheduleBlock[]): void {
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);
  for (const block of sorted) {
    if (block.startMinutes < 0 || block.endMinutes > 1440 || block.endMinutes <= block.startMinutes) {
      throw new ScheduleError("invalid_interval", block.id, "Activity must stay within the day and end after it starts.");
    }
  }
  for (let index = 1; index < sorted.length; index += 1) {
    if (sorted[index].startMinutes < sorted[index - 1].endMinutes) {
      throw new ScheduleError("overlap", sorted[index].id, "Activities cannot overlap.");
    }
  }
}

export function blocksFromActivities(activities: Activity[]): ScheduleBlock[] {
  return activities.map((activity) => ({
    id: activity.id,
    startMinutes: activity.plannedStartMinutes,
    endMinutes: activity.plannedEndMinutes,
    flexibility: activity.flexibility,
  }));
}

export function unallocatedRanges(activities: Activity[]): TimeRange[] {
  const blocks = blocksFromActivities(activities);
  validateNonOverlapping(blocks);
  const sorted = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);
  const gaps: TimeRange[] = [];
  let cursor = 0;
  for (const block of sorted) {
    if (block.startMinutes > cursor) gaps.push({ startMinutes: cursor, endMinutes: block.startMinutes });
    cursor = Math.max(cursor, block.endMinutes);
  }
  if (cursor < 1440) gaps.push({ startMinutes: cursor, endMinutes: 1440 });
  return gaps;
}

export function cascadeFutureActivities(
  activities: Activity[],
  completedActivityId: string,
  actualEndMinutes: number,
): { activities: Activity[]; changedIds: string[] } {
  const sorted = [...activities].sort((a, b) => a.plannedStartMinutes - b.plannedStartMinutes);
  const completed = sorted.find((activity) => activity.id === completedActivityId);
  if (!completed) return { activities, changedIds: [] };

  let cursor = actualEndMinutes;
  const changedIds: string[] = [];
  const next = sorted.map((activity) => ({ ...activity }));

  for (const activity of next) {
    if (activity.id === completedActivityId) continue;
    if (activity.status !== "planned") continue;
    if (activity.plannedStartMinutes < completed.plannedEndMinutes) continue;

    if (activity.plannedStartMinutes < cursor) {
      if (activity.flexibility === "fixed") {
        throw new ScheduleError(
          "fixed_collision",
          activity.id,
          `The overrun collides with fixed activity “${activity.title}”.`,
        );
      }
      const duration = activity.plannedEndMinutes - activity.plannedStartMinutes;
      activity.plannedStartMinutes = cursor;
      activity.plannedEndMinutes = cursor + duration;
      if (activity.plannedEndMinutes > 1440) {
        throw new ScheduleError("day_overflow", activity.id, "The shifted schedule would run past midnight.");
      }
      changedIds.push(activity.id);
    }
    cursor = activity.plannedEndMinutes;
  }

  const byId = new Map(next.map((activity) => [activity.id, activity]));
  return {
    activities: activities.map((activity) => byId.get(activity.id) ?? activity),
    changedIds,
  };
}
