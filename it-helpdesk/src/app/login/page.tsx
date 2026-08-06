"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  return (
    <>
      {justRegistered && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
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
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          name="password"
          type="password"
          placeholder="รหัสผ่าน"
          autoComplete="current-password"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>
        <p className="text-sm text-zinc-500">IT Helpdesk & Asset Management</p>
      </div>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>

      <p className="text-sm text-zinc-500">
        ยังไม่มีบัญชี?{" "}
        <Link href="/register" className="underline">
          สมัครสมาชิก
        </Link>
      </p>
    </main>
  );
}
