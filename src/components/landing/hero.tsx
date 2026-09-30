"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[68px]">
      <div className="absolute inset-0 glow-radial pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 animate-fade-slide-up">
          <span className="inline-block bg-surface border border-gold/20 text-gold text-xs font-medium px-3 py-1 rounded-pill tracking-wide uppercase">
            {t("hero.badge", "✨ AI-Powered Multilingual Astrology Engine")}
          </span>

          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-tight text-text-primary">
            {t("hero.title1", "Know Your Stars,")}<br />
            <span className="text-gold italic">{t("hero.title2", "Shape Your Destiny")}</span>
          </h1>

          <p className="text-text-muted text-lg max-w-md leading-relaxed">
            {t("hero.subtitle", "Precision Vedic Kundli generation, daily transit horoscopes, and 24/7 AI Astrologer guidance in 5+ languages.")}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/login" className="bg-gold hover:bg-gold-light text-background font-medium text-[0.9rem] px-6 py-3 rounded-pill transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-lg">
              {t("hero.ctaPrimary", "Generate My Free Kundli")}
            </Link>
            <a href="#how-it-works" className="border border-gold/30 text-gold hover:bg-gold/10 font-medium text-[0.9rem] px-6 py-3 rounded-pill transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gold/50">
              {t("hero.ctaSecondary", "See how it works")}
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-spin-slow" />
            <div className="absolute inset-6 border border-teal/20 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute inset-0 m-auto w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20 text-gold/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}