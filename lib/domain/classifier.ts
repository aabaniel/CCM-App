import type { ActivityCategory } from "./types";

const rules: Array<{ category: ActivityCategory; words: string[] }> = [
  { category: "health", words: ["sleep", "gym", "workout", "run", "meal", "breakfast", "lunch", "dinner", "doctor", "walk"] },
  { category: "relationships", words: ["call mom", "call dad", "parents", "family", "friend", "date", "hangout", "hang out", "dinner with"] },
  { category: "identity", words: ["guitar", "paint", "draw", "music", "journal", "photography", "hobby", "creative", "read novel"] },
  { category: "challengeInterest", words: ["study", "class", "lecture", "code", "coding", "leetcode", "project", "internship", "work", "assignment", "exam"] },
  { category: "maintenance", words: ["commute", "shower", "laundry", "clean", "groceries", "errand", "admin", "drive"] },
  { category: "free", words: ["gaming", "game", "netflix", "youtube", "free time", "relax", "scroll"] },
];

export function heuristicClassify(title: string): { category: ActivityCategory; confidence: number } {
  const normalized = title.toLowerCase().trim();
  for (const rule of rules) {
    if (rule.words.some((word) => normalized.includes(word))) {
      return { category: rule.category, confidence: 0.82 };
    }
  }
  return { category: "challengeInterest", confidence: 0.45 };
}
