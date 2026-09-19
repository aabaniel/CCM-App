import type { ActivityCategory } from "../domain/types";

const RESPONSES_URL = "https://api.openai.com/v1/responses";

interface StructuredCall<T> {
  name: string;
  schema: Record<string, unknown>;
  instructions: string;
  input: unknown;
}

function extractOutputText(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const object = payload as Record<string, unknown>;
  if (typeof object.output_text === "string") return object.output_text;
  if (!Array.isArray(object.output)) return undefined;
  for (const item of object.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as Record<string, unknown>).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || typeof part !== "object") continue;
      const text = (part as Record<string, unknown>).text;
      if (typeof text === "string") return text;
    }
  }
  return undefined;
}

export async function callOpenAIStructured<T>({ name, schema, instructions, input }: StructuredCall<T>): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const response = await fetch(RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      input: [
        { role: "system", content: [{ type: "input_text", text: instructions }] },
        { role: "user", content: [{ type: "input_text", text: JSON.stringify(input) }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body.slice(0, 300)}`);
  }
  const payload = (await response.json()) as unknown;
  const text = extractOutputText(payload);
  if (!text) throw new Error("OpenAI response did not contain structured output text.");
  return JSON.parse(text) as T;
}

export function isCategory(value: unknown): value is ActivityCategory {
  return ["health", "relationships", "identity", "challengeInterest", "maintenance", "free"].includes(String(value));
}
