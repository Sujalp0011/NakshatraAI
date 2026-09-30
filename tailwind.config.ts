import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05050B",
        surface: "#0F0D1D",
        gold: {
          DEFAULT: "#F3C669",
          light: "#FFF0C2",
          dark: "#D49B27",
        },
        amber: {
          DEFAULT: "#D49B27",
          glow: "rgba(212, 155, 39, 0.3)",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          glow: "rgba(139, 92, 246, 0.25)",
        },
        teal: {
          DEFAULT: "#14B8A6",
          glow: "rgba(20, 184, 166, 0.25)",
        },
        "text-primary": "#F8FAFC",
        "text-muted": "#94A3B8",
        purple: "#8B5CF6",
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        pill: "100px",
      },
      boxShadow: {
        "glass-l1": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-l2": "0 12px 40px 0 rgba(0, 0, 0, 0.45)",
        "glass-l3": "0 16px 48px 0 rgba(0, 0, 0, 0.5), 0 0 35px rgba(243, 198, 105, 0.20)",
        "gold-glow": "0 0 25px rgba(243, 198, 105, 0.25)",
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.6s ease-out forwards",
        "spin-slow": "spin 25s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
