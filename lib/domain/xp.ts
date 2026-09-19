import type { UserProgress } from "./types";

export type XPEvent = "commit" | "start" | "complete" | "finalize";

const XP_VALUES: Record<XPEvent, number> = {
  commit: 30,
  start: 20,
  complete: 20,
  finalize: 30,
};

export function levelForXP(totalXP: number): number {
  return Math.floor(Math.max(0, totalXP) / 500) + 1;
}

export function awardXP(progress: UserProgress, dateKey: string, event: XPEvent): UserProgress {
  const key = `${dateKey}:${event}`;
  if (progress.awardedEvents.includes(key)) return progress;
  return {
    ...progress,
    totalXP: progress.totalXP + XP_VALUES[event],
    awardedEvents: [...progress.awardedEvents, key],
  };
}

export function updateStreak(progress: UserProgress, finalizedDate: string): UserProgress {
  if (progress.lastCompletedLoopDate === finalizedDate) return progress;

  let currentStreak = 1;
  if (progress.lastCompletedLoopDate) {
    const previous = new Date(`${progress.lastCompletedLoopDate}T12:00:00`);
    const current = new Date(`${finalizedDate}T12:00:00`);
    const days = Math.round((current.getTime() - previous.getTime()) / 86_400_000);
    if (days === 1) currentStreak = progress.currentStreak + 1;
  }

  return {
    ...progress,
    currentStreak,
    longestStreak: Math.max(progress.longestStreak, currentStreak),
    lastCompletedLoopDate: finalizedDate,
  };
}
