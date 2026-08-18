"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { MessageCirclePlus } from "lucide-react";
import { createFaqEntry } from "@/app/actions/admin-faq";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";

export default function NewFaqPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Not <form action={...}> — React 19 resets form fields back to empty
  // after a Server Action completes, even on a validation error, which
  // wiped whatever the user had just typed. Calling the action directly
  // keeps the fields in local state so a failed submit doesn't lose input.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("question", question);
      formData.set("answer", answer);
      const result = await createFaqEntry(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <Mascot variant="faq" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <MessageCirclePlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          เพิ่มคำถามในฐานความรู้
        </h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="คำถาม เช่น รีเซ็ตรหัสผ่านต้องทำอย่างไร"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <textarea
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="คำตอบ"
            required
            rows={6}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

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
