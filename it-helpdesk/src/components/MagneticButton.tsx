"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";

/**
 * The signature Soft-UI interaction: the button drifts toward the cursor as
 * it approaches, then visibly sinks into the surface while held.
 *
 * The pressed state swaps a raised shadow for an inset one via className
 * rather than animating box-shadow — raised and inset aren't cleanly
 * interpolatable, so a CSS transition between the two token values reads
 * far better than trying to tween it.
 *
 * Only the translation is animated by Framer Motion, so `transition-shadow`
 * on the same element is safe (it never touches transform).
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  ...props
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
} & Omit<HTMLMotionProps<"button">, "ref" | "style" | "children">) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handleMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
    setPressed(false);
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onBlur={() => setPressed(false)}
      className={`transition-shadow duration-150 ${
        pressed ? "shadow-neu-pressed" : "shadow-neu"
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
