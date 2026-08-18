"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
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
    <div className="mt-4 flex flex-col gap-3 border-t border-line/20 pt-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-neu-sm transition-shadow duration-150 hover:shadow-neu active:shadow-neu-pressed disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        {pending ? "กำลังสรุป..." : "สร้างสรุป AI"}
      </button>

      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      {summary && (
        <p className="text-pretty whitespace-pre-wrap rounded-xl bg-background p-4 text-sm text-foreground shadow-neu-inset">
          {summary}
        </p>
      )}
    </div>
  );
}
