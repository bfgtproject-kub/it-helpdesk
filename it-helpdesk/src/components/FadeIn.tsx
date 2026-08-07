"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import gsap from "gsap";

/**
 * Light fade-up on mount — for pages that are used often (dashboard,
 * ticket list, asset table), so the motion should be quick and subtle,
 * not a hero-page-style reveal.
 */
export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 12,
        duration: 0.5,
        delay,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
