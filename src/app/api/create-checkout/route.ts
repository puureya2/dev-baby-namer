import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/url";
import type { QuizAnswers } from "@/types";

interface RequestBody {
  answers: QuizAnswers;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = (await req.json()) as RequestBody;
    const { answers } = body;

    if (!answers) {
      return NextResponse.json({ error: "Missing quiz answers" }, { status: 400 });
    }

    const appUrl = getAppUrl();

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BabyNamer — 50 Personalised Baby Names",
              description: "AI-generated baby names with meanings, origins, and vibes.",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      metadata: {
        style: answers.style,
        gender: answers.gender,
        firstLetter: answers.firstLetter,
        syllables: answers.syllables,
        origin: answers.origin,
        meaning: answers.meaning,
        siblingName: answers.siblingName,
        lastName: answers.lastName,
        namesToAvoid: answers.namesToAvoid,
        vibe: answers.vibe,
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
