"use client";

import { motion } from "framer-motion";

/**
 * Placeholder for a future Spline 3D scene on the login/landing pages.
 * Swap the sphere below for a Spline <spline-viewer> / @splinetool/react-spline
 * embed later — the sizing/positioning wrapper is meant to stay as-is.
 *
 * Rendered as a clay-style sphere in pure CSS (no image asset) so it matches
 * the soft, matte, single-light-source feel of the surrounding neumorphic UI.
 * If a real scene replaces this, keep it clay-style for the same reason.
 */
export default function Hero3D({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${className}`}
    >
      <motion.div
        className="h-full w-full rounded-full"
        style={{
          // Offset highlight + matte falloff reads as a soft 3D ball; the
          // outer dual shadow seats it on the surface like every other
          // raised element on the page.
          background:
            "radial-gradient(circle at 32% 28%, #ffffff 0%, #eceff3 38%, var(--neu-tint) 78%, #aab4c4 100%)",
          boxShadow:
            "10px 10px 22px var(--neu-dark), -8px -8px 18px var(--neu-light), inset -4px -6px 14px rgba(120,132,150,0.35), inset 5px 6px 12px rgba(255,255,255,0.65)",
        }}
        animate={{ scale: [1, 1.035, 1], rotate: [0, 1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[26%] top-[20%] h-[18%] w-[24%] rounded-full bg-white/70 blur-[6px]"
        animate={{ opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
