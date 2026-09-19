import { NextResponse } from "next/server";
import { callOpenAIStructured, isCategory } from "@/lib/ai/openai";
import { heuristicClassify } from "@/lib/domain/classifier";

export const runtime = "nodejs";

const schema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["health", "relationships", "identity", "challengeInterest", "maintenance", "free"],
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["category", "confidence"],
  additionalProperties: false,
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { task_name?: unknown } | null;
  const taskName = typeof body?.task_name === "string" ? body.task_name.trim() : "";
  if (!taskName || taskName.length > 160) {
    return NextResponse.json({ error: "task_name must be 1–160 characters." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ task_name: taskName, ...heuristicClassify(taskName), source: "fallback" });
  }

  try {
    const result = await callOpenAIStructured<{ category: unknown; confidence: unknown }>({
      name: "task_classification",
      schema,
      instructions:
        "Classify one activity into exactly one 1440 category. Health includes sleep/exercise/nutrition. Relationships includes family/friends/romantic connection. Identity includes hobbies and personally meaningful creative pursuits. Challenge/Interest includes school, work, deliberate practice and skill-building. Maintenance includes commute, hygiene, chores, errands and life admin. Free is intentional unstructured leisure. Return only the requested schema.",
      input: { task_name: taskName },
    });
    if (!isCategory(result.category) || typeof result.confidence !== "number") throw new Error("Invalid classifier output.");
    return NextResponse.json({ task_name: taskName, category: result.category, confidence: result.confidence, source: "openai" });
  } catch {
    return NextResponse.json({ task_name: taskName, ...heuristicClassify(taskName), source: "fallback" });
  }
}
