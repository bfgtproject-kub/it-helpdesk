"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Ticket, Package, ShieldCheck, HelpCircle, type LucideIcon } from "lucide-react";

export type MascotVariant = "ai" | "ticket" | "asset" | "admin" | "faq";

const BADGE_ICON: Partial<Record<MascotVariant, LucideIcon>> = {
  ticket: Ticket,
  asset: Package,
  admin: ShieldCheck,
  faq: HelpCircle,
};

/**
 * Small hand-drawn (SVG) bot mascot — floats, blinks, and waves on a loop.
 * Same friendly body/face across the app for brand consistency; a small
 * badge icon (from lucide-react, not hand-drawn) signals which feature area
 * it's decorating. Built from primitives since there's no
 * illustration/3D-asset pipeline in this project.
 */
export default function Mascot({
  variant = "ai",
  className = "",
}: {
  variant?: MascotVariant;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const antennaTipRef = useRef<SVGCircleElement>(null);
  const leftEyeRef = useRef<SVGEllipseElement>(null);
  const rightEyeRef = useRef<SVGEllipseElement>(null);
  const leftArmRef = useRef<SVGLineElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(rootRef.current, { opacity: 0, scale: 0.8, transformOrigin: "center" });
    gsap.to(rootRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.15 });

    if (badgeRef.current) {
      gsap.set(badgeRef.current, { scale: 0, transformOrigin: "center" });
      gsap.to(badgeRef.current, { scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.55 });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to(bodyRef.current, {
        y: -10,
        rotate: -3,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });

      if (antennaTipRef.current) {
        gsap.to(antennaTipRef.current, {
          opacity: 0.4,
          scale: 1.3,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "center",
        });
      }

      const blinkTl = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });
      blinkTl.to([leftEyeRef.current, rightEyeRef.current], {
        scaleY: 0.1,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        transformOrigin: "center",
      });

      const waveTl = gsap.timeline({ repeat: -1, repeatDelay: 5 });
      waveTl
        .to(leftArmRef.current, { rotate: -35, duration: 0.25, transformOrigin: "100% 0%" })
        .to(leftArmRef.current, { rotate: -8, duration: 0.2 })
        .to(leftArmRef.current, { rotate: -35, duration: 0.2 })
        .to(leftArmRef.current, { rotate: 0, duration: 0.3 });

      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -4,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.3,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const BadgeIcon = BADGE_ICON[variant];

  return (
    <div className={className} aria-hidden="true">
      <div ref={rootRef} className="relative h-full w-full">
        <svg viewBox="0 0 120 140" className="h-full w-full">
          <g ref={bodyRef}>
            {variant === "ai" && (
              <>
                <line x1="60" y1="18" x2="60" y2="4" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
                <circle ref={antennaTipRef} cx="60" cy="4" r="4" fill="var(--gold)" />
              </>
            )}

            <rect x="20" y="18" width="80" height="90" rx="30" fill="var(--card)" stroke="var(--gold)" strokeWidth="3" />
            <rect x="32" y="38" width="56" height="40" rx="16" fill="var(--gold-wash)" />
            <ellipse ref={leftEyeRef} cx="50" cy="58" rx="5" ry="7" fill="var(--gold-deep)" />
            <ellipse ref={rightEyeRef} cx="70" cy="58" rx="5" ry="7" fill="var(--gold-deep)" />
            <path d="M 50 68 Q 60 75 70 68" stroke="var(--gold-deep)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line ref={leftArmRef} x1="22" y1="60" x2="6" y2="50" stroke="var(--gold)" strokeWidth="6" strokeLinecap="round" />
            <line x1="98" y1="60" x2="114" y2="66" stroke="var(--gold)" strokeWidth="6" strokeLinecap="round" />
            <rect x="35" y="104" width="18" height="10" rx="5" fill="var(--gold-light)" />
            <rect x="67" y="104" width="18" height="10" rx="5" fill="var(--gold-light)" />
          </g>
        </svg>

        {BadgeIcon && (
          <div
            ref={badgeRef}
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-card shadow-sm"
          >
            <BadgeIcon className="h-3.5 w-3.5 text-gold-deep" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
