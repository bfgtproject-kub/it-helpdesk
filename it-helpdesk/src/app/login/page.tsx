"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  return (
    <>
      {justRegistered && (
        <p className="rounded-md border border-gold/30 bg-gold-wash px-3 py-2 text-sm font-medium text-foreground">
          สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ
        </p>
      )}

      <form action={action} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="อีเมล"
          autoComplete="email"
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
        <input
          name="password"
          type="password"
          placeholder="รหัสผ่าน"
          autoComplete="current-password"
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-gold px-3 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-4">
      <TiltCard className="flex w-full flex-col gap-6 rounded-2xl border border-gold/25 bg-card px-8 py-10 shadow-[0_25px_70px_-20px_rgba(176,141,87,0.35)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <Hero3D className="h-16 w-16" />
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">เข้าสู่ระบบ</h1>
            <p className="text-sm text-muted">IT Helpdesk & Asset Management</p>
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-sm text-muted">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-gold underline">
            สมัครสมาชิก
          </Link>
        </p>
      </TiltCard>
    </main>
  );
}
