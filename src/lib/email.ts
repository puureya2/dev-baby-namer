import { Resend } from "resend";
import type { BabyName } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResultsEmail(
  to: string,
  names: BabyName[],
  resultsUrl: string
): Promise<void> {
  const nameList = names
    .slice(0, 10)
    .map((n, i) => `<li><strong>${n.name}</strong> — ${n.meaning}</li>`)
    .join("\n");

  await resend.emails.send({
    from: "BabyNamer <names@babynamer.vercel.app>",
    to,
    subject: "Your 50 personalised baby names are ready!",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FFF8F0; padding: 40px 24px; border-radius: 16px;">
        <h1 style="color: #D4704A; font-size: 28px; margin-bottom: 8px;">Your Baby Names Are Ready!</h1>
        <p style="color: #555; font-size: 16px; margin-bottom: 24px;">We generated 50 personalised names just for you. Here's a preview of your top picks:</p>
        <ul style="color: #333; font-size: 15px; line-height: 2;">
          ${nameList}
        </ul>
        <p style="color: #555; font-size: 15px;">...and 40 more waiting for you!</p>
        <a href="${resultsUrl}" style="display: inline-block; margin-top: 24px; padding: 14px 32px; background: #D4704A; color: white; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: bold;">
          View All 50 Names →
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">Save this link — it's the only way to access your results.</p>
      </div>
    `,
  });
}
