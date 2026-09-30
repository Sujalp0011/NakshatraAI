import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Kundli Generator", href: "#" },
    { label: "Daily Horoscope", href: "#" },
    { label: "AI Chatbot", href: "#" },
    { label: "Compatibility", href: "#" },
    { label: "Remedies", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const Column = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div>
    <h4 className="text-[0.75rem] font-medium text-gold uppercase tracking-widest mb-4">{title}</h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-text-muted text-[0.9rem] hover:text-text-primary transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-background border-t border-gold/20 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div>
            <Link href="/" className="font-serif text-xl font-semibold text-text-primary tracking-wide hover:text-gold-light transition-colors block mb-3">
              NakshatraAI
            </Link>
            <p className="text-text-muted text-[0.9rem] leading-relaxed max-w-xs">
              AI-powered multilingual astrology. Know your stars, shape your destiny.
            </p>
          </div>

          <Column title="Product" links={footerLinks.product} />
          <Column title="Company" links={footerLinks.company} />
          <Column title="Legal" links={footerLinks.legal} />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted/60 text-xs">
          <p>&copy; {new Date().getFullYear()} NakshatraAI. All rights reserved.</p>
          <p>Ancient wisdom, powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}