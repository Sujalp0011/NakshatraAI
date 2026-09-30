"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import UpgradePrompt from "@/components/dashboard/UpgradePrompt";
import type { PredictionData } from "@/types/api";

export default function PredictionsPage() {
  const { showToast } = useToast();
  const todayStr = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<"overall" | "health" | "career" | "love" | "finance">("overall");
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsLocked(false);
    fetch(`/api/predictions?type=daily&date=${selectedDate}`)
      .then((res) => {
        if (res.status === 403) {
          setIsLocked(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.prediction) {
          setPrediction(data.prediction.content);
        }
      })
      .catch(() => showToast("error", "Failed to fetch prediction"))
      .finally(() => setIsLoading(false));
  }, [selectedDate, showToast]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-gold drop-shadow-[0_0_8px_rgba(243,198,105,0.7)] text-xl" : "text-white/15 text-xl"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold-gradient tracking-[0.08em]">
            Daily Horoscope & Transits
          </h1>
          <p className="mt-1 text-text-muted text-sm font-sans">
            Personalized planetary predictions based on real-time astronomical transits.
          </p>
        </div>

        <div className="flex items-center gap-3 glass-card-l1 px-4 py-2 rounded-xl border border-gold/20">
          <label className="text-xs text-gold font-semibold uppercase tracking-wider font-sans">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#05050B]/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 glass-card-l2 animate-pulse rounded-card" />
      ) : isLocked ? (
        <div className="relative rounded-card overflow-hidden">
          <div className="glass-card-l2 p-8 space-y-6 filter blur-md pointer-events-none select-none">
            <h2 className="font-serif text-2xl text-text-primary">Daily Horoscope locked</h2>
            <p className="text-text-muted">
              Jupiter's aspect on your 5th house brings creative energy today...
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-6 z-20 glass-card-l3 backdrop-blur-md">
            <UpgradePrompt feature="Full Prediction History" message="Free plan includes predictions for the last 3 days. Upgrade to Premium for unlimited access." />
          </div>
        </div>
      ) : prediction ? (
        <div className="space-y-6">
          {/* Main Summary Card */}
          <div className="glass-card-l2 rounded-card p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/15 pb-6">
              <div>
                <span className="text-xs text-gold uppercase tracking-[0.2em] font-bold font-sans">Overall Alignment</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-text-primary mt-1 tracking-wide">Cosmic Energy Summary</h2>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-pill bg-gold/10 border border-gold/20 shadow-[0_0_15px_rgba(243,198,105,0.15)]">
                {renderStars(prediction.overallRating || 4)}
              </div>
            </div>

            <p className="text-text-primary text-base leading-relaxed font-sans">
              {prediction.summary}
            </p>

            {/* Lucky Info Badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="glass-card-l1 border-teal/30 text-teal text-xs font-semibold px-4 py-2.5 rounded-pill flex items-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:scale-105 transition-transform">
                <span>🎨 Lucky Color:</span>
                <span className="font-bold text-slate-100">{prediction.luckyColor}</span>
              </div>
              <div className="glass-card-l1 border-purple/30 text-purple text-xs font-semibold px-4 py-2.5 rounded-pill flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:scale-105 transition-transform">
                <span>🔢 Lucky Number:</span>
                <span className="font-bold font-mono text-slate-100">{prediction.luckyNumber}</span>
              </div>
              <div className="glass-card-l1 border-gold/30 text-gold text-xs font-semibold px-4 py-2.5 rounded-pill flex items-center gap-2 shadow-[0_0_15px_rgba(243,198,105,0.15)] hover:scale-105 transition-transform">
                <span>🧭 Lucky Direction:</span>
                <span className="font-bold text-slate-100">{prediction.luckyDirection}</span>
              </div>
            </div>
          </div>

          {/* Category Details Tabs */}
          <div className="glass-card-l2 rounded-card p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-wrap gap-2 border-b border-gold/15 pb-4">
              {(["overall", "health", "career", "love", "finance"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-pill text-xs font-bold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-gold via-amber to-gold text-background shadow-[0_0_15px_rgba(243,198,105,0.3)] scale-105"
                      : "text-text-muted hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              {activeTab === "overall" && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-3">Overall Guidance</h3>
                  <p className="text-text-primary text-sm leading-relaxed font-sans">{prediction.summary}</p>
                </div>
              )}
              {activeTab === "health" && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-3">Health & Wellness</h3>
                  <p className="text-text-primary text-sm leading-relaxed font-sans">{prediction.health}</p>
                </div>
              )}
              {activeTab === "career" && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-3">Career & Work</h3>
                  <p className="text-text-primary text-sm leading-relaxed font-sans">{prediction.career}</p>
                </div>
              )}
              {activeTab === "love" && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-3">Love & Relationships</h3>
                  <p className="text-text-primary text-sm leading-relaxed font-sans">{prediction.love}</p>
                </div>
              )}
              {activeTab === "finance" && (
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gold-gradient mb-3">Finance & Wealth</h3>
                  <p className="text-text-primary text-sm leading-relaxed font-sans">{prediction.finance}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
