import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import HeroContent from "@/app/components/HeroContent";
import AmbientEffects from "@/app/components/AmbientEffects";

export default function HeroPage() {
  return (
    <main className="hero-page">
      {/* ── SEO: crawlable text — visually hidden ── */}
      <div className="sr-only">
        <h1>ANTAR — The Last Flame</h1>
        <p>
          An original game by Agnix Studio. ANTAR — The Last Flame is a
          cinematic Indian mythological action-platformer about memory, courage,
          compassion and sacred fire. Coming soon.
        </p>
        <p>
          Agnix Studio is an independent Indian creative production studio
          developing original games, cinematic stories, animation, comics and
          connected fictional universes.
        </p>
      </div>
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
