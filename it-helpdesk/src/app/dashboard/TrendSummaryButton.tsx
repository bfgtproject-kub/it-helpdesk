"use client";

import { useState, useTransition } from "react";
import { generateTrendSummary } from "@/app/actions/trend-summary";

export default function TrendSummaryButton() {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (pending) return;
    setError(null);

    startTransition(async () => {
      const result = await generateTrendSummary();
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSummary(result.summary);
    });
  }

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-fit rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-700"
      >
        {pending ? "กำลังสรุป..." : "สร้างสรุป AI"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {summary && (
        <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
          {summary}
        </p>
      )}
    </div>
  );
}
