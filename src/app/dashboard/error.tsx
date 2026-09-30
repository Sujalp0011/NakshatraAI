"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="bg-surface border border-white/10 rounded-card p-8 md:p-12 text-center max-w-lg mx-auto space-y-6 my-12">
      <div className="text-4xl">⚠️</div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-text-primary">Something went wrong</h2>
        <p className="text-text-muted text-xs font-mono bg-background p-3 rounded-lg border border-white/5 break-words">
          {error.message || "An unexpected error occurred while loading this section."}
        </p>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => reset()}
          className="bg-gold hover:bg-gold-light text-background font-medium text-xs px-6 py-2.5 rounded-pill transition-all"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="border border-gold/40 text-gold hover:bg-gold/10 text-xs font-medium px-6 py-2.5 rounded-pill transition-all"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
