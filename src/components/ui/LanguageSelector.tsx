"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n/translations";

interface LanguageSelectorProps {
  className?: string;
  showName?: boolean;
}

export default function LanguageSelector({ className = "", showName = true }: LanguageSelectorProps) {
  const { language, setLanguage, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gold/20 bg-surface/80 hover:bg-gold/10 text-text-primary text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-sm"
        aria-label="Select language"
      >
        <span>{currentLanguage.flag}</span>
        {showName && <span>{currentLanguage.nativeName}</span>}
        <span className="text-[10px] text-text-muted">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl glass-card-l3 border border-gold/30 shadow-2xl py-1 z-50 animate-fade-slide-up">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                  isSelected
                    ? "bg-gold/20 text-gold font-bold"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && <span className="text-gold">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
