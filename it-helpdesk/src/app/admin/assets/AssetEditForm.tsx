"use client";

import { useActionState } from "react";
import { Save, Trash2 } from "lucide-react";
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
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">สถานะ</span>
          <select
            name="status"
            defaultValue={currentStatus}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">วันที่จัดซื้อ</span>
          <input
            name="purchaseDate"
            type="date"
            defaultValue={currentPurchaseDate}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
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
          className="inline-flex items-center gap-1.5 rounded-full border border-red-300 px-3 py-2 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          ลบทรัพย์สิน
        </button>
      </form>
    </div>
  );
}
