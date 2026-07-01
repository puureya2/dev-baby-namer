import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-2xl font-serif font-bold text-warm-500">BabyNamer</span>
        <Link
          href="/quiz"
          className="btn-primary text-sm px-6 py-2"
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-3xl mx-auto">
        <div className="inline-block bg-warm-100 text-warm-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          ✨ AI-Powered Baby Naming
        </div>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 leading-tight mb-6">
          Find Your Baby&apos;s{" "}
          <span className="text-warm-500">Perfect Name</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Answer 10 quick questions about your style and preferences. Our AI generates 50 beautiful,
          personalised names — complete with meanings and origins.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/quiz" className="btn-primary text-lg px-10 py-4">
            Find Our Baby&apos;s Name →
          </Link>
          <span className="text-gray-400 text-sm">Just $5 · Results in seconds</span>
        </div>
      </section>

      {/* Sample names preview */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SAMPLE_NAMES.map((n) => (
            <div key={n.name} className="card p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-lg font-serif font-bold text-gray-800">{n.name}</div>
              <div className="text-xs text-gray-400 mt-1">{n.origin}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          ...and 50 more, personalised just for you
        </p>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-warm-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-12">
          Why BabyNamer?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="card p-6 flex gap-4">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-cream-200 pb-6">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">
          Ready to find the perfect name?
        </h2>
        <p className="text-gray-500 mb-8">It only takes 2 minutes. Just $5, no subscription.</p>
        <Link href="/quiz" className="btn-primary text-lg px-12 py-4">
          Start the Quiz →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-200 py-8 px-6 text-center text-gray-400 text-sm">
        <p>© 2025 BabyNamer. Made with love for growing families.</p>
      </footer>
    </div>
  );
}

const SAMPLE_NAMES = [
  { name: "Aurora", origin: "Latin" },
  { name: "Callum", origin: "Scottish" },
  { name: "Elara", origin: "Greek" },
  { name: "Finn", origin: "Irish" },
  { name: "Isla", origin: "Scottish" },
  { name: "Jasper", origin: "Persian" },
  { name: "Luna", origin: "Latin" },
  { name: "Milo", origin: "Germanic" },
];

const STEPS = [
  {
    icon: "📝",
    title: "Answer 10 Questions",
    desc: "Tell us your style, gender preference, cultural background, and what makes a name special to you.",
  },
  {
    icon: "💳",
    title: "Quick $5 Payment",
    desc: "Secure checkout via Stripe. One-time payment, no subscription, no hidden fees.",
  },
  {
    icon: "✨",
    title: "Get 50 Perfect Names",
    desc: "Our AI generates 50 beautifully curated names with meanings, origins, and vibes — delivered instantly and by email.",
  },
];

const FEATURES = [
  {
    icon: "🎯",
    title: "Truly Personalised",
    desc: "Names are generated based on your exact preferences, not just generic lists.",
  },
  {
    icon: "📖",
    title: "Meanings Included",
    desc: "Every name comes with its meaning, cultural origin, and personality vibe.",
  },
  {
    icon: "🔍",
    title: "Filter & Explore",
    desc: "Filter results by gender, syllables, and more to find your shortlist fast.",
  },
  {
    icon: "📧",
    title: "Results by Email",
    desc: "Get your full name list emailed so you can revisit and share with family.",
  },
];

const FAQS = [
  {
    q: "How are the names generated?",
    a: "We use GPT-4o-mini, one of the most capable AI models available, trained on vast name databases and cultural knowledge. Your preferences shape a unique prompt that generates names specifically for your situation.",
  },
  {
    q: "What if I don't like the names?",
    a: "We generate 50 names based on your preferences. With that many options, you're sure to find gems. If you're not happy, try again with different preferences.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. We use Stripe for payments — the same trusted platform used by millions of businesses. We never store your card details.",
  },
  {
    q: "Can I access my results later?",
    a: "Yes! We email you a direct link to your results, and you can always revisit the link from your browser.",
  },
  {
    q: "Do you offer refunds?",
    a: "Since the name generation is instant and irreversible, we don't offer refunds. But we're confident you'll love your results!",
  },
];
