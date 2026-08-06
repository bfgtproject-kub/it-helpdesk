"use client";

import { useActionState } from "react";
import { updateAsset, deleteAsset, type AssetFormState } from "@/app/actions/admin-assets";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "พร้อมใช้งาน" },
  { value: "LOANED", label: "ถูกยืม" },
  { value: "MAINTENANCE", label: "ซ่อมบำรุง" },
  { value: "RETIRED", label: "ปลดระวาง" },
];

export default function AssetEditForm({
  assetId,
  currentName,
  currentStatus,
  currentPurchaseDate,
}: {
  assetId: string;
  currentName: string;
  currentStatus: string;
  currentPurchaseDate: string;
}) {
  const updateWithId = updateAsset.bind(null, assetId);
  const [state, action, pending] = useActionState<AssetFormState, FormData>(
    updateWithId,
    undefined
  );
  const deleteWithId = deleteAsset.bind(null, assetId);

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-3">
        <input
          name="name"
          defaultValue={currentName}
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-500">สถานะ</span>
          <select
            name="status"
            defaultValue={currentStatus}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-500">วันที่จัดซื้อ</span>
          <input
            name="purchaseDate"
            type="date"
            defaultValue={currentPurchaseDate}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

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
          if (!confirm("ยืนยันลบทรัพย์สินนี้? การลบไม่สามารถย้อนกลับได้")) {
            e.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 dark:border-red-900"
        >
          ลบทรัพย์สิน
        </button>
      </form>
    </div>
  );
}
