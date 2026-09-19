import assert from "node:assert/strict";
import test from "node:test";
import { deterministicOptimize, validateOptimizationResponse } from "../lib/domain/optimizer";
import type { OptimizationRequest } from "../lib/domain/types";

const request: OptimizationRequest = {
  targets: [
    { category: "health", minutes: 480 },
    { category: "relationships", minutes: 60 },
    { category: "identity", minutes: 60 },
    { category: "challengeInterest", minutes: 120 },
  ],
  activities: [
    { id: "study", category: "challengeInterest", startMinutes: 780, endMinutes: 960, flexibility: "flexible" },
    { id: "call", category: "relationships", startMinutes: 990, endMinutes: 1020, flexibility: "flexible" },
    { id: "fixed", category: "health", startMinutes: 1080, endMinutes: 1140, flexibility: "fixed" },
  ],
};

test("fallback optimizer only changes known flexible items", () => {
  const response = deterministicOptimize(request);
  validateOptimizationResponse(request, response);
  assert.ok(response.changes.every((change) => change.activity_id !== "fixed"));
});
