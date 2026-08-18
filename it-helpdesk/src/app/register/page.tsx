"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import Hero3D from "@/components/Hero3D";
import TiltCard from "@/components/TiltCard";
import Mascot from "@/components/Mascot";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Not <form action={...}> — React 19 resets form fields after a Server
  // Action completes, even on a validation error, which wiped whatever the
  // user had just typed (e.g. re-typing name+email after "email already
  // registered"). Calling the action directly keeps fields in local state.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("password", password);
      const result = await registerUser(undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/login?registered=1");
    });
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-4">
      <Mascot variant="ai" className="pointer-events-none absolute right-2 bottom-[12%] h-16 w-16 sm:right-4" />

      <TiltCard className="flex w-full flex-col gap-6 rounded-2xl border border-gold/25 bg-card px-8 py-10 shadow-[0_25px_70px_-20px_rgba(176,141,87,0.35)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <Hero3D className="h-16 w-16" />
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">สมัครสมาชิก</h1>
            <p className="text-sm text-muted">IT Helpdesk & Asset Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ-นามสกุล"
            autoComplete="name"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
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
            placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
            autoComplete="new-password"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-deep px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="text-gold-deep underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </TiltCard>
    </main>
  );
}
