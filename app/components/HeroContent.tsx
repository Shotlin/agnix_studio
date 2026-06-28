import Image from "next/image";

export default function HeroContent() {
  return (
    <section className="hero-content" aria-label="Game announcement">
      {/* ANTAR title logo */}
      <div className="content-animate content-animate-1 w-full">
        <Image
          src="/assets/antar-title-transparent.png"
          alt="ANTAR — The Last Flame"
          width={3840}
          height={1921}
          priority
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            filter: "drop-shadow(0 4px 22px rgba(200, 130, 30, 0.22))",
          }}
        />
      </div>

      {/* COMING SOON */}
      <div className="content-animate content-animate-2 mt-4 md:mt-5 w-full">
        <div
          className="coming-soon-row"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <span
            style={{
              color: "#c8a96e",
              letterSpacing: "0.42em",
              fontSize: "clamp(0.65rem, 1.5vw, 0.95rem)",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            COMING SOON
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        className="content-animate content-animate-3 mt-5 md:mt-6"
        style={{
          fontFamily: "var(--font-raleway)",
          fontSize: "clamp(0.78rem, 1.1vw, 0.92rem)",
          color: "rgba(255, 228, 185, 0.76)",
          fontWeight: 300,
          letterSpacing: "0.025em",
          lineHeight: 1.75,
          maxWidth: "340px",
        }}
      >
        A mythological action-platformer forged from memory, courage and sacred
        fire.
      </p>
    </section>
  );
}
