"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Save, Trash2 } from "lucide-react";
import { updateAsset, deleteAsset } from "@/app/actions/admin-assets";

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
  const [name, setName] = useState(currentName);
  const [status, setStatus] = useState(currentStatus);
  const [purchaseDate, setPurchaseDate] = useState(currentPurchaseDate);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const deleteWithId = deleteAsset.bind(null, assetId);

  // Not <form action={...}> — React 19 resets form fields after a Server
  // Action completes, even on a validation error, which wiped whatever the
  // admin had just edited. Calling the action directly keeps the fields in
  // local state so a failed save doesn't lose the edit.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("status", status);
      formData.set("purchaseDate", purchaseDate);
      const result = await updateAsset(assetId, undefined, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">สถานะ</span>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

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
