"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import type { KundliSummary } from "@/types/api";

export default function KundliListPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [kundlis, setKundlis] = useState<KundliSummary[]>([]);
  const [chartType, setChartType] = useState<"vedic" | "western">("vedic");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/kundli")
      .then((res) => res.json())
      .then((data) => {
        if (data.kundlis) {
          setKundlis(data.kundlis);
        }
      })
      .catch(() => showToast("error", "Failed to fetch Kundli list"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartType }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to generate Kundli");
        if (data.error?.includes("Settings")) {
          router.push("/dashboard/settings");
        }
        setIsGenerating(false);
        return;
      }

      showToast("success", "Kundli generated successfully!");
      router.push(`/dashboard/kundli/${data.kundli.id}`);
    } catch {
      showToast("error", "Network error during Kundli generation");
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-text-primary">My Kundli Charts</h1>
          <p className="mt-1 text-text-muted text-sm">
            Generate and inspect your birth charts based on ancient Vedic or Western astrology.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-surface border border-white/10 p-2 rounded-card">
          <div className="flex bg-background rounded-pill p-1">
            <button
              onClick={() => setChartType("vedic")}
              className={`px-4 py-1.5 rounded-pill text-xs font-medium transition-all ${
                chartType === "vedic" ? "bg-gold text-background font-semibold" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Vedic
            </button>
            <button
              onClick={() => setChartType("western")}
              className={`px-4 py-1.5 rounded-pill text-xs font-medium transition-all ${
                chartType === "western" ? "bg-gold text-background font-semibold" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Western
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gold hover:bg-gold-light text-background font-medium text-xs px-5 py-2.5 rounded-pill transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "+ Generate New"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-surface animate-pulse rounded-card" />
          <div className="h-40 bg-surface animate-pulse rounded-card" />
          <div className="h-40 bg-surface animate-pulse rounded-card" />
        </div>
      ) : kundlis.length === 0 ? (
        <div className="bg-surface border border-white/10 rounded-card p-12 text-center space-y-4">
          <div className="text-4xl">📊</div>
          <h3 className="font-serif text-2xl text-text-primary">No Kundlis Generated Yet</h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            Click "+ Generate New" above to calculate your first birth chart based on your profile details.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gold hover:bg-gold-light text-background font-medium text-sm px-6 py-2.5 rounded-pill transition-all"
          >
            {isGenerating ? "Generating..." : "Generate Kundli Now"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kundlis.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/kundli/${item.id}`}
              className="bg-surface border border-white/10 hover:border-gold/40 rounded-card p-6 transition-all hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-1 rounded-pill">
                  {item.chartType} Chart
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Sun Sign:</span>
                  <span className="font-medium text-text-primary">{item.sunSign}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Moon Sign:</span>
                  <span className="font-medium text-text-primary">{item.moonSign}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Ascendant:</span>
                  <span className="font-medium text-text-primary">{item.ascendant}</span>
                </div>
              </div>

              {item.watermarked && (
                <div className="mt-4 text-[10px] text-teal flex items-center gap-1">
                  <span>🔒</span> Watermarked (Free Plan)
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-gold font-medium group-hover:underline flex items-center justify-between">
                <span>Inspect Chart</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
