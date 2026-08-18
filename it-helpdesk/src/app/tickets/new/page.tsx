"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { createTicket } from "@/app/actions/tickets";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";

export default function NewTicketPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Not <form action={...}> — React 19 resets form fields back to empty
  // after a Server Action completes, even on a validation error, which
  // wiped whatever the user had just typed. Calling the action directly
  // keeps title/description in local state so a failed submit doesn't
  // lose the user's input.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      const result = await createTicket(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <Mascot variant="ticket" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn>
        <h1 className="font-serif text-2xl font-semibold text-foreground">แจ้งปัญหาใหม่</h1>
        <p className="text-sm text-muted">
          อธิบายปัญหาที่พบ ทีม IT จะรับเรื่องและติดต่อกลับ
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="หัวข้อปัญหา เช่น เครื่องปริ้นเตอร์ใช้งานไม่ได้"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="อธิบายรายละเอียดปัญหาให้ชัดเจน"
            required
            rows={5}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-deep px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
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
