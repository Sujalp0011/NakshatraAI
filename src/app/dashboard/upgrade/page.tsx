"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import type { UserProfile } from "@/types/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, callback: () => void) => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PLANS_DATA = [
  {
    id: "free",
    name: "Free Tier",
    price: "₹0",
    period: "forever",
    description: "Essential astrological calculations & daily insights.",
    features: [
      "Watermarked Kundli generation",
      "Last 3 days prediction history",
      "5 AI chat messages per day",
      "Basic Ashtakoota score percentage",
      "Verified payment not required",
    ],
  },
  {
    id: "premium",
    name: "Premium Monthly",
    price: "₹299",
    period: "per month",
    popular: true,
    description: "Complete astrological analysis & unlimited AI guidance.",
    features: [
      "Full HD Unwatermarked Kundli PDF",
      "Unlimited saved prediction history",
      "Unlimited AI Chat messages",
      "Full 8-Guna synastry category breakdown",
      "30 days of paid access",
    ],
  },
  {
    id: "yearly",
    name: "Yearly Pass",
    price: "₹1,999",
    period: "per year",
    description: "All Premium features plus exclusive annual insights.",
    features: [
      "All Premium plan features included",
      "Save 45% compared to monthly plan",
      "365 days of paid access",
      "Signed webhook activation",
    ],
  },
];

function UpgradeContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const { showToast } = useToast();

  const [currentPlan, setCurrentPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const u: UserProfile = data.user;
          setCurrentPlan(u.plan || "free");
        }
      })
      .catch(() => showToast("error", "Failed to load plan details"))
      .finally(() => setIsLoading(false));
  }, [showToast]);

  const handleCheckout = async (plan: string) => {
    if (plan === "free" || isUpdating) return;
    setIsUpdating(plan);
    try {
      const sdkReady = await loadRazorpay();
      if (!sdkReady || !window.Razorpay) throw new Error("Payment window could not be loaded");
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start checkout");
      const checkout = new window.Razorpay({
        ...data.checkout,
        handler: () => {
          showToast("success", "Payment received. Access will activate after secure verification.");
        },
        modal: { ondismiss: () => setIsUpdating(null) },
        theme: { color: "#F3C669" },
      });
      checkout.on("payment.failed", () => {
        showToast("error", "Payment failed. No plan changes were made.");
        setIsUpdating(null);
      });
      checkout.open();
    } catch (cause) {
      showToast("error", cause instanceof Error ? cause.message : "Unable to start checkout");
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="h-96 glass-card-l1 animate-pulse rounded-card" />
        <div className="h-96 glass-card-l1 animate-pulse rounded-card" />
        <div className="h-96 glass-card-l1 animate-pulse rounded-card" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <span className="text-xs text-gold uppercase tracking-[0.2em] font-bold font-sans">Pricing & Plans</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-gold-gradient tracking-[0.08em]">
          Unlock Celestial Insights
        </h1>
        <p className="text-text-muted text-sm max-w-lg mx-auto font-sans">
          Secure payments are activated only after Razorpay verifies the transaction.
        </p>

        <div className="mt-4 glass-card-l1 border-gold/30 rounded-xl p-3 max-w-md mx-auto text-xs text-gold font-semibold font-sans shadow-[0_0_15px_rgba(243,198,105,0.15)]">
          Plan access is granted by signed payment webhooks—not by the browser.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {PLANS_DATA.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isTargetFromUrl = planParam === plan.id;

          return (
            <div
              key={plan.id}
              className={`glass-card-l2 glass-card-hover rounded-card p-6 md:p-8 flex flex-col justify-between relative shadow-2xl ${
                plan.popular || isTargetFromUrl
                  ? "border-gold/50 shadow-[0_0_35px_rgba(243,198,105,0.2)] scale-[1.03]"
                  : "border-gold/15 hover:border-gold/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-background font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-1 rounded-pill shadow-[0_0_15px_rgba(243,198,105,0.4)]">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-text-primary">{plan.name}</h3>
                  <p className="text-text-muted text-xs font-sans mt-1 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl text-gold-gradient font-bold">{plan.price}</span>
                  <span className="text-text-muted text-xs font-sans">/{plan.period}</span>
                </div>

                <ul className="space-y-3.5 border-t border-gold/15 pt-6 text-xs text-text-primary font-sans">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-gold shrink-0 font-bold">✓</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                {isCurrent ? (
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={isUpdating !== null || plan.id === "free"}
                    className="w-full bg-teal/15 border border-teal/30 text-teal font-bold text-xs py-3.5 rounded-pill cursor-default font-sans shadow-[0_0_10px_rgba(20,184,166,0.15)]"
                  >
                    Current Plan ✓
                  </button>
                ) : (
                  <button
                    disabled
                    className={`shimmer-sweep w-full font-bold text-xs py-3.5 rounded-pill transition-all active:scale-[0.97] font-sans ${
                      plan.popular || isTargetFromUrl
                        ? "bg-gold hover:bg-gold-light text-background shadow-[0_0_20px_rgba(243,198,105,0.25)]"
                        : "bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold"
                    }`}
                  >
                    {plan.id === "free" ? "Free plan" : isUpdating === plan.id ? "Opening secure checkout..." : `Choose ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="text-text-muted text-center py-8 font-sans">Loading plans...</div>}>
      <UpgradeContent />
    </Suspense>
  );
}
