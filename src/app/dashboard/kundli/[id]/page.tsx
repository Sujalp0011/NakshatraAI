"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

interface HouseInfo {
  house: number;
  sign: string;
  grahas: string[];
}

interface DetailData {
  id: string;
  chartType: string;
  createdAt: string;
  watermarked: boolean;
  chartData: {
    sunSign: string;
    moonSign: string;
    ascendant: string;
    nakshatra: string;
    generatedFor: string;
    houses: HouseInfo[];
  };
  birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
  };
}

export default function KundliDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const id = params?.id as string;

  const [data, setData] = useState<DetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/kundli/${id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.kundli) {
          setData(resData.kundli);
        } else {
          showToast("error", resData.error || "Failed to load Kundli");
        }
      })
      .catch(() => showToast("error", "Network error"))
      .finally(() => setIsLoading(false));
  }, [id, showToast]);

  const handleDownloadPdf = async () => {
    if (!chartRef.current || !data) return;
    setIsGeneratingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);
      // Capture the chart + info section as a canvas image
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#05050B",
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Create landscape PDF to fit the wide chart layout
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Header
      pdf.setFontSize(18);
      pdf.setTextColor(198, 163, 82); // Gold color
      pdf.text("NakshatraAI", pdfWidth / 2, 12, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(160, 160, 170);
      pdf.text(
        `${data.chartData.generatedFor}'s ${data.chartType.toUpperCase()} Kundli Chart`,
        pdfWidth / 2, 18,
        { align: "center" }
      );

      // Fit chart image within page with margins
      const margin = 10;
      const headerOffset = 24;
      const footerSpace = 12;
      const availableWidth = pdfWidth - margin * 2;
      const availableHeight = pdfHeight - headerOffset - footerSpace - margin;

      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      const xOffset = (pdfWidth - scaledWidth) / 2;

      pdf.addImage(imgData, "PNG", xOffset, headerOffset, scaledWidth, scaledHeight);

      // Footer
      pdf.setFontSize(7);
      pdf.setTextColor(120, 120, 130);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()} • NakshatraAI — Premium AI Vedic & Western Astrology`,
        pdfWidth / 2, pdfHeight - 6,
        { align: "center" }
      );

      // Download
      const fileName = `${data.chartData.generatedFor.replace(/\s+/g, "_")}_Kundli_${data.chartType}.pdf`;
      pdf.save(fileName);
      showToast("success", "PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 glass-card-l1 animate-pulse w-48 rounded-lg" />
        <div className="h-96 glass-card-l2 animate-pulse rounded-card" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card-l2 rounded-card p-12 text-center space-y-4">
        <h2 className="font-serif text-2xl text-text-primary">Kundli Not Found</h2>
        <Link href="/dashboard/kundli" className="text-gold hover:underline text-sm font-sans">
          ← Back to Kundli List
        </Link>
      </div>
    );
  }

  const { chartData, birthData, watermarked } = data;
  const houses = chartData.houses || [];

  const getHouse = (num: number) => houses.find((h) => h.house === num);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/kundli" className="text-xs text-gold hover:underline mb-2 inline-block font-sans font-medium">
            ← Back to Kundlis
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold-gradient tracking-[0.08em]">
            {chartData.generatedFor}'s Kundli Chart
          </h1>
          <p className="text-text-muted text-xs mt-1 font-mono">
            {data.chartType.toUpperCase()} CHART • CREATED {new Date(data.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className={`shimmer-sweep bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-6 py-3 rounded-pill transition-all self-start md:self-auto shadow-[0_0_15px_rgba(243,198,105,0.15)] ${isGeneratingPdf ? "opacity-60 cursor-wait" : ""}`}
        >
          {isGeneratingPdf ? "⏳ Generating..." : "📥 Download PDF"}
        </button>
      </div>

      <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main South Indian Chart (4x3 rectangular grid) */}
        <div className="lg:col-span-2 glass-card-l2 rounded-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-center items-center">
          {watermarked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
              <span className="text-gold/10 text-4xl md:text-6xl font-serif font-bold uppercase tracking-[0.3em] transform -rotate-12">
                NakshatraAI Free
              </span>
            </div>
          )}

          <div className="w-full max-w-xl aspect-square grid grid-cols-4 grid-rows-4 gap-1.5 bg-black/40 p-2 rounded-xl border border-gold/30 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
            {/* Row 1: Top (Pisces, Aries, Taurus, Gemini) */}
            <HouseCell house={getHouse(12)} />
            <HouseCell house={getHouse(1)} />
            <HouseCell house={getHouse(2)} />
            <HouseCell house={getHouse(3)} />

            {/* Row 2: Middle Upper (Aquarius, Center Block, Cancer) */}
            <HouseCell house={getHouse(11)} />
            <div className="col-span-2 row-span-2 bg-[#05050B]/90 flex flex-col items-center justify-center p-3 text-center border border-gold/20 rounded-lg shadow-inner z-10">
              <span className="font-serif text-gold-gradient text-xl md:text-2xl font-bold tracking-[0.1em]">NakshatraAI</span>
              <span className="text-[10px] font-mono text-text-muted mt-1 tracking-wider uppercase">South Indian Rashi Chart</span>
            </div>
            <HouseCell house={getHouse(4)} />

            {/* Row 3: Middle Lower (Capricorn, [Center Block], Leo) */}
            <HouseCell house={getHouse(10)} />
            <HouseCell house={getHouse(5)} />

            {/* Row 4: Bottom (Sagittarius, Scorpio, Libra, Virgo) */}
            <HouseCell house={getHouse(9)} />
            <HouseCell house={getHouse(8)} />
            <HouseCell house={getHouse(7)} />
            <HouseCell house={getHouse(6)} />
          </div>
        </div>

        {/* Side Panel Info */}
        <div className="space-y-6">
          <div className="glass-card-l2 rounded-card p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-text-primary border-b border-gold/15 pb-3">Planetary Highlights</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-text-muted">Sun Sign (Rashi):</span>
                <span className="font-medium text-gold font-serif">{chartData.sunSign}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-text-muted">Moon Sign (Rashi):</span>
                <span className="font-medium text-gold font-serif">{chartData.moonSign}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-text-muted">Ascendant (Lagna):</span>
                <span className="font-medium text-gold font-serif">{chartData.ascendant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Nakshatra & Pada:</span>
                <span className="font-medium text-gold font-serif">{chartData.nakshatra}</span>
              </div>
            </div>
          </div>

          <div className="glass-card-l2 rounded-card p-6 space-y-3">
            <h3 className="font-serif text-xl font-bold text-text-primary border-b border-gold/15 pb-3">Birth Snapshot</h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-text-muted block font-sans">Date of Birth:</span>
                <span className="text-text-primary font-medium">{birthData.dateOfBirth || "N/A"}</span>
              </div>
              <div>
                <span className="text-text-muted block font-sans">Time of Birth:</span>
                <span className="text-text-primary font-medium">{birthData.timeOfBirth || "N/A"}</span>
              </div>
              <div>
                <span className="text-text-muted block font-sans">Place of Birth:</span>
                <span className="text-text-primary font-medium">{birthData.placeOfBirth || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vedic Rashi (Zodiac) symbols — maps sign name to Unicode symbol
const RASHI_SYMBOLS: Record<string, string> = {
  Mesha: "♈",
  Vrishabha: "♉",
  Mithuna: "♊",
  Karka: "♋",
  Simha: "♌",
  Kanya: "♍",
  Tula: "♎",
  Vrishchika: "♏",
  Dhanu: "♐",
  Makara: "♑",
  Kumbha: "♒",
  Meena: "♓",
};

function getRashiSymbol(sign: string): string {
  // Direct match first
  if (RASHI_SYMBOLS[sign]) return RASHI_SYMBOLS[sign];
  // Partial match fallback (e.g. if data includes extra text)
  for (const [key, symbol] of Object.entries(RASHI_SYMBOLS)) {
    if (sign.includes(key)) return symbol;
  }
  return "";
}

// Vedic astrological symbols for Navagraha (9 planets) + Ascendant
const GRAHA_SYMBOLS: Record<string, { symbol: string; abbr: string }> = {
  Ascendant: { symbol: "⬆", abbr: "Asc" },
  Lagna:     { symbol: "⬆", abbr: "Asc" },
  Sun:       { symbol: "☉", abbr: "Su" },
  Moon:      { symbol: "☽", abbr: "Mo" },
  Mars:      { symbol: "♂", abbr: "Ma" },
  Mercury:   { symbol: "☿", abbr: "Me" },
  Jupiter:   { symbol: "♃", abbr: "Ju" },
  Venus:     { symbol: "♀", abbr: "Ve" },
  Saturn:    { symbol: "♄", abbr: "Sa" },
  Rahu:      { symbol: "☊", abbr: "Ra" },
  Ketu:      { symbol: "☋", abbr: "Ke" },
};

function getGrahaDisplay(graha: string) {
  const match = GRAHA_SYMBOLS[graha];
  if (match) return match;
  // Fallback: check if the graha name contains a known key
  for (const [key, val] of Object.entries(GRAHA_SYMBOLS)) {
    if (graha.includes(key)) return val;
  }
  return { symbol: "•", abbr: graha.slice(0, 3) };
}

function getGrahaStyle(graha: string) {
  if (graha === "Ascendant" || graha === "Lagna") {
    return "bg-gold text-background font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(243,198,105,0.4)]";
  }
  if (graha.includes("Mars") || graha.includes("Ma")) {
    return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
  }
  if (graha.includes("Venus") || graha.includes("Ve")) {
    return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
  }
  if (graha.includes("Jupiter") || graha.includes("Ju")) {
    return "bg-gold/20 text-gold-light border border-gold/40";
  }
  if (graha.includes("Saturn") || graha.includes("Sa")) {
    return "bg-purple-500/20 text-purple-300 border border-purple-500/40";
  }
  if (graha.includes("Sun") || graha.includes("Su")) {
    return "bg-orange-500/20 text-orange-300 border border-orange-500/40";
  }
  if (graha.includes("Moon") || graha.includes("Mo")) {
    return "bg-slate-300/20 text-slate-100 border border-slate-300/40";
  }
  if (graha.includes("Rahu")) {
    return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40";
  }
  if (graha.includes("Ketu")) {
    return "bg-rose-500/20 text-rose-300 border border-rose-500/40";
  }
  if (graha.includes("Mercury")) {
    return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
  }
  return "bg-white/10 text-text-primary border border-white/10";
}

function HouseCell({ house }: { house?: HouseInfo }) {
  if (!house) return <div className="bg-[#05050B]/60 rounded-lg border border-white/5" />;
  const isLagnaCell = house.grahas.some((g) => g === "Ascendant" || g === "Lagna" || g.includes("Lagna"));
  const rashiSymbol = getRashiSymbol(house.sign);

  return (
    <div className={`bg-[#0A0816]/80 p-2.5 flex flex-col justify-between border rounded-lg overflow-hidden transition-all ${
      isLagnaCell ? "border-gold/50 shadow-[0_0_15px_rgba(243,198,105,0.15)]" : "border-white/10 hover:border-gold/30"
    }`}>
      <div className="flex justify-between items-center">
        <span className="text-gold/80 font-semibold text-[11px] font-mono">H{house.house}</span>
        <span className="flex items-center gap-1 text-[10px] text-text-muted">
          {rashiSymbol && (
            <span className="text-gold/85 text-sm leading-none">{rashiSymbol}</span>
          )}
          <span>{house.sign}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {house.grahas.map((g, idx) => {
          const display = getGrahaDisplay(g);
          return (
            <span
              key={idx}
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all flex items-center gap-0.5 ${getGrahaStyle(g)}`}
              title={g}
            >
              <span className="text-xs">{display.symbol}</span>
              <span>{display.abbr}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
