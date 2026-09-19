import assert from "node:assert/strict";
import test from "node:test";
import { actualEndOverrunMinutes, scoreAllocation } from "../lib/domain/scoring";
import type { Activity } from "../lib/domain/types";

const target = { health: 480, relationships: 60, identity: 60, challengeInterest: 420 };

test("perfect congruence scores 100", () => {
  assert.equal(scoreAllocation(target, target), 100);
});

test("large discrepancy lowers score", () => {
  const score = scoreAllocation(target, { health: 240, relationships: 0, identity: 0, challengeInterest: 720 });
  assert.ok(score < 70);
});

test("actual end overrun measures time past the scheduled end", () => {
  const activity: Activity = {
    id: "study",
    title: "Study",
    category: "challengeInterest",
    plannedStartMinutes: 540,
    plannedEndMinutes: 600,
    actualEndISO: new Date(2026, 8, 19, 10, 30).toISOString(),
    flexibility: "flexible",
    status: "completed",
  };

  assert.equal(actualEndOverrunMinutes(activity, "2026-09-19"), 30);
});
