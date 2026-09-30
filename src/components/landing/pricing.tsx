import Link from "next/link";

const checkIcon = (
  <svg className="w-4 h-4 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    tagline: "Explore the stars at your pace",
    popular: false,
    cta: "Start Free",
    href: "/login",
    features: [
      "Unlimited Kundli (watermarked)",
      "Sun sign daily horoscope",
      "Last 3 days predictions",
      "5 AI chat messages/day",
      "Basic compatibility score",
      "Verified provider calculations when configured",
    ],
  },
  {
    name: "Premium",
    price: "₹299",
    period: "month",
    tagline: "Unlock your full cosmic potential",
    popular: true,
    cta: "Choose Premium",
    href: "/login?plan=premium",
    features: [
      "Full HD Kundli (no watermark)",
      "Weekly/Monthly + sub-categories",
      "Full saved prediction history",
      "Unlimited AI chat",
      "Full synastry compatibility report",
      "30 days of access after verified payment",
    ],
  },
  {
    name: "Yearly",
    price: "₹1,999",
    period: "year",
    tagline: "Best value for dedicated seekers",
    popular: false,
    cta: "Get Yearly",
    href: "/login?plan=yearly",
    features: [
      "All Premium features",
      "44% savings vs monthly",
      "365 days of access after verified payment",
      "Same server-enforced Premium entitlements",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-background">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[0.75rem] font-medium text-gold uppercase tracking-widest">Pricing</span>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-text-primary">
            Begin your journey free
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-card transition-all duration-200 ${
                plan.popular
                  ? "bg-surface border-2 border-gold shadow-[0_0_30px_-5px_rgba(201,168,76,0.15)] md:-mt-4 md:mb-4"
                  : "bg-surface border border-white/10 hover:border-gold/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-background text-[0.7rem] font-semibold px-3 py-1 rounded-pill uppercase tracking-wide">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-sans text-lg font-medium text-text-primary">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-serif text-3xl font-semibold text-text-primary">{plan.price}</span>
                  <span className="text-text-muted text-sm">/{plan.period}</span>
                </div>
                <p className="mt-2 text-text-muted text-sm">{plan.tagline}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[0.9rem] text-text-muted">
                    {checkIcon}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-pill font-medium text-[0.9rem] transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                  plan.popular
                    ? "bg-gold hover:bg-gold-light text-background"
                    : "border border-gold/30 text-gold hover:bg-gold/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-text-muted/70 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-text-muted">Razorpay</span>
          </div>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-text-muted/40" />
          <span>Signed webhook verification · Access activates after payment capture</span>
        </div>
      </div>
    </section>
  );
}
