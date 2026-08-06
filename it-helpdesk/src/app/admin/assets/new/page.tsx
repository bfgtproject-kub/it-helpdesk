"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAsset } from "@/app/actions/admin-assets";

export default function NewAssetPage() {
  const [state, action, pending] = useActionState(createAsset, undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">เพิ่มทรัพย์สิน</h1>
      </div>

      <form action={action} className="flex flex-col gap-3">
        <input
          name="assetTag"
          placeholder="รหัสครุภัณฑ์ เช่น NB-2026-001"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          name="name"
          placeholder="ชื่อทรัพย์สิน เช่น Notebook Dell Latitude"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-500">วันที่จัดซื้อ (ถ้ามี)</span>
          <input
            name="purchaseDate"
            type="date"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "กำลังบันทึก..." : "เพิ่มทรัพย์สิน"}
        </button>
      </form>

      <Link href="/admin/assets" className="text-sm text-zinc-500 underline">
        ยกเลิก
      </Link>
    </main>
  );
}
