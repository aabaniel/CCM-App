import assert from "node:assert/strict";
import test from "node:test";
import { allocationRecommendations } from "../lib/domain/recommendations";

test("recommendations identify the largest target gaps without creating activities", () => {
  const recommendations = allocationRecommendations(
    { health: 480, relationships: 60, identity: 60, challengeInterest: 420 },
    { health: 360, relationships: 60, identity: 60, challengeInterest: 600 },
  );

  assert.deepEqual(recommendations, [
    { category: "challengeInterest", direction: "reduce", minutes: 180 },
    { category: "health", direction: "add", minutes: 120 },
  ]);
});
