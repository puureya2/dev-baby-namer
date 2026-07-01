"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { BabyName } from "@/types";
import { Suspense } from "react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [names, setNames] = useState<BabyName[]>([]);
  const [filtered, setFiltered] = useState<BabyName[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [originFilter, setOriginFilter] = useState("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!sessionId || ran.current) return;
    ran.current = true;

    const stored = sessionStorage.getItem(`names_${sessionId}`);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "names" in parsed &&
          Array.isArray((parsed as { names: unknown }).names)
        ) {
          const n = (parsed as { names: BabyName[] }).names;
          setNames(n);
          setFiltered(n);
          setLoading(false);
          return;
        }
      } catch {
        // fall through to error
      }
    }

    // If no stored data, redirect back
    setLoading(false);
  }, [sessionId]);

  // Filter effect
  useEffect(() => {
    let result = names;

    if (showFavoritesOnly) {
      result = result.filter((n) => favorites.has(n.name));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.meaning.toLowerCase().includes(q) ||
          n.origin.toLowerCase().includes(q) ||
          n.vibe.toLowerCase().includes(q)
      );
    }

    if (originFilter !== "All") {
      result = result.filter((n) =>
        n.origin.toLowerCase().includes(originFilter.toLowerCase())
      );
    }

    setFiltered(result);
  }, [names, search, originFilter, showFavoritesOnly, favorites]);

  function toggleFavorite(name: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const origins = ["All", ...Array.from(new Set(names.map((n) => n.origin))).sort()];

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No session found.</p>
          <Link href="/" className="btn-primary">
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-warm-200 border-t-warm-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (names.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">Results not found</h2>
          <p className="text-gray-500 mb-6">
            Your results may have expired. Please go through checkout again.
          </p>
          <Link href="/" className="btn-primary">
            Start Over
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-800">
                Your 50 Baby Names ✨
              </h1>
              <p className="text-sm text-gray-400">{filtered.length} name{filtered.length !== 1 ? "s" : ""} shown</p>
            </div>
            <div className="flex gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-sm px-4 py-2"
              >
                🖨 Print
              </button>
              <Link href="/" className="btn-secondary text-sm px-4 py-2">
                Try Again
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 no-print">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search names, meanings, origins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="input-field md:w-48"
          >
            {origins.map((o) => (
              <option key={o} value={o}>
                {o === "All" ? "All Origins" : o}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFavoritesOnly((p) => !p)}
            className={`px-4 py-2 rounded-2xl border-2 font-medium text-sm transition-all ${
              showFavoritesOnly
                ? "border-blush-300 bg-blush-100 text-blush-400"
                : "border-cream-300 bg-white text-gray-600 hover:border-blush-300"
            }`}
          >
            {showFavoritesOnly ? "❤️ Favorites" : "🤍 Show Favorites"}{" "}
            {favorites.size > 0 && `(${favorites.size})`}
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block px-6 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gray-800">Your Baby Names</h1>
        <p className="text-gray-500">Generated by BabyNamer.app</p>
      </div>

      {/* Name grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">No names match your filters. Try adjusting your search.</p>
            <button
              onClick={() => { setSearch(""); setOriginFilter("All"); setShowFavoritesOnly(false); }}
              className="btn-secondary mt-4 text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((name, i) => (
              <NameCard
                key={`${name.name}-${i}`}
                name={name}
                index={i}
                isFavorite={favorites.has(name.name)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-cream-200 py-8 text-center no-print">
        <p className="text-gray-400 text-sm">
          Love these names? Share BabyNamer with a friend expecting a little one!
        </p>
        <Link href="/" className="text-warm-400 text-sm font-medium hover:underline mt-1 inline-block">
          babynamer.vercel.app
        </Link>
      </div>
    </div>
  );
}

interface NameCardProps {
  name: BabyName;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (name: string) => void;
}

function NameCard({ name, index, isFavorite, onToggleFavorite }: NameCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 relative group">
      <button
        onClick={() => onToggleFavorite(name.name)}
        className="absolute top-4 right-4 text-lg transition-transform hover:scale-110 no-print"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <div className="flex items-start gap-3 mb-3">
        <span className="text-xs font-bold text-gray-300 mt-1 w-5 flex-shrink-0">
          {index + 1}
        </span>
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-800">{name.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="inline-block bg-warm-100 text-warm-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              {name.origin}
            </span>
            <span className="inline-block bg-sage-100 text-sage-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              {name.vibe}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed pl-8">{name.meaning}</p>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-100 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-warm-200 border-t-warm-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
