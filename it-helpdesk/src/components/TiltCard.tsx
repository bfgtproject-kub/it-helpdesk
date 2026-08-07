"use client";

import { useRef, type MouseEvent, type PropsWithChildren } from "react";
import gsap from "gsap";

/**
 * Subtle mouse-driven 3D tilt (GSAP quickTo — cheap enough to run every
 * mousemove). Entrance/reveal animation is owned by the page's own GSAP
 * timeline, not this component, so it only ever handles the hover interaction.
 */
export default function TiltCard({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const quickRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    if (!quickRotateX.current) {
      quickRotateX.current = gsap.quickTo(el, "rotateX", {
        duration: 0.6,
        ease: "power3.out",
      });
      quickRotateY.current = gsap.quickTo(el, "rotateY", {
        duration: 0.6,
        ease: "power3.out",
      });
    }

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quickRotateY.current?.(px * 10);
    quickRotateX.current?.(py * -10);
  }

  function handleMouseLeave() {
    quickRotateX.current?.(0);
    quickRotateY.current?.(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
      className={className}
    >
      {children}
    </div>
  );
}
