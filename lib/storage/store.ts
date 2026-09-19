"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cascadeFutureActivities } from "../domain/schedule";
import { localDateKey, minutesNow, offsetDateKey } from "../domain/dates";
import { createPlan, normalizeStateForToday, recalculateProjectedScore } from "../domain/plans";
import { awardXP } from "../domain/xp";
import type { Activity, AppState, CategoryTargets, DayPlan, OptimizationResponse } from "../domain/types";
import { demoState } from "../demo/seed";

const STORAGE_KEY = "timebudget.web.v1";

function emptyState(): AppState {
  return {
    version: 1,
    onboardingCompleted: false,
    plans: [],
    progress: { totalXP: 0, currentStreak: 0, longestStreak: 0, awardedEvents: [] },
  };
}

function safeRead(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.plans)) return emptyState();
    return normalizeStateForToday(parsed, localDateKey());
  } catch {
    return emptyState();
  }
}

export function useTimeBudgetStore() {
  const [state, setState] = useState<AppState>(() => emptyState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(safeRead());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  const mutatePlan = useCallback((date: string, updater: (plan: DayPlan) => DayPlan) => {
    setState((current) => {
      let found = false;
      const plans = current.plans.map((plan) => {
        if (plan.date !== date) return plan;
        found = true;
        return updater(plan);
      });
      if (!found) plans.push(updater(createPlan(date)));
      return { ...current, plans };
    });
  }, []);

  const ensurePlan = useCallback((date: string) => {
    setState((current) => {
      if (current.plans.some((plan) => plan.date === date)) return current;
      return { ...current, plans: [...current.plans, createPlan(date)] };
    });
  }, []);

  const setTargets = useCallback(
    (date: string, targets: CategoryTargets) =>
      mutatePlan(date, (plan) => recalculateProjectedScore({ ...plan, targets })),
    [mutatePlan],
  );

  const addActivity = useCallback(
    (date: string, activity: Activity) =>
      mutatePlan(date, (plan) => recalculateProjectedScore({ ...plan, activities: [...plan.activities, activity] })),
    [mutatePlan],
  );

  const removeActivity = useCallback(
    (date: string, id: string) =>
      mutatePlan(date, (plan) => recalculateProjectedScore({ ...plan, activities: plan.activities.filter((a) => a.id !== id) })),
    [mutatePlan],
  );

  const commitPlan = useCallback((date: string) => {
    setState((current) => {
      const plans = current.plans.map((plan) =>
        plan.date === date ? { ...plan, committedAt: plan.committedAt ?? new Date().toISOString() } : plan,
      );
      return { ...current, plans, progress: awardXP(current.progress, date, "commit") };
    });
  }, []);

  const startActivity = useCallback((date: string, id: string) => {
    setState((current) => {
      const plans = current.plans.map((plan) => {
        if (plan.date !== date) return plan;
        return {
          ...plan,
          activities: plan.activities.map((activity) =>
            activity.id === id && activity.status === "planned"
              ? { ...activity, status: "active" as const, actualStartISO: activity.actualStartISO ?? new Date().toISOString() }
              : activity,
          ),
        };
      });
      return { ...current, plans, progress: awardXP(current.progress, date, "start") };
    });
  }, []);

  const skipActivity = useCallback((date: string, id: string) => {
    mutatePlan(date, (plan) => ({
      ...plan,
      activities: plan.activities.map((activity) =>
        activity.id === id && activity.status === "planned" ? { ...activity, status: "skipped" as const } : activity,
      ),
    }));
  }, [mutatePlan]);

  const completeActivity = useCallback((date: string, id: string) => {
    let scheduleError: Error | undefined;
    const now = new Date();
    const plans = state.plans.map((plan) => {
      if (plan.date !== date) return plan;
      const ended = plan.activities.map((activity) =>
        activity.id === id && activity.status === "active"
          ? { ...activity, status: "completed" as const, actualEndISO: now.toISOString() }
          : activity,
      );
      try {
        const cascaded = cascadeFutureActivities(ended, id, minutesNow(now));
        return recalculateProjectedScore({ ...plan, activities: cascaded.activities });
      } catch (error) {
        scheduleError = error instanceof Error ? error : new Error("Could not shift the remaining schedule.");
        return recalculateProjectedScore({ ...plan, activities: ended });
      }
    });
    setState({ ...state, plans, progress: awardXP(state.progress, date, "complete") });
    return scheduleError;
  }, [state]);

  const applyOptimization = useCallback(
    (date: string, response: OptimizationResponse) =>
      mutatePlan(date, (plan) => {
        const byId = new Map(response.changes.map((change) => [change.activity_id, change]));
        return recalculateProjectedScore({
          ...plan,
          activities: plan.activities.map((activity) => {
            const change = byId.get(activity.id);
            if (!change) return activity;
            return {
              ...activity,
              plannedStartMinutes: change.new_start_minutes,
              plannedEndMinutes: change.new_end_minutes,
            };
          }),
        });
      }),
    [mutatePlan],
  );

  const completeOnboarding = useCallback((targets: CategoryTargets) => {
    const tomorrow = offsetDateKey(1);
    setState((current) => {
      const withoutTomorrow = current.plans.filter((plan) => plan.date !== tomorrow);
      return {
        ...current,
        onboardingCompleted: true,
        plans: [...withoutTomorrow, createPlan(tomorrow, targets)],
      };
    });
  }, []);

  const loadDemo = useCallback(() => setState(demoState()), []);
  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(emptyState());
  }, []);

  const api = useMemo(
    () => ({
      state,
      loaded,
      ensurePlan,
      setTargets,
      addActivity,
      removeActivity,
      commitPlan,
      startActivity,
      skipActivity,
      completeActivity,
      applyOptimization,
      completeOnboarding,
      loadDemo,
      reset,
      mutatePlan,
    }),
    [
      state,
      loaded,
      ensurePlan,
      setTargets,
      addActivity,
      removeActivity,
      commitPlan,
      startActivity,
      skipActivity,
      completeActivity,
      applyOptimization,
      completeOnboarding,
      loadDemo,
      reset,
      mutatePlan,
    ],
  );

  return api;
}
