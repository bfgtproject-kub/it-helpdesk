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
    <div className="mt-3 flex flex-col gap-2 border-t border-gold/20 pt-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
        {pending ? "กำลังสรุป..." : "สร้างสรุป AI"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {summary && (
        <p className="text-pretty whitespace-pre-wrap text-sm text-foreground">{summary}</p>
      )}
    </div>
  );
}
