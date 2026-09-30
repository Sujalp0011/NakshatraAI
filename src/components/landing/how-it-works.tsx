export default function HowItWorks() {
  const steps = [
    { number: 1, title: "Create your profile", desc: "Sign up and enter your birth date, time, and place for precise calculations." },
    { number: 2, title: "Get your Kundli", desc: "Generate a provider-calculated Vedic chart with recorded provenance." },
    { number: 3, title: "Read your guidance", desc: "View Moon-sign guidance explained in plain language." },
    { number: 4, title: "Chat & explore deeper", desc: "Ask questions through the prompt-guided AI astrology assistant." },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[0.75rem] font-medium text-gold uppercase tracking-widest">Simple Process</span>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-text-primary">
            Your cosmic journey in four steps
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps Column */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-5 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gold flex items-center justify-center font-serif text-gold text-lg transition-colors group-hover:bg-gold/10">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-sans text-lg font-medium text-text-primary mb-1">{step.title}</h3>
                  <p className="text-text-muted text-[0.9rem] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Panel Column */}
          <div className="relative bg-surface border border-white/10 rounded-card p-6 md:p-8">
            {/* Mock Kundli Grid */}
            <div className="grid grid-cols-3 gap-1 mb-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="aspect-square bg-background/50 border border-white/5 rounded flex items-center justify-center text-[0.65rem] text-text-muted/60">
                  House {i + 1}
                </div>
              ))}
            </div>

            {/* AI Text Overlay */}
            <div className="bg-background/70 border border-gold/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-gold text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Insight
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                Jupiter's transit into your 5th house activates creativity & academic growth. Favorable for learning new skills and romantic opportunities.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[0.7rem] px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">Lucky Color: Blue</span>
                <span className="text-[0.7rem] px-2 py-1 rounded-full bg-purple/10 text-purple border border-purple/20">Lucky Number: 3</span>
                <span className="text-[0.7rem] px-2 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">Direction: East</span>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
