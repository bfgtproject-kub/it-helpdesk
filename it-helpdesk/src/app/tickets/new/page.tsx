"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTicket } from "@/app/actions/tickets";
import FadeIn from "@/components/FadeIn";

export default function NewTicketPage() {
  const [state, action, pending] = useActionState(createTicket, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <FadeIn>
        <h1 className="font-serif text-2xl font-semibold text-foreground">แจ้งปัญหาใหม่</h1>
        <p className="text-sm text-muted">
          อธิบายปัญหาที่พบ ทีม IT จะรับเรื่องและติดต่อกลับ
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form action={action} className="flex flex-col gap-3">
          <input
            name="title"
            placeholder="หัวข้อปัญหา เช่น เครื่องปริ้นเตอร์ใช้งานไม่ได้"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <textarea
            name="description"
            placeholder="อธิบายรายละเอียดปัญหาให้ชัดเจน"
            required
            rows={5}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "กำลังส่ง..." : "ส่งเรื่อง"}
          </button>
        </form>
      </FadeIn>

      <Link href="/tickets" className="text-sm text-muted underline">
        ยกเลิก
      </Link>
    </main>
  );
}
