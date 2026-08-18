"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { createAsset } from "@/app/actions/admin-assets";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";

export default function NewAssetPage() {
  const [assetTag, setAssetTag] = useState("");
  const [name, setName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Not <form action={...}> — React 19 resets form fields back to empty
  // after a Server Action completes, even on a validation error, which
  // wiped whatever the user had just typed. Calling the action directly
  // keeps the fields in local state so a failed submit (e.g. duplicate
  // asset tag) doesn't lose the user's input.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("assetTag", assetTag);
      formData.set("name", name);
      formData.set("purchaseDate", purchaseDate);
      const result = await createAsset(undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4">
      <Mascot variant="asset" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <PackagePlus className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">เพิ่มทรัพย์สิน</h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="assetTag"
            value={assetTag}
            onChange={(e) => setAssetTag(e.target.value)}
            placeholder="รหัสครุภัณฑ์ เช่น NB-2026-001"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อทรัพย์สิน เช่น Notebook Dell Latitude"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted">วันที่จัดซื้อ (ถ้ามี)</span>
            <input
              name="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
