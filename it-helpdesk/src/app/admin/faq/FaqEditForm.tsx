"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Save, Trash2 } from "lucide-react";
import { updateFaqEntry, deleteFaqEntry } from "@/app/actions/admin-faq";

export default function FaqEditForm({
  faqId,
  currentQuestion,
  currentAnswer,
}: {
  faqId: string;
  currentQuestion: string;
  currentAnswer: string;
}) {
  const [question, setQuestion] = useState(currentQuestion);
  const [answer, setAnswer] = useState(currentAnswer);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const deleteWithId = deleteFaqEntry.bind(null, faqId);

  // Not <form action={...}> — React 19 resets form fields after a Server
  // Action completes, even on a validation error, which wiped whatever the
  // admin had just edited. Calling the action directly keeps the fields in
  // local state so a failed save doesn't lose the edit.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("question", question);
      formData.set("answer", answer);
      const result = await updateFaqEntry(faqId, undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
        <textarea
          name="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          rows={6}
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>

      <form
        action={deleteWithId}
        onSubmit={(e) => {
          if (!confirm("ยืนยันลบคำถามนี้?")) {
            e.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          ลบ
        </button>
      </form>
    </div>
  );
}
