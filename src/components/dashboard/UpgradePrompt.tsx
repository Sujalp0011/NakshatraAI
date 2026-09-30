"use client";

import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  message?: string;
}

export default function UpgradePrompt({ feature, message }: UpgradePromptProps) {
  return (
    <div className="bg-surface/90 backdrop-blur-md border border-gold/40 rounded-card p-6 md:p-8 text-center max-w-md mx-auto space-y-4 shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl mx-auto border border-gold/30">
        🔒
      </div>

      <div>
        <span className="text-[10px] text-gold uppercase tracking-widest font-semibold">Premium Feature</span>
        <h3 className="font-serif text-xl text-text-primary mt-1 font-medium">{feature}</h3>
        {message && (
          <p className="mt-2 text-text-muted text-xs leading-relaxed">{message}</p>
        )}
      </div>

      <Link
        href="/dashboard/upgrade"
        className="inline-block w-full bg-gold hover:bg-gold-light text-background font-semibold text-sm py-3 px-6 rounded-pill transition-all active:scale-[0.97] shadow-lg"
      >
        Upgrade to Premium — ₹299/mo ✨
      </Link>
    </div>
  );
}
