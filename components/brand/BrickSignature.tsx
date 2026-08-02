"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Abdullah/Saeed's maker's-mark signature — required in every project, per
 * brand.md §3.6. Spells SAEED as a 5x7 bitmap "brick" font. Colors are
 * LOCKED regardless of project accent: S/E/E use the paper triad, A uses
 * teal, D uses orange — never substitute a project's own colors here.
 *
 * Simplified from the full isometric-brick/GSAP spec (single top+side face
 * per brick via CSS, IntersectionObserver-driven stagger instead of GSAP)
 * to avoid adding a new animation dependency to this app — same locked
 * colors, same drop-in-and-settle motion, same "Built by" label placement.
 */

const PAPER = ["#F6EFE3", "#FFFDF6", "#D8CFBE"] as const;
const TEAL = ["#0B7A75", "#17A099", "#07514D"] as const;
const ORANGE = ["#FF6B35", "#FF8B5E", "#D14E1F"] as const;

// 5 columns x 7 rows per letter.
const FONT: Record<string, number[][]> = {
  S: [
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  A: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
};

const WORD: { letter: string; triad: readonly [string, string, string] }[] = [
  { letter: "S", triad: PAPER },
  { letter: "A", triad: TEAL },
  { letter: "E", triad: PAPER },
  { letter: "E", triad: PAPER },
  { letter: "D", triad: ORANGE },
];

function Brick({ triad, delay, active }: { triad: readonly [string, string, string]; delay: number; active: boolean }) {
  const [top, side] = triad;
  return (
    <span
      style={{
        width: 6,
        height: 6,
        display: "inline-block",
        background: top,
        border: `1px solid ${side}`,
        borderRadius: 1,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(-6px)",
        transition: `opacity 260ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    />
  );
}

export function BrickSignature({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setActive(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let brickIndex = 0;

  return (
    <a
      href="https://saeed.sbs"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex flex-col items-center gap-1 ${className}`}
      aria-label="Built by Saeed"
    >
      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/40">Built by</span>
      <div ref={ref} className="flex gap-[3px]">
        {WORD.map((w, wi) => (
          <div key={wi} className="grid grid-cols-5 grid-rows-7 gap-[1px]">
            {FONT[w.letter].flatMap((row, ri) =>
              row.map((on, ci) => {
                const idx = brickIndex;
                if (on) brickIndex += 1;
                return on ? (
                  <Brick key={`${wi}-${ri}-${ci}`} triad={w.triad} delay={idx * 12} active={active} />
                ) : (
                  <span key={`${wi}-${ri}-${ci}`} style={{ width: 6, height: 6 }} />
                );
              })
            )}
          </div>
        ))}
      </div>
    </a>
  );
}
