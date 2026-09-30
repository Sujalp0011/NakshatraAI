const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    zodiac: "♎ Libra",
    avatar: "PS",
    avatarColor: "from-purple-500 to-purple-700",
    review: "The daily predictions in Hindi are spot on. Finally, an astrology app that speaks my language without feeling generic.",
    lang: "hi"
  },
  {
    id: 2,
    name: "Marcus Chen",
    zodiac: "♓ Pisces",
    avatar: "MC",
    avatarColor: "from-teal-500 to-teal-700",
    review: "I loved the AI chatbot’s breakdown of my 7th house. The compatibility report helped me understand relationship patterns I’d been ignoring.",
    lang: "en"
  },
  {
    id: 3,
    name: "Amira El-Sayed",
    zodiac: "♏ Scorpio",
    avatar: "AE",
    avatarColor: "from-gold-500 to-gold-700",
    review: "التطبيق رائع والدقة في الحسابات مذهلة. أخيراً أستطيع قراءة التفسيرات بالعربية بشكل كامل وواضح.",
    lang: "ar"
  }
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-background border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[0.75rem] font-medium text-gold uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.2rem)] font-light text-text-primary">
            Loved by thousands
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-surface border border-white/10 rounded-card p-6 flex flex-col transition-all duration-200 hover:border-gold/30"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>

              <p 
                className={`text-text-muted italic text-[0.95rem] leading-relaxed mb-6 flex-grow ${t.lang === 'ar' ? 'text-right' : ''}`}
                dir={t.lang === 'ar' ? 'rtl' : 'auto'}
              >
                "{t.review}"
              </p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-medium shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-text-primary font-medium text-[0.9rem]">{t.name}</p>
                  <p className="text-text-muted text-[0.8rem]">{t.zodiac}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}