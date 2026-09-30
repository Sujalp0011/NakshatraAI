"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import type { CompatibilityResult, CompatibilityCategory } from "@/types/api";

const DEFAULT_CATEGORIES: CompatibilityCategory[] = [
  { name: "Varna", score: 1, maxScore: 1, description: "Spiritual & work compatibility" },
  { name: "Vashya", score: 1.5, maxScore: 2, description: "Mutual attraction & power balance" },
  { name: "Tara", score: 2.5, maxScore: 3, description: "Health, longevity & well-being" },
  { name: "Yoni", score: 3, maxScore: 4, description: "Intimacy & physical compatibility" },
  { name: "Maitri", score: 4, maxScore: 5, description: "Mental compatibility & friendship" },
  { name: "Gana", score: 5, maxScore: 6, description: "Temperament & nature match" },
  { name: "Bhakoot", score: 6, maxScore: 7, description: "Love, happiness & family prosperity" },
  { name: "Nadi", score: 7, maxScore: 8, description: "Genetic health & spiritual lineage" },
];

export default function CompatibilityPage() {
  const { showToast } = useToast();

  const [partnerName, setPartnerName] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  const [partnerTob, setPartnerTob] = useState("");
  const [partnerPlace, setPartnerPlace] = useState("");
  const [partnerLatitude, setPartnerLatitude] = useState("");
  const [partnerLongitude, setPartnerLongitude] = useState("");
  const [partnerTimeZone, setPartnerTimeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

  const [history, setHistory] = useState<CompatibilityResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/compatibility")
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setHistory(data.results);
          if (data.results.length > 0) {
            setCurrentResult(data.results[0]);
          }
        }
      })
      .catch(() => showToast("error", "Failed to load past compatibility tests"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !partnerDob || !partnerTob || !partnerLatitude || !partnerLongitude || !partnerTimeZone) {
      showToast("error", "Complete all required partner birth details");
      return;
    }

    setIsCalculating(true);
    try {
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerName,
          partnerDob,
          partnerTob: partnerTob || undefined,
          partnerPlace: partnerPlace || undefined,
          partnerLatitude: Number(partnerLatitude),
          partnerLongitude: Number(partnerLongitude),
          partnerTimeZone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Calculation failed");
        setIsCalculating(false);
        return;
      }

      showToast("success", "Compatibility calculated!");
      setCurrentResult(data.result);
      setHistory((prev) => [data.result, ...prev]);
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold-gradient tracking-[0.08em]">
          Synastry & Ashtakoota Matching
        </h1>
        <p className="mt-1 text-text-muted text-sm font-sans">
          Vedic 36-point Guna Milan analysis to evaluate emotional, spiritual, and physical relationship compatibility.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleCalculate} className="glass-card-l2 rounded-card p-6 md:p-8 space-y-6 shadow-2xl">
        <h2 className="font-serif text-2xl font-bold text-text-primary border-b border-gold/15 pb-4">Partner's Birth Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Partner's Name *</label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              required
              placeholder="e.g. Priya"
              className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Date of Birth *</label>
            <input
              type="date"
              value={partnerDob}
              onChange={(e) => setPartnerDob(e.target.value)}
              required
              className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Time of Birth *</label>
            <input
              type="time"
              value={partnerTob}
              onChange={(e) => setPartnerTob(e.target.value)}
              required
              className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Latitude *</label>
            <input type="number" min="-90" max="90" step="any" required value={partnerLatitude} onChange={(event) => setPartnerLatitude(event.target.value)} placeholder="28.6139" className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Longitude *</label>
            <input type="number" min="-180" max="180" step="any" required value={partnerLongitude} onChange={(event) => setPartnerLongitude(event.target.value)} placeholder="77.2090" className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Birth Timezone *</label>
            <input type="text" required value={partnerTimeZone} onChange={(event) => setPartnerTimeZone(event.target.value)} placeholder="Asia/Kolkata" className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Place of Birth (Optional)</label>
            <input
              type="text"
              value={partnerPlace}
              onChange={(e) => setPartnerPlace(e.target.value)}
              placeholder="e.g. Delhi, India"
              className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isCalculating}
            className="shimmer-sweep bg-gold hover:bg-gold-light text-background font-bold text-sm px-8 py-3.5 rounded-pill transition-all active:scale-[0.97] disabled:opacity-50 shadow-[0_0_20px_rgba(243,198,105,0.25)]"
          >
            {isCalculating ? "Calculating..." : "Calculate Compatibility ❤️"}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {currentResult && (
        <div className="space-y-6">
          <div className="glass-card-l2 rounded-card p-8 md:p-10 text-center space-y-4 shadow-2xl relative overflow-hidden">
            <span className="text-xs text-gold uppercase tracking-[0.25em] font-bold font-sans">Guna Milan Score</span>
            <h2 className="font-serif text-3xl font-bold text-text-primary">
              Compatibility with <span className="text-gold-gradient">{currentResult.partnerName}</span>
            </h2>

            {/* SVG 180px Circular Match Index */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0C2" />
                    <stop offset="50%" stopColor="#F3C669" />
                    <stop offset="100%" stopColor="#C8952C" />
                  </linearGradient>
                </defs>
                <path
                  className="text-white/10"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeWidth="3.5"
                  strokeDasharray={`${currentResult.overallScore}, 100`}
                  strokeLinecap="round"
                  stroke="url(#goldGradient)"
                  fill="none"
                  className="transition-all duration-1000 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-serif text-5xl font-bold text-gold-gradient tracking-[0.02em]">{currentResult.overallScore}%</span>
                <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-semibold mt-1 font-sans">Match Index</span>
              </div>
            </div>
          </div>

          {/* 8 Ashtakoota Category Breakdown */}
          <div className="space-y-5">
            <h3 className="font-serif text-2xl font-bold text-text-primary tracking-[0.05em]">Ashtakoota 8-Guna Breakdown</h3>

            {currentResult.categories === null ? (
              <div className="relative rounded-card overflow-hidden">
                {/* Blurred grid representation for free users */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 filter blur-md pointer-events-none select-none">
                  {DEFAULT_CATEGORIES.map((cat, idx) => (
                    <div key={idx} className="glass-card-l2 rounded-card p-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg font-bold text-text-primary">{cat.name}</span>
                        <span className="font-mono text-gold font-semibold text-sm">{cat.score} / {cat.maxScore}</span>
                      </div>
                      <p className="text-xs text-text-muted font-sans">{cat.description}</p>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-gold to-yellow-300" style={{ width: `${(cat.score / cat.maxScore) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6 z-20 glass-card-l3 backdrop-blur-md">
                  <UpgradePrompt
                    feature="Detailed Ashtakoota Category Analysis"
                    message="Free plan shows overall match percentage. Upgrade to Premium for complete 8-Guna category score breakdown."
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {currentResult.categories.map((cat, idx) => (
                  <div key={idx} className="glass-card-l2 glass-card-hover rounded-card p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-lg font-bold text-text-primary">{cat.name}</span>
                      <span className="font-mono text-gold font-semibold text-sm">{cat.score} / {cat.maxScore}</span>
                    </div>
                    <p className="text-xs text-text-muted font-sans">{cat.description}</p>
                    <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden mt-3 border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-gold to-yellow-300 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(243,198,105,0.4)]"
                        style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Past History List */}
      {!isLoading && history.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-gold/15">
          <h3 className="font-serif text-2xl font-bold text-text-primary">Past Compatibility Checks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => setCurrentResult(h)}
                className={`text-left glass-card-l2 rounded-card p-5 transition-all hover:-translate-y-1 ${
                  currentResult?.id === h.id ? "border-gold/60 bg-gold/10 shadow-[0_0_20px_rgba(243,198,105,0.15)]" : "hover:border-gold/30"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif text-lg font-bold text-text-primary">{h.partnerName}</span>
                  <span className="font-serif text-2xl font-bold text-gold-gradient">{h.overallScore}%</span>
                </div>
                <span className="text-[11px] font-mono text-text-muted">
                  Checked on {new Date(h.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
