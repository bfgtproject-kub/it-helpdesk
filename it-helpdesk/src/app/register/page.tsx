"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">สมัครสมาชิก</h1>
        <p className="text-sm text-zinc-500">IT Helpdesk & Asset Management</p>
      </div>

      <form action={action} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="ชื่อ-นามสกุล"
          autoComplete="name"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
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
          placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
          autoComplete="new-password"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>

      <p className="text-sm text-zinc-500">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </main>
  );
}
