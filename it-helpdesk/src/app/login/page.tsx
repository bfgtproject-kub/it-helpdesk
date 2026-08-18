"use client";

import { Suspense, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { login } from "@/app/actions/auth";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";
import Mascot from "@/components/Mascot";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  // Not <form action={...}> — React 19 resets form fields after a Server
  // Action completes, even on a validation error, which wiped the email
  // the user had just typed on a failed login. Calling the action
  // directly keeps fields in local state.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      const result = await login(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <>
      {justRegistered && (
        <p className="rounded-md border border-gold/30 bg-gold-wash px-3 py-2 text-sm font-medium text-foreground">
          สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          autoComplete="email"
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          autoComplete="current-password"
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-gold-deep px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const orbWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
      tl.from(orbWrapperRef.current, { opacity: 0, scale: 0.7, duration: 0.8 })
        .from(
          split?.chars ?? [],
          { opacity: 0, y: 20, stagger: 0.03, duration: 0.5 },
          "-=0.5"
        )
        .from(".reveal-item", { opacity: 0, y: 16, stagger: 0.12, duration: 0.5 }, "-=0.3");
    }, rootRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <main
      ref={rootRef}
      id="main-content"
      tabIndex={-1}
      className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-4"
    >
      <Mascot variant="ai" className="pointer-events-none absolute right-2 bottom-[12%] h-16 w-16 sm:right-4" />

      <TiltCard className="flex w-full flex-col gap-6 rounded-2xl border border-gold/25 bg-card px-8 py-10 shadow-[0_25px_70px_-20px_rgba(176,141,87,0.35)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div ref={orbWrapperRef}>
            <Hero3D className="h-16 w-16" />
          </div>
          <div>
            <h1 ref={titleRef} className="font-serif text-2xl font-semibold text-foreground">
              เข้าสู่ระบบ
            </h1>
            <p className="reveal-item text-sm text-muted">IT Helpdesk & Asset Management</p>
          </div>
        </div>

        <div className="reveal-item">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="reveal-item text-center text-sm text-muted">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-gold underline">
            สมัครสมาชิก
          </Link>
        </p>
      </TiltCard>
    </main>
  );
}
