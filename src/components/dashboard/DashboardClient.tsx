"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardClientProps {
  user: {
    name: string;
    plan: string;
    dateOfBirth: string | null;
  };
  kundliCount: number;
  todayChatCount: number;
  todayPredictionExists: boolean;
}

export default function DashboardClient({
  user,
  kundliCount,
  todayChatCount,
  todayPredictionExists,
}: DashboardClientProps) {
  const { t } = useLanguage();
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-gold-gradient tracking-[0.08em]">
          {t("dashHome.welcome", "Namaste,")} {firstName} 🙏
        </h1>
        <p className="mt-2 text-text-muted text-sm md:text-base font-sans">
          {t("dashHome.subtitle", "Welcome to your cosmic dashboard. Here is your personalized astrological overview for today.")}
        </p>
      </div>

      {/* Action Required Callout Banner */}
      {!user.dateOfBirth && (
        <div className="glass-card-l2 border-gold/30 rounded-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-1 z-10">
            <span className="text-xs text-gold uppercase tracking-[0.2em] font-bold font-sans">Action Required</span>
            <h3 className="font-serif text-2xl font-bold text-text-primary tracking-wide">Complete Your Birth Profile</h3>
            <p className="text-text-muted text-sm max-w-xl font-sans">
              Add your exact date, time, coordinates, and timezone to generate provider-calculated Vedic charts.
            </p>
          </div>
          <Link
            href="/dashboard/settings"
            className="shimmer-sweep bg-gold hover:bg-gold-light text-background font-bold rounded-pill px-7 py-3 text-sm transition-all shadow-[0_0_20px_rgba(243,198,105,0.3)] shrink-0 z-10"
          >
            Update Profile ✨
          </Link>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card-l2 glass-card-hover p-6 rounded-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_15px_rgba(243,198,105,0.2)] flex items-center justify-center text-xl mb-4">
              📊
            </div>
            <div className="text-xs text-text-muted uppercase tracking-[0.15em] font-semibold font-sans">
              {t("dash.myKundli", "My Kundlis")}
            </div>
            <div className="font-serif text-4xl font-bold text-gold-gradient mt-2 tracking-[0.05em]">{kundliCount}</div>
          </div>
          <div className="text-xs text-gold font-semibold mt-4 pt-3 border-t border-white/5">
            <Link href="/dashboard/kundli" className="hover:underline flex items-center justify-between">
              <span>{t("common.loading", "View charts")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="glass-card-l2 glass-card-hover p-6 rounded-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-purple/10 ring-1 ring-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] flex items-center justify-center text-xl mb-4">
              🔮
            </div>
            <div className="text-xs text-text-muted uppercase tracking-[0.15em] font-semibold font-sans">
              {t("dashHome.dailyOverview", "Today's Horoscope")}
            </div>
            <div className="font-serif text-3xl font-bold text-text-primary mt-2">
              {todayPredictionExists ? "Ready" : "Available"}
            </div>
          </div>
          <div className="text-xs text-gold font-semibold mt-4 pt-3 border-t border-white/5">
            <Link href="/dashboard/predictions" className="hover:underline flex items-center justify-between">
              <span>{t("dashHome.predictions", "Read horoscope")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="glass-card-l2 glass-card-hover p-6 rounded-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-teal/10 ring-1 ring-teal/30 shadow-[0_0_15px_rgba(20,184,166,0.2)] flex items-center justify-center text-xl mb-4">
              💬
            </div>
            <div className="text-xs text-text-muted uppercase tracking-[0.15em] font-semibold font-sans">
              {t("dash.aiChat", "AI Astrologer")}
            </div>
            <div className="font-mono text-3xl font-bold text-text-primary mt-2">
              {user.plan === "free" ? `${todayChatCount} / 5` : `${todayChatCount}`}
            </div>
          </div>
          <div className="text-xs text-gold font-semibold mt-4 pt-3 border-t border-white/5">
            <Link href="/dashboard/chat" className="hover:underline flex items-center justify-between">
              <span>{t("dashHome.askAi", "Ask AI Astrologer")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="glass-card-l2 glass-card-hover p-6 rounded-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-amber/10 ring-1 ring-gold/40 shadow-[0_0_15px_rgba(243,198,105,0.2)] flex items-center justify-center text-xl mb-4">
              ✨
            </div>
            <div className="text-xs text-text-muted uppercase tracking-[0.15em] font-semibold font-sans">
              {t("settings.activePlan", "Active Plan")}
            </div>
            <div className="font-serif text-3xl font-bold text-gold capitalize mt-2">
              {user.plan === "free" ? t("dash.freePlan", "Free") : t("dash.premiumPlan", "Premium")}
            </div>
          </div>
          <div className="text-xs font-semibold mt-4 pt-3 border-t border-white/5">
            {user.plan === "free" ? (
              <Link href="/dashboard/upgrade" className="text-gold hover:underline flex items-center justify-between">
                <span>{t("dash.upgrade", "Upgrade to Pro")}</span>
                <span>✨</span>
              </Link>
            ) : (
              <span className="text-teal flex items-center gap-1">✓ Full Access</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="space-y-5 pt-2">
        <h2 className="font-serif text-2xl font-bold text-text-primary tracking-[0.05em]">
          {t("dashHome.quickActions", "Cosmic Tools & Direct Access")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            href="/dashboard/kundli"
            className="glass-card-l2 glass-card-hover p-6 rounded-card flex items-center gap-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gold/10 ring-1 ring-gold/30 shadow-[0_0_20px_rgba(243,198,105,0.2)] text-gold flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              📊
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-text-primary group-hover:text-gold transition-colors">
                {t("dashHome.generateKundli", "Generate Kundli")}
              </h3>
              <p className="text-text-muted text-xs font-sans mt-0.5">Vedic & Western birth charts with Rashi analysis</p>
            </div>
          </Link>

          <Link
            href="/dashboard/predictions"
            className="glass-card-l2 glass-card-hover p-6 rounded-card flex items-center gap-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple/10 ring-1 ring-purple/30 shadow-[0_0_20px_rgba(139,92,246,0.2)] text-purple flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              🔮
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-text-primary group-hover:text-gold transition-colors">
                {t("dashHome.predictions", "Daily Transits")}
              </h3>
              <p className="text-text-muted text-xs font-sans mt-0.5">Planetary energy, lucky numbers & career guidance</p>
            </div>
          </Link>

          <Link
            href="/dashboard/chat"
            className="glass-card-l2 glass-card-hover p-6 rounded-card flex items-center gap-5 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal/10 ring-1 ring-teal/30 shadow-[0_0_20px_rgba(20,184,166,0.2)] text-teal flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              💬
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-text-primary group-hover:text-gold transition-colors">
                {t("dashHome.askAi", "AI Astrologer")}
              </h3>
              <p className="text-text-muted text-xs font-sans mt-0.5">Prompt-guided AI assistant for reflective answers</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
