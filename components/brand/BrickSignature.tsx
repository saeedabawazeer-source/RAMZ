"use client";

import { useEffect, useRef } from "react";

/**
 * Abdullah/Saeed's maker's-mark signature — required in every project, per
 * brand.md §3.6. This is the REAL locked technique, ported directly from
 * Port's canonical implementation (and Moony's React port of it): a 5x7
 * bitmap font per letter, rendered as isometric 3D lego bricks (top/side/
 * front face SVG polygons), dropped in with a GSAP bounce-out stagger the
 * first time the footer scrolls into view.
 *
 * A prior version of this file replaced the real brick/GSAP technique with
 * flat CSS squares as a "simplification" — brand.md explicitly calls that
 * exact kind of over-correction out as wrong (§3.6: "a later draft
 * over-corrected by replacing the actual SAEED brick signature with a
 * generic thin-line squiggle — that was wrong too"). This restores the real
 * technique instead of approximating it. Do not simplify this again.
 */
export function BrickSignature({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const loadGSAPAndInit = () => {
      if ((window as any).gsap) {
        setupObserver();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
      script.async = true;
      script.onload = setupObserver;
      document.body.appendChild(script);
    };

    const setupObserver = () => {
      if (!containerRef.current) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            buildSaeedSignature();
            observer?.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(containerRef.current);
    };

    function buildSaeedSignature() {
      const gsap = (window as any).gsap;
      const bn = containerRef.current;
      if (!bn) return;

      // Locked 5x7 bitmap font — S, A, E, D (E reused for both E's in SAEED).
      const F: Record<string, string[]> = {
        S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
        A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
        E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
        D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
      };

      const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      bn.innerHTML = "";

      const S = 20,
        D = 7,
        y0 = 16;
      // Locked colors — never re-themed per project. S/E/E = paper, A = teal, D = orange.
      const face: Record<string, string[]> = {
        s: ["#F6EFE3", "#FFFDF6", "#D8CFBE"],
        k: ["#0B7A75", "#17A099", "#07514D"],
        o: ["#FF6B35", "#FF8B5E", "#D14E1F"],
      };

      function brick(x: number, y: number, w: number, fc: string[]) {
        let studs = "";
        for (let i = 0; i < w; i++) {
          const cx = i * S + S / 2 + D / 2;
          studs +=
            '<ellipse cx="' + cx + '" cy="' + -D / 2 + '" rx="5" ry="2.8" fill="' + fc[1] + '"/>' +
            '<ellipse cx="' + (cx - 1.8) + '" cy="' + (-D / 2 - 0.8) + '" rx="1.6" ry=".9" fill="#fff" opacity=".7" stroke="none"/>';
        }
        const W1 = w * S;
        return (
          '<g class="vox" data-x="' + x + '" data-cy="' + y + '" stroke="#131110" stroke-width="1.4" stroke-linejoin="round">' +
          '<polygon points="0,0 ' + D + ",-" + D + " " + (W1 + D) + ",-" + D + " " + W1 + ',0" fill="' + fc[1] + '"/>' +
          '<polygon points="' + W1 + ",0 " + (W1 + D) + ",-" + D + " " + (W1 + D) + "," + (S - D) + " " + W1 + "," + S + '" fill="' + fc[2] + '"/>' +
          '<rect width="' + W1 + '" height="' + S + '" fill="' + fc[0] + '"/>' +
          studs +
          "</g>"
        );
      }

      const offsetX = Math.floor((36 - 29) / 2);
      const all: { tx: number; ty: number; gx: number; gy: number; w: number; cl: string }[] = [];
      const word = "SAEED";

      for (let r = 0; r < 7; r++) {
        for (let li = 0; li < 5; li++) {
          const row = F[word[li]][r];
          let ci = 0;
          while (ci < 5) {
            if (row[ci] !== "1") {
              ci++;
              continue;
            }
            let run = 0;
            while (ci + run < 5 && row[ci + run] === "1") run++;
            const w = Math.min(run, 1 + Math.floor(Math.random() * 3));
            const cl = li === 4 ? "o" : li === 1 ? "k" : "s";
            const gx = offsetX + li * 6 + ci,
              gy = r;
            all.push({ tx: gx * S + 2, ty: y0 + gy * S, gx, gy, w, cl });
            ci += w;
          }
        }
      }

      all.sort((a, b) => b.gy - a.gy || a.gx - b.gx);
      const W = 36 * S + D + 6,
        H = y0 + 8 * S + D + 4;

      bn.innerHTML =
        '<svg width="100%" viewBox="0 0 ' + W + " " + H + '" style="overflow:visible;max-width:180px;margin:auto;" aria-hidden="true">' +
        all.map((b) => brick(b.tx, b.ty, b.w, face[b.cl])).join("") +
        "</svg>";

      const blocks = Array.from(bn.querySelectorAll(".vox")) as HTMLElement[];

      if (RM || !gsap) return;

      gsap.set(blocks, {
        opacity: 0,
        x: (_i: number, b: HTMLElement) => parseFloat(b.dataset.x!),
        y: () => -(160 + Math.random() * 100),
        transformOrigin: "50% 100%",
      });

      const tl = gsap.timeline();
      blocks.forEach((b, i) => {
        tl.to(
          b,
          { y: parseFloat(b.dataset.cy!), opacity: 1, duration: 0.5, ease: "bounce.out" },
          i * 0.012 + Math.random() * 0.01
        );
      });
    }

    loadGSAPAndInit();
    return () => observer?.disconnect();
  }, []);

  return (
    <a
      href="https://saeed.sbs"
      target="_blank"
      rel="noreferrer"
      className={`flex w-full max-w-[180px] flex-col items-center justify-center gap-1 opacity-90 transition-opacity hover:opacity-100 ${className}`}
      aria-label="Built by Saeed"
    >
      <span className="font-mono text-[9px] uppercase tracking-wider text-ink/40">Built by</span>
      <div ref={containerRef} aria-hidden="true" className="flex w-full justify-center" />
    </a>
  );
}
