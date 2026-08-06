"use client";

import { useActionState } from "react";
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
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <textarea
          name="answer"
          defaultValue={currentAnswer}
          required
          rows={6}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-fit rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
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
          className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-900"
        >
          ลบ
        </button>
      </form>
    </div>
  );
}
