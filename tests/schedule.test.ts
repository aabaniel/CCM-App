import assert from "node:assert/strict";
import test from "node:test";
import { cascadeFutureActivities, validateNonOverlapping } from "../lib/domain/schedule";
import type { Activity } from "../lib/domain/types";

const a = (id: string, start: number, end: number, flexibility: Activity["flexibility"] = "flexible"): Activity => ({
  id, title: id, category: "challengeInterest", plannedStartMinutes: start, plannedEndMinutes: end, flexibility, status: "planned",
});

test("overlap validation rejects intersecting blocks", () => {
  assert.throws(() => validateNonOverlapping([
    { id: "a", startMinutes: 60, endMinutes: 120, flexibility: "flexible" },
    { id: "b", startMinutes: 110, endMinutes: 180, flexibility: "flexible" },
  ]));
});

test("cascade uses gaps before shifting later blocks", () => {
  const activities = [a("done", 120, 180), a("b", 210, 270), a("c", 270, 330)];
  const result = cascadeFutureActivities(activities, "done", 195);
  assert.equal(result.activities.find((x) => x.id === "b")?.plannedStartMinutes, 210);
  assert.equal(result.changedIds.length, 0);
});

test("cascade shifts colliding flexible blocks", () => {
  const activities = [a("done", 120, 180), a("b", 180, 240), a("c", 240, 300)];
  const result = cascadeFutureActivities(activities, "done", 195);
  assert.equal(result.activities.find((x) => x.id === "b")?.plannedStartMinutes, 195);
  assert.equal(result.activities.find((x) => x.id === "c")?.plannedStartMinutes, 255);
});
