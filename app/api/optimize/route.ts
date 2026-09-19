import { NextResponse } from "next/server";
import { callOpenAIStructured } from "@/lib/ai/openai";
import { deterministicOptimize, validateOptimizationResponse } from "@/lib/domain/optimizer";
import type { OptimizationRequest, OptimizationResponse } from "@/lib/domain/types";

export const runtime = "nodejs";

const schema = {
  type: "object",
  properties: {
    changes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          activity_id: { type: "string" },
          new_start_minutes: { type: "integer", minimum: 0, maximum: 1439 },
          new_end_minutes: { type: "integer", minimum: 1, maximum: 1440 },
        },
        required: ["activity_id", "new_start_minutes", "new_end_minutes"],
        additionalProperties: false,
      },
    },
  },
  required: ["changes"],
  additionalProperties: false,
};

function isOptimizationRequest(value: unknown): value is OptimizationRequest {
  if (!value || typeof value !== "object") return false;
  const object = value as Record<string, unknown>;
  return Array.isArray(object.targets) && Array.isArray(object.activities) && object.activities.length <= 80;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  if (!isOptimizationRequest(body)) {
    return NextResponse.json({ error: "Invalid optimization request." }, { status: 400 });
  }

  const fallback = () => validateOptimizationResponse(body, deterministicOptimize(body));
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ ...fallback(), source: "fallback" });
  }

  try {
    const result = await callOpenAIStructured<OptimizationResponse>({
      name: "day_optimization",
      schema,
      instructions:
        "Optimize an existing daily schedule to bring the four scored category totals closer to the user's target minutes. You may only move or resize existing activities marked flexible. Never add, delete, rename, or modify a fixed activity. Keep all intervals within 0..1440, keep every activity at least 15 minutes, and do not overlap activities. Use only the supplied activity ids. Return only changes; omit unchanged activities.",
      input: body,
    });
    return NextResponse.json({ ...validateOptimizationResponse(body, result), source: "openai" });
  } catch {
    return NextResponse.json({ ...fallback(), source: "fallback" });
  }
}
