"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { BabyName } from "@/types";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [stage, setStage] = useState<"verifying" | "generating" | "done" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [names, setNames] = useState<BabyName[]>([]);
  const ran = useRef(false);

  useEffect(() => {
    if (!sessionId || ran.current) return;
    ran.current = true;
    processSession(sessionId);
  }, [sessionId]);

  async function processSession(id: string) {
    try {
      // 1. Verify payment
      const verifyRes = await fetch(`/api/verify-session?session_id=${id}`);
      if (!verifyRes.ok) throw new Error("Payment verification failed");

      const verifyData: unknown = await verifyRes.json();
      if (
        typeof verifyData !== "object" ||
        verifyData === null ||
        !("paid" in verifyData)
      ) {
        throw new Error("Invalid verification response");
      }

      const { paid, answers, email } = verifyData as {
        paid: boolean;
        answers: import("@/types").QuizAnswers | null;
        email: string | null;
      };

      if (!paid) {
        throw new Error("Payment not completed. Please try again.");
      }

      if (!answers) {
        throw new Error("Could not retrieve your quiz answers.");
      }

      // 2. Generate names
      setStage("generating");
      const genRes = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!genRes.ok) {
        const errData: unknown = await genRes.json();
        const msg =
          typeof errData === "object" && errData !== null && "error" in errData
            ? String((errData as { error: unknown }).error)
            : "Name generation failed";
        throw new Error(msg);
      }

      const genData: unknown = await genRes.json();
      if (
        typeof genData !== "object" ||
        genData === null ||
        !("names" in genData) ||
        !Array.isArray((genData as { names: unknown }).names)
      ) {
        throw new Error("Invalid response from name generator");
      }

      const generatedNames = (genData as { names: BabyName[] }).names;
      setNames(generatedNames);
      setStage("done");

      // 3. Navigate to results with names in sessionStorage
      sessionStorage.setItem(
        `names_${id}`,
        JSON.stringify({ names: generatedNames, email })
      );

      if (email) {
        toast.success(`Results sent to ${email}!`);
      }

      setTimeout(() => {
        router.push(`/results?session_id=${id}`);
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setStage("error");
    }
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500">Invalid session. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {stage === "verifying" && (
          <>
            <div className="w-16 h-16 border-4 border-warm-200 border-t-warm-400 rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Confirming your payment...
            </h2>
            <p className="text-gray-400">Just a moment while we verify your purchase.</p>
          </>
        )}

        {stage === "generating" && (
          <>
            <div className="text-5xl mb-6 animate-bounce">✨</div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Generating your names...
            </h2>
            <p className="text-gray-400 mb-6">
              Our AI is crafting 50 perfect names just for you. This takes about 10 seconds.
            </p>
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-warm-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </>
        )}

        {stage === "done" && (
          <>
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Your names are ready!
            </h2>
            <p className="text-gray-400">Taking you to your results...</p>
          </>
        )}

        {stage === "error" && (
          <>
            <div className="text-5xl mb-6">😔</div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-500 mb-6">{errorMsg}</p>
            <button
              onClick={() => {
                ran.current = false;
                setStage("verifying");
                setErrorMsg("");
                if (sessionId) processSession(sessionId);
              }}
              className="btn-primary"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-warm-200 border-t-warm-400 rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
