"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type {
  QuizAnswers,
  NameStyle,
  Gender,
  Syllables,
  CulturalOrigin,
  NameMeaning,
  PersonalityVibe,
} from "@/types";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const ALPHABET = ["Any", "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const INITIAL_ANSWERS: QuizAnswers = {
  style: "Classic",
  gender: "Surprise me",
  firstLetter: "Any",
  syllables: "Any",
  origin: "Any",
  meaning: "Any",
  siblingName: "",
  lastName: "",
  namesToAvoid: "",
  vibe: "Thoughtful",
};

interface Step {
  id: number;
  question: string;
  subtitle?: string;
  type: "choice" | "letter" | "text";
  field: keyof QuizAnswers;
  options?: string[];
}

const STEPS: Step[] = [
  {
    id: 1,
    question: "What's your preferred name style?",
    subtitle: "This shapes the overall character of the names we suggest.",
    type: "choice",
    field: "style",
    options: ["Classic", "Modern", "Unique", "Nature-inspired", "Vintage"],
  },
  {
    id: 2,
    question: "What gender are you expecting?",
    subtitle: "Or keep it a surprise!",
    type: "choice",
    field: "gender",
    options: ["Boy", "Girl", "Gender-neutral", "Surprise me"],
  },
  {
    id: 3,
    question: "Any preferred first letter?",
    subtitle: "Initials can make a name extra special.",
    type: "letter",
    field: "firstLetter",
    options: ALPHABET,
  },
  {
    id: 4,
    question: "How many syllables?",
    subtitle: "Think about how it sounds with your last name.",
    type: "choice",
    field: "syllables",
    options: ["1", "2", "3", "4+", "Any"],
  },
  {
    id: 5,
    question: "Any cultural or ethnic background?",
    subtitle: "Names that honour your heritage or a culture you love.",
    type: "choice",
    field: "origin",
    options: ["Any", "English", "Irish", "Italian", "Japanese", "Hebrew", "Arabic", "Indian", "African", "Nordic", "Latin"],
  },
  {
    id: 6,
    question: "What should the name mean?",
    subtitle: "The hidden story behind the name.",
    type: "choice",
    field: "meaning",
    options: ["Any", "Strength", "Wisdom", "Joy", "Nature", "Love"],
  },
  {
    id: 7,
    question: "Do you have other children?",
    subtitle: "Optional — we'll suggest names that complement their siblings.",
    type: "text",
    field: "siblingName",
  },
  {
    id: 8,
    question: "What's your last name?",
    subtitle: "So we can check for good flow and avoid awkward initials.",
    type: "text",
    field: "lastName",
  },
  {
    id: 9,
    question: "Any names to avoid?",
    subtitle: "Optional — separate multiple names with commas.",
    type: "text",
    field: "namesToAvoid",
  },
  {
    id: 10,
    question: "What personality vibe are you drawn to?",
    subtitle: "This helps us capture the spirit you're looking for.",
    type: "choice",
    field: "vibe",
    options: ["Adventurous", "Creative", "Thoughtful", "Charming", "Bold"],
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const step = STEPS[current];
  const progress = ((current + 1) / STEPS.length) * 100;
  const isLast = current === STEPS.length - 1;

  function setValue(field: keyof QuizAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1);
    else router.push("/");
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const err: unknown = await res.json();
        const msg = typeof err === "object" && err !== null && "error" in err
          ? String((err as { error: unknown }).error)
          : "Something went wrong";
        throw new Error(msg);
      }

      const data: unknown = await res.json();
      if (typeof data !== "object" || data === null || !("sessionId" in data)) {
        throw new Error("Invalid response from server");
      }

      const { sessionId } = data as { sessionId: string };
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) throw new Error(result.error.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setLoading(false);
    }
  }

  const currentValue = answers[step.field];
  const canProceed =
    step.type === "text" ? true : typeof currentValue === "string" && currentValue.length > 0;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 text-sm">
            ← Back
          </button>
          <span className="text-sm text-gray-400 font-medium">
            {current + 1} of {STEPS.length}
          </span>
        </div>
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-warm-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-12 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-xs font-semibold text-warm-400 uppercase tracking-widest mb-3">
            Question {step.id}
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-2">
            {step.question}
          </h2>
          {step.subtitle && (
            <p className="text-gray-400 text-sm">{step.subtitle}</p>
          )}
        </div>

        <div className="space-y-3">
          {step.type === "choice" && step.options && (
            step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setValue(step.field, opt)}
                className={`option-btn ${
                  currentValue === opt ? "option-btn-selected" : "option-btn-unselected"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    currentValue === opt ? "border-warm-400 bg-warm-400" : "border-gray-300"
                  }`}>
                    {currentValue === opt && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  {opt}
                </span>
              </button>
            ))
          )}

          {step.type === "letter" && step.options && (
            <div className="grid grid-cols-7 gap-2">
              {step.options.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setValue(step.field, letter)}
                  className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                    currentValue === letter
                      ? "bg-warm-400 text-white shadow-sm"
                      : "bg-white border-2 border-cream-300 text-gray-600 hover:border-warm-300"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {step.type === "text" && (
            <div>
              <input
                type="text"
                value={typeof currentValue === "string" ? currentValue : ""}
                onChange={(e) => setValue(step.field, e.target.value)}
                placeholder={
                  step.field === "siblingName"
                    ? "e.g. Emma, Oliver (leave blank if first child)"
                    : step.field === "lastName"
                    ? "e.g. Johnson"
                    : "e.g. Michael, Jennifer (leave blank to skip)"
                }
                className="input-field text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed || loading}
          className="btn-primary mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner /> Setting up checkout...
            </span>
          ) : isLast ? (
            "Continue to Payment →"
          ) : (
            "Next →"
          )}
        </button>

        {step.type === "text" && (
          <p className="text-center text-gray-400 text-xs mt-3">
            Press Enter or click Next to continue
          </p>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
