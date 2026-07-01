import OpenAI from "openai";
import type { QuizAnswers, BabyName } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateNames(answers: QuizAnswers): Promise<BabyName[]> {
  const prompt = buildPrompt(answers);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a baby name expert. Return ONLY a valid JSON array of exactly 50 name objects. Each object must have: name (string), meaning (string, 1-2 sentences), origin (string), vibe (string, 3-5 words describing the personality). No markdown, no explanation, just the JSON array.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content ?? "";
  const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
  const parsed: unknown = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("GPT did not return an array");
  }

  return parsed.map((item: unknown): BabyName => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("name" in item) ||
      !("meaning" in item) ||
      !("origin" in item) ||
      !("vibe" in item)
    ) {
      throw new Error("Invalid name object from GPT");
    }
    const obj = item as Record<string, unknown>;
    return {
      name: String(obj["name"]),
      meaning: String(obj["meaning"]),
      origin: String(obj["origin"]),
      vibe: String(obj["vibe"]),
    };
  });
}

function buildPrompt(a: QuizAnswers): string {
  const parts: string[] = [
    `Generate exactly 50 unique baby names based on these preferences:`,
    `- Style: ${a.style}`,
    `- Gender: ${a.gender}`,
    `- First letter: ${a.firstLetter === "Any" ? "any letter" : `must start with ${a.firstLetter}`}`,
    `- Syllable count: ${a.syllables}`,
    `- Cultural/ethnic origin: ${a.origin}`,
    `- Meaning theme: ${a.meaning}`,
    `- Personality vibe: ${a.vibe}`,
  ];

  if (a.siblingName.trim()) {
    parts.push(`- Sibling's name: ${a.siblingName} (complement this name)`);
  }
  if (a.lastName.trim()) {
    parts.push(`- Last name: ${a.lastName} (names should flow well with this surname)`);
  }
  if (a.namesToAvoid.trim()) {
    parts.push(`- Names to AVOID: ${a.namesToAvoid}`);
  }

  parts.push(`Return ONLY a JSON array of 50 objects: [{name, meaning, origin, vibe}, ...]`);
  return parts.join("\n");
}
