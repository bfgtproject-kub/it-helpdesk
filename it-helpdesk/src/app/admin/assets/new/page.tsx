"use client";

import { useActionState } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { createAsset } from "@/app/actions/admin-assets";
import FadeIn from "@/components/FadeIn";

export default function NewAssetPage() {
  const [state, action, pending] = useActionState(createAsset, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4">
      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <PackagePlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">เพิ่มทรัพย์สิน</h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form action={action} className="flex flex-col gap-3">
          <input
            name="assetTag"
            placeholder="รหัสครุภัณฑ์ เช่น NB-2026-001"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <input
            name="name"
            placeholder="ชื่อทรัพย์สิน เช่น Notebook Dell Latitude"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">วันที่จัดซื้อ (ถ้ามี)</span>
            <input
              name="purchaseDate"
              type="date"
              className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
            />
          </label>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-full bg-gold-deep px-3 py-2.5 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "กำลังบันทึก..." : "เพิ่มทรัพย์สิน"}
          </button>
        </form>
      </FadeIn>

      <Link href="/admin/assets" className="text-sm text-muted underline">
        ยกเลิก
      </Link>
    </main>
  );
}
