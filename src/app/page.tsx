import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Languages from "@/components/landing/languages";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";
import CTABand from "@/components/landing/cta-band";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Languages />
        <Pricing />
        <Testimonials />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}