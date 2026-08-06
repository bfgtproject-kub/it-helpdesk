"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createFaqEntry } from "@/app/actions/admin-faq";

export default function NewFaqPage() {
  const [state, action, pending] = useActionState(createFaqEntry, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">เพิ่มคำถามในฐานความรู้</h1>
      </div>

      <form action={action} className="flex flex-col gap-3">
        <input
          name="question"
          placeholder="คำถาม เช่น รีเซ็ตรหัสผ่านต้องทำอย่างไร"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          name="answer"
          placeholder="คำตอบ"
          required
          rows={6}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "กำลังบันทึก..." : "เพิ่ม"}
        </button>
      </form>

      <Link href="/admin/faq" className="text-sm text-zinc-500 underline">
        ยกเลิก
      </Link>
    </main>
  );
}
