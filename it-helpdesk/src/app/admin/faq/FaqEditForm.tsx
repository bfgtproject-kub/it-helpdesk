"use client";

import { useActionState } from "react";
import { Save, Trash2 } from "lucide-react";
import { updateFaqEntry, deleteFaqEntry, type FaqFormState } from "@/app/actions/admin-faq";

export default function FaqEditForm({
  faqId,
  currentQuestion,
  currentAnswer,
}: {
  faqId: string;
  currentQuestion: string;
  currentAnswer: string;
}) {
  const updateWithId = updateFaqEntry.bind(null, faqId);
  const [state, action, pending] = useActionState<FaqFormState, FormData>(
    updateWithId,
    undefined
  );
  const deleteWithId = deleteFaqEntry.bind(null, faqId);

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-3">
        <input
          name="question"
          defaultValue={currentQuestion}
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
        <textarea
          name="answer"
          defaultValue={currentAnswer}
          required
          rows={6}
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

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
