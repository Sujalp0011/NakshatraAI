"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n/translations";

export default function Languages() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <section id="languages" className="py-20 md:py-28 bg-background border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <span className="text-[0.75rem] font-medium text-gold uppercase tracking-widest">
          {t("langSec.badge", "Multilingual")}
        </span>
        <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-text-primary">
          {t("langSec.title", "Speak the language of the stars")}
        </h2>
        <p className="mt-4 text-text-muted text-[0.9rem] max-w-lg mx-auto leading-relaxed">
          {t("langSec.desc", "Astrology knows no borders. Access accurate Vedic charts and AI insights natively in your preferred language.")}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as LanguageCode)}
                className={`
                  flex items-center gap-2.5 px-6 py-3.5 rounded-full border transition-all duration-200 cursor-pointer text-sm font-medium
                  ${isActive 
                    ? "bg-gold/20 border-gold/50 text-gold shadow-[0_0_20px_rgba(243,198,105,0.3)] scale-105" 
                    : "bg-surface border-white/10 text-text-muted hover:border-gold/30 hover:text-text-primary hover:bg-white/5"
                  }
                `}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {isActive && <span className="text-xs bg-gold text-background rounded-full px-2 py-0.5 font-bold">Active</span>}
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted/50">
          <svg className="w-4 h-4 text-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {t("langSec.rtlNotice", "Native RTL support for Arabic and Hebrew.")}
        </div>
      </div>
    </section>
  );
}