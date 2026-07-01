import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type { QuizAnswers } from "@/types";

interface VerifyResponse {
  paid: boolean;
  answers: QuizAnswers | null;
  email: string | null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      const response: VerifyResponse = { paid: false, answers: null, email: null };
      return NextResponse.json(response);
    }

    const m = session.metadata ?? {};

    const answers: QuizAnswers = {
      style: (m["style"] as QuizAnswers["style"]) || "Classic",
      gender: (m["gender"] as QuizAnswers["gender"]) || "Surprise me",
      firstLetter: m["firstLetter"] || "Any",
      syllables: (m["syllables"] as QuizAnswers["syllables"]) || "Any",
      origin: (m["origin"] as QuizAnswers["origin"]) || "Any",
      meaning: (m["meaning"] as QuizAnswers["meaning"]) || "Any",
      siblingName: m["siblingName"] || "",
      lastName: m["lastName"] || "",
      namesToAvoid: m["namesToAvoid"] || "",
      vibe: (m["vibe"] as QuizAnswers["vibe"]) || "Thoughtful",
    };

    const response: VerifyResponse = {
      paid: true,
      answers,
      email: session.customer_details?.email ?? null,
    };

    return NextResponse.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
