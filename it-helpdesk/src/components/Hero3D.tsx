"use client";

import { motion } from "framer-motion";

/**
 * Placeholder for a future Spline 3D scene on the login/landing pages.
 * Swap the <Image> + glow for a Spline <spline-viewer> / @splinetool/react-spline
 * embed later — the sizing/positioning wrapper below is meant to stay as-is.
 */
export default function Hero3D({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG placeholder, no optimization needed */}
        <img
          src="/images/hero-gold-placeholder.svg"
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 0 0 60px 10px rgba(250, 246, 237, 0.9)" }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
