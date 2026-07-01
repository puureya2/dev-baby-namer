import { NextRequest, NextResponse } from "next/server";
import { generateNames } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";
import type { QuizAnswers } from "@/types";

interface RequestBody {
  answers: QuizAnswers;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "Retry-After": "60",
        },
      }
    );
  }

  try {
    const body: RequestBody = (await req.json()) as RequestBody;
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: "Missing quiz answers" }, { status: 400 });
    }

    const names = await generateNames(answers);

    return NextResponse.json(
      { names },
      {
        headers: {
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate names";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
