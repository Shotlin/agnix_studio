import type { CSSProperties } from "react";

interface Particle {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

const PARTICLES: Particle[] = [
  { id:  1, x: "11%", y: "73%", size: 2, duration: 10, delay: 0.0, dx:  12, dy: -132 },
  { id:  2, x: "19%", y: "66%", size: 3, duration: 14, delay: 2.5, dx:  -8, dy: -150 },
  { id:  3, x:  "7%", y: "81%", size: 2, duration: 11, delay: 5.0, dx:  18, dy: -122 },
  { id:  4, x: "27%", y: "76%", size: 2, duration: 13, delay: 1.5, dx: -14, dy: -146 },
  { id:  5, x: "37%", y: "68%", size: 3, duration: 16, delay: 3.5, dx:  10, dy: -158 },
  { id:  6, x:  "5%", y: "59%", size: 2, duration: 12, delay: 7.0, dx:  20, dy: -112 },
  { id:  7, x: "22%", y: "86%", size: 2, duration: 15, delay: 0.8, dx: -11, dy: -140 },
  { id:  8, x: "44%", y: "79%", size: 3, duration: 18, delay: 4.0, dx:   8, dy: -168 },
  { id:  9, x: "32%", y: "61%", size: 2, duration:  9, delay: 6.0, dx: -10, dy: -126 },
  { id: 10, x: "14%", y: "91%", size: 2, duration: 11, delay: 2.0, dx:  15, dy: -136 },
  { id: 11, x: "41%", y: "56%", size: 3, duration: 17, delay: 8.2, dx: -18, dy: -154 },
  { id: 12, x:  "8%", y: "46%", size: 2, duration: 13, delay: 3.2, dx:  22, dy: -116 },
];

export default function AmbientEffects() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Ash particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="ash-particle"
          style={
            {
              left: p.x,
              top: p.y,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as CSSProperties
          }
        />
      ))}

    </div>
  );
}
