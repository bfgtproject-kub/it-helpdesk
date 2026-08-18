"use client";

import { Suspense, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { User, Lock, LogIn } from "lucide-react";
import { login } from "@/app/actions/auth";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";
import Mascot from "@/components/Mascot";
import MagneticButton from "@/components/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

// Recessed field: the inset shadow does the soft-UI work, and the hairline
// border carries the WCAG 1.4.11 boundary contrast that a shadow alone
// cannot (see --line in globals.css). Focus is handled by the global
// :focus-visible ring, so no outline-none here.
const FIELD_CLASS =
  "w-full rounded-xl border border-line/40 bg-background py-2.5 pl-10 pr-3 text-sm text-foreground shadow-neu-inset placeholder:text-muted";

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
        <p className="rounded-xl bg-accent-soft px-3 py-2 text-sm font-medium text-accent shadow-neu-inset">
          สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <User
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="อีเมล"
            autoComplete="email"
            required
            className={FIELD_CLASS}
          />
        </div>

        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            autoComplete="current-password"
            required
            className={FIELD_CLASS}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <MagneticButton
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold tracking-wide text-white disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </MagneticButton>
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
      tl.from(".neu-plate", { opacity: 0, scale: 0.92, duration: 0.7 })
        .from(orbWrapperRef.current, { opacity: 0, scale: 0.7, duration: 0.8 }, "-=0.4")
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
      className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4"
    >
      {/* Wide, very soft disc behind the card — the concentric "pressed into
          a sheet" look the reference mockups get from a big blurred plate. */}
      <div
        aria-hidden="true"
        className="neu-plate pointer-events-none absolute h-[21rem] w-[21rem] rounded-full bg-background shadow-neu-lg sm:h-[30rem] sm:w-[30rem]"
      />

      <Mascot
        variant="ai"
        className="pointer-events-none absolute bottom-[6%] right-2 h-14 w-14 sm:right-4 sm:h-16 sm:w-16"
      />

      <TiltCard className="relative flex w-full flex-col gap-7 rounded-[2rem] bg-card px-8 py-10 shadow-neu-lg">
        <div className="flex flex-col items-center gap-4 text-center">
          <div ref={orbWrapperRef}>
            <Hero3D className="h-20 w-20" />
          </div>
          <div>
            <h1 ref={titleRef} className="text-3xl font-bold tracking-tight text-foreground">
              เข้าสู่ระบบ
            </h1>
            <p className="reveal-item mt-1 text-sm text-muted">
              IT Helpdesk &amp; Asset Management
            </p>
          </div>
        </div>

        <div className="reveal-item">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="reveal-item text-center text-sm text-muted">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="font-medium text-accent underline">
            สมัครสมาชิก
          </Link>
        </p>
      </TiltCard>
    </main>
  );
}
