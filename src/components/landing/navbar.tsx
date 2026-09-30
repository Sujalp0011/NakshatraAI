"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: "#features", label: t("nav.features") },
    { href: "#how-it-works", label: t("nav.howItWorks") },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#languages", label: t("nav.languages") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav" : "bg-transparent"}`}>
      <nav className="max-w-[1200px] mx-auto px-4 h-[68px] flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="font-serif text-2xl font-semibold text-text-primary tracking-wide hover:text-gold-light transition-colors">
          {t("nav.brand", "NakshatraAI")}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-text-primary text-[0.875rem] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side: Lang Selector + CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* CTA - Always visible per spec */}
          <Link
            href="/login"
            className="bg-gold hover:bg-gold-light text-background font-medium text-[0.9rem] px-5 py-2.5 rounded-pill transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-md"
          >
            {t("nav.getStarted")}
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 rounded p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-surface/95 backdrop-blur-md border-b border-white/10 p-4 flex flex-col gap-4 animate-fade-slide-up">
          <div className="pb-2 border-b border-white/10">
            <LanguageSelector showName={true} />
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-text-primary text-[0.875rem] py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}