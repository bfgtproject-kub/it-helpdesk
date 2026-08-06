"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTicket } from "@/app/actions/tickets";

export default function NewTicketPage() {
  const [state, action, pending] = useActionState(createTicket, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">แจ้งปัญหาใหม่</h1>
        <p className="text-sm text-zinc-500">
          อธิบายปัญหาที่พบ ทีม IT จะรับเรื่องและติดต่อกลับ
        </p>
      </div>

      <form action={action} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="หัวข้อปัญหา เช่น เครื่องปริ้นเตอร์ใช้งานไม่ได้"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          name="description"
          placeholder="อธิบายรายละเอียดปัญหาให้ชัดเจน"
          required
          rows={5}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "กำลังส่ง..." : "ส่งเรื่อง"}
        </button>
      </form>

      <Link href="/tickets" className="text-sm text-zinc-500 underline">
        ยกเลิก
      </Link>
    </main>
  );
}
