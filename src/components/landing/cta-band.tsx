import Link from "next/link";

export default function CTABand() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-0 glow-radial pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-4 text-center relative z-10">
        <span className="text-[0.75rem] font-medium text-gold uppercase tracking-widest">Start Today</span>
        <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] font-light text-text-primary">
          Your chart is waiting. <br className="hidden md:block" /> The stars don't sleep.
        </h2>
        <p className="mt-4 text-text-muted text-[0.95rem] max-w-xl mx-auto leading-relaxed">
          Join 50,000+ users discovering their cosmic path through AI-powered Vedic & Western astrology.
        </p>
        <Link
          href="/login"
          className="inline-block mt-8 bg-gold hover:bg-gold-light text-background font-medium text-[1rem] px-10 py-4 rounded-pill transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-[0_4px_20px_-4px_rgba(201,168,76,0.4)]"
        >
          Generate My Free Kundli →
        </Link>
      </div>
    </section>
  );
}