"use client";

import { useActionState } from "react";
import { PackageCheck, Undo2 } from "lucide-react";
import { borrowAsset, returnAsset, type LoanFormState } from "@/app/actions/loans";

export function BorrowButton({ assetId }: { assetId: string }) {
  const action = borrowAsset.bind(null, assetId);
  const [state, formAction, pending] = useActionState<LoanFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-deep px-3 py-1.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
      >
        <PackageCheck className="h-4 w-4" aria-hidden="true" />
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
    <form action={formAction} className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/40 px-3 py-1.5 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash disabled:opacity-50"
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
        {pending ? "กำลังคืน..." : "คืน"}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
