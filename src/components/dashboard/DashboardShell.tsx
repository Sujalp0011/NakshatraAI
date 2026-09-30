"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserProfile } from "@/types/api";
import { isPremium } from "@/lib/plans";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { LanguageCode, LANGUAGES } from "@/lib/i18n/translations";

interface DashboardShellProps {
  user: UserProfile;
  children: React.ReactNode;
}

export default function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { showToast } = useToast();
  const { setLanguage, t } = useLanguage();

  // Synchronize language from user profile if not explicitly set locally
  useEffect(() => {
    if (user.language && LANGUAGES.some((l) => l.code === user.language)) {
      const localLang = localStorage.getItem("nakshatra_lang");
      if (!localLang) {
        setLanguage(user.language as LanguageCode);
      }
    }
  }, [user.language, setLanguage]);

  const navItems = [
    { href: "/dashboard", label: t("dash.home", "Home"), icon: "🏠" },
    { href: "/dashboard/kundli", label: t("dash.myKundli", "My Kundli"), icon: "📊" },
    { href: "/dashboard/predictions", label: t("dash.predictions", "Predictions"), icon: "🔮" },
    { href: "/dashboard/chat", label: t("dash.aiChat", "AI Chat"), icon: "💬" },
    { href: "/dashboard/compatibility", label: t("dash.compatibility", "Compatibility"), icon: "❤️" },
    { href: "/dashboard/settings", label: t("dash.settings", "Settings"), icon: "⚙️" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      showToast("error", "Logout failed");
    }
  };

  const userIsPremium = isPremium(user.plan);

  return (
    <div className="min-h-screen bg-transparent text-text-primary flex flex-col md:flex-row font-sans">
      {/* Desktop Floating L1 Glass Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-card-l1 border-r border-gold/15 shrink-0 min-h-screen sticky top-0 h-screen z-30">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(243,198,105,0.2)]">
            ✨
          </div>
          <Link href="/" className="font-serif text-2xl font-bold text-gold-gradient tracking-[0.08em] hover:opacity-90 transition-opacity">
            NakshatraAI
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-gold/20 via-gold/10 to-transparent text-gold font-semibold shadow-[inset_0_1px_0_rgba(243,198,105,0.2)]"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-5 bg-gold rounded-full shadow-[0_0_12px_rgba(243,198,105,0.8)] animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          {!userIsPremium && (
            <Link
              href="/dashboard/upgrade"
              className="shimmer-sweep block w-full text-center bg-gradient-to-r from-gold/20 via-amber/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 border border-gold/40 text-gold text-xs font-semibold py-3 px-4 rounded-pill shadow-[0_4px_15px_rgba(243,198,105,0.15)] transition-all"
            >
              ✨ {t("dash.upgrade", "Upgrade to Premium")}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span>
            <span>{t("dash.logout", "Sign Out")}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Header Bar */}
        <header className="h-16 glass-card-l1 border-b border-gold/15 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-bold text-gold-gradient md:hidden tracking-[0.08em]">
              NakshatraAI
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <span className="text-sm text-text-primary font-semibold hidden sm:inline tracking-wide font-sans">
              {user.name}
            </span>
            <div
              className={`text-xs font-semibold px-3 py-1 rounded-pill uppercase tracking-wider flex items-center gap-2 border ${
                userIsPremium
                  ? "bg-gold/15 text-gold border-gold/40 shadow-[0_0_12px_rgba(243,198,105,0.2)]"
                  : "bg-teal/15 text-teal border-teal/30 shadow-[0_0_12px_rgba(20,184,166,0.2)]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${userIsPremium ? "bg-gold" : "bg-teal"}`} />
              <span>{userIsPremium ? t("dash.premiumPlan", "Premium") : t("dash.freePlan", "Free")}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-text-muted hover:text-red-400 transition-colors md:hidden"
            >
              {t("dash.logout", "Sign Out")}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 h-16 glass-card-l2 border border-gold/20 rounded-2xl flex items-center justify-around z-40 px-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full text-xs transition-all ${
                isActive ? "text-gold font-bold scale-110" : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
