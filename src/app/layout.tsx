import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const fontCinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-cinzel",
});

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "NakshatraAI — Premium AI Vedic & Western Astrology",
  description: "Generate your free Kundli, get daily predictions, and unlock AI-powered astrological insights in 5+ languages.",
  openGraph: {
    title: "NakshatraAI — Know Your Stars, Shape Your Destiny",
    description: "AI-powered multilingual astrology. Free Kundli generation, daily horoscopes, and premium insights.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontCinzel.variable} ${fontSans.variable} ${fontMono.variable}`}>
      <body className="antialiased bg-[#05050B] text-text-primary min-h-screen relative overflow-x-hidden">
        {/* Ambient Cosmic Background Blobs */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#8B5CF6] opacity-[0.12] blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#F3C669] opacity-[0.08] blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="fixed bottom-0 left-1/2 w-[600px] h-[600px] bg-[#4C1D95] opacity-[0.10] blur-[120px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2 z-0" />

        <div className="relative z-10">
          <LanguageProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}