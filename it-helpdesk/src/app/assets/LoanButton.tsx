"use client";

import { useActionState } from "react";
import { borrowAsset, returnAsset, type LoanFormState } from "@/app/actions/loans";

export function BorrowButton({ assetId }: { assetId: string }) {
  const action = borrowAsset.bind(null, assetId);
  const [state, formAction, pending] = useActionState<LoanFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        className="whitespace-nowrap rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "กำลังยืม..." : "ยืม"}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}

export function ReturnButton({ loanId }: { loanId: string }) {
  const action = returnAsset.bind(null, loanId);
  const [state, formAction, pending] = useActionState<LoanFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        className="whitespace-nowrap rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
      >
        {pending ? "กำลังคืน..." : "คืน"}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
