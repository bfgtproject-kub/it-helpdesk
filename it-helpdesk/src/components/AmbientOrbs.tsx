"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Fixed backdrop of slow-drifting blurred gradient orbs, each wrapped in its
 * own parallax layer so cursor movement and the ambient drift animate
 * different DOM nodes (avoids two GSAP tweens fighting over the same
 * transform). Deeper-looking orbs (larger blur, further back) move less on
 * cursor movement than closer ones — that differential is what reads as depth.
 */
export default function AmbientOrbs() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wrap1 = useRef<HTMLDivElement>(null);
  const wrap2 = useRef<HTMLDivElement>(null);
  const wrap3 = useRef<HTMLDivElement>(null);
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);
  const blob3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let handleMouseMove: ((e: MouseEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      gsap.to(blob1.current, {
        x: 50,
        y: 35,
        duration: 17,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob2.current, {
        x: -55,
        y: -25,
        duration: 21,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob3.current, {
        x: 30,
        y: -40,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const quick1X = gsap.quickTo(wrap1.current, "x", { duration: 1.4, ease: "power2.out" });
      const quick1Y = gsap.quickTo(wrap1.current, "y", { duration: 1.4, ease: "power2.out" });
      const quick2X = gsap.quickTo(wrap2.current, "x", { duration: 1.4, ease: "power2.out" });
      const quick2Y = gsap.quickTo(wrap2.current, "y", { duration: 1.4, ease: "power2.out" });
      const quick3X = gsap.quickTo(wrap3.current, "x", { duration: 1.4, ease: "power2.out" });
      const quick3Y = gsap.quickTo(wrap3.current, "y", { duration: 1.4, ease: "power2.out" });

      handleMouseMove = (e: MouseEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        quick1X(px * -18);
        quick1Y(py * -18);
        quick2X(px * 26);
        quick2Y(py * 26);
        quick3X(px * -12);
        quick3Y(py * -12);
      };
      window.addEventListener("mousemove", handleMouseMove);
    }, rootRef);

    return () => {
      ctx.revert();
      if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft UI wants a surface that reads as one continuous sheet, so these
          are tinted neutral and kept very faint — just enough drift to stop
          the flat gray feeling dead, never enough to compete with the
          raised/inset shadows that carry the actual hierarchy. */}
      <div ref={wrap1} className="absolute -left-10 -top-8 h-56 w-56 sm:-left-16 sm:-top-10 sm:h-[30rem] sm:w-[30rem]">
        <div
          ref={blob1}
          className="h-full w-full rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--neu-light) 0%, var(--neu-light) 35%, transparent 72%)",
          }}
        />
      </div>
      <div ref={wrap2} className="absolute -right-16 top-[6%] h-64 w-64 sm:-right-32 sm:top-[8%] sm:h-[36rem] sm:w-[36rem]">
        <div
          ref={blob2}
          className="h-full w-full rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--neu-tint) 0%, var(--neu-tint) 30%, transparent 72%)",
          }}
        />
      </div>
      <div ref={wrap3} className="absolute -bottom-16 left-[10%] h-52 w-52 sm:-bottom-24 sm:left-[18%] sm:h-[28rem] sm:w-[28rem]">
        <div
          ref={blob3}
          className="h-full w-full rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--neu-dark) 0%, var(--neu-dark) 25%, transparent 72%)",
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{ backgroundImage: `url("${NOISE_SVG}")` }}
      />
    </div>
  );
}
