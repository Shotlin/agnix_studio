import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import HeroContent from "@/app/components/HeroContent";
import AmbientEffects from "@/app/components/AmbientEffects";

export default function HeroPage() {
  return (
    <main className="hero-page">
      {/* ── Background layer ── */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Image
          src="/assets/hero-bg.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="hero-bg-img"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* ── Ambient particles + glow ── */}
      <AmbientEffects />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Hero content ── */}
      <HeroContent />

      {/* ── Bottom studio credit ── */}
      <footer
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center pb-5 pointer-events-none"
        aria-label="Studio credit"
      >
        <p
          className="text-center tracking-widest"
          style={{
            fontFamily: "var(--font-cinzel)",
            fontSize: "clamp(0.52rem, 0.72vw, 0.65rem)",
            color: "rgba(200, 169, 110, 0.40)",
            letterSpacing: "0.14em",
          }}
        >
          ✦ &nbsp;── First reveal by Agnix Studio ──&nbsp; ✦
        </p>
      </footer>
    </main>
  );
}
