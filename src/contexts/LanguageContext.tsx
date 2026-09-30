"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { LanguageCode, LanguageOption, LANGUAGES, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentLanguage: LanguageOption;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nakshatra_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  // Read initial language from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (savedLang && LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {
      // Storage access disabled orSSR
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    if (!LANGUAGES.some((l) => l.code === lang)) return;

    setLanguageState(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = `nakshatra_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }

    // Update html dir for RTL languages (like Arabic)
    const langObj = LANGUAGES.find((l) => l.code === lang);
    if (document && document.documentElement) {
      document.documentElement.lang = lang;
      if (langObj?.rtl) {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    }
  }, []);

  // Update HTML tag whenever language state changes
  useEffect(() => {
    const langObj = LANGUAGES.find((l) => l.code === language);
    if (document && document.documentElement) {
      document.documentElement.lang = language;
      if (langObj?.rtl) {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    }
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = translations[language] || translations["en"];
      if (dict && dict[key]) {
        return dict[key];
      }
      // Fallback to English if translation key missing in target language
      const enDict = translations["en"];
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback || key;
    },
    [language]
  );

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const isRTL = !!currentLanguage.rtl;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
