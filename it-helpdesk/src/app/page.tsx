"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";
import Mascot from "@/components/Mascot";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const FEATURES = [
  {
    title: "AI จัดหมวดหมู่ & ประเมินความรุนแรง",
    body: "ทุก Ticket ถูกวิเคราะห์และจัดลำดับความสำคัญโดย AI ทันทีที่แจ้งปัญหา",
  },
  {
    title: "AI Chatbot ตอบคำถาม 24 ชั่วโมง",
    body: "ผู้ใช้ถามปัญหาที่พบบ่อยได้ทันที โดยอ้างอิงจากฐานความรู้ที่ทีม IT ดูแล",
  },
  {
    title: "ติดตามทรัพย์สินด้วย QR และ OCR",
    body: "สแกน QR สำหรับทรัพย์สินใหม่ หรือให้ AI อ่านป้ายทรัพย์สินเก่าให้อัตโนมัติ",
  },
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const orbWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = titleRef.current
        ? new SplitText(titleRef.current, { type: "chars" })
        : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(orbWrapperRef.current, { opacity: 0, scale: 0.7, duration: 1 })
        .from(
          split?.chars ?? [],
          { opacity: 0, y: 24, stagger: 0.03, duration: 0.6 },
          "-=0.6"
        )
        .from(taglineRef.current, { opacity: 0, y: 12, duration: 0.6 }, "-=0.3")
        .from(
          ctaRef.current ? Array.from(ctaRef.current.children) : [],
          { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 },
          "-=0.3"
        );

      // Cinematic parallax: the gold orb drifts up and fades as the hero
      // section scrolls out of view.
      gsap.to(orbWrapperRef.current, {
        yPercent: -25,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".feature-item").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} id="main-content" tabIndex={-1}>
      <section
        ref={heroSectionRef}
        className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
      >
        <Mascot variant="ai" className="pointer-events-none absolute bottom-[10%] right-[6%] h-20 w-20 sm:right-[12%] sm:h-28 sm:w-28" />

        <div ref={orbWrapperRef}>
          <TiltCard>
            <Hero3D className="h-32 w-32 sm:h-40 sm:w-40" />
          </TiltCard>
        </div>

        <h1
          ref={titleRef}
          className="font-serif text-4xl font-semibold tracking-wide text-foreground sm:text-5xl"
        >
          IT Helpdesk
        </h1>
        <p
          ref={taglineRef}
          className="max-w-sm text-sm leading-relaxed text-muted sm:text-base"
        >
          AI-Powered Automated IT Help Desk
          <br />
          and Asset Management System
        </p>

        <div
          ref={ctaRef}
          className="flex w-full max-w-xs flex-col gap-3 pt-2 sm:flex-row sm:justify-center"
        >
          <Link
            href="/login"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-gold/50 px-6 py-2.5 text-sm font-medium text-gold transition-colors duration-150 hover:bg-gold-wash"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </section>

      <section className="mx-auto flex max-w-3xl flex-col gap-16 px-4 pb-28">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="feature-item flex flex-col gap-2 border-t border-gold/20 pt-8 text-center"
          >
            <h2 className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
              {f.title}
            </h2>
            <p className="text-sm text-muted sm:text-base">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
