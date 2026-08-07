"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MessageCirclePlus } from "lucide-react";
import { createFaqEntry } from "@/app/actions/admin-faq";
import FadeIn from "@/components/FadeIn";

export default function NewFaqPage() {
  const [state, action, pending] = useActionState(createFaqEntry, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <MessageCirclePlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          เพิ่มคำถามในฐานความรู้
        </h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form action={action} className="flex flex-col gap-3">
          <input
            name="question"
            placeholder="คำถาม เช่น รีเซ็ตรหัสผ่านต้องทำอย่างไร"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <textarea
            name="answer"
            placeholder="คำตอบ"
            required
            rows={6}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-deep px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "กำลังบันทึก..." : "เพิ่ม"}
          </button>
        </form>
      </FadeIn>

      <Link href="/admin/faq" className="text-sm text-muted underline">
        ยกเลิก
      </Link>
    </main>
  );
}
