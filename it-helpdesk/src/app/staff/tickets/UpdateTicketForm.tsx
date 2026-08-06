"use client";

import { useActionState, useState } from "react";
import { updateTicket, type UpdateTicketState } from "@/app/actions/staff-tickets";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "รอดำเนินการ" },
  { value: "IN_PROGRESS", label: "กำลังดำเนินการ" },
  { value: "RESOLVED", label: "แก้ไขแล้ว" },
  { value: "CLOSED", label: "ปิดงาน" },
];

export default function UpdateTicketForm({
  ticketId,
  currentStatus,
  currentResolution,
}: {
  ticketId: string;
  currentStatus: string;
  currentResolution: string;
}) {
  const updateWithId = updateTicket.bind(null, ticketId);
  const [state, action, pending] = useActionState<UpdateTicketState, FormData>(
    updateWithId,
    undefined
  );

  // Controlled inputs seeded from server props once. Kept local (not
  // re-synced on every prop change) so a successful save keeps showing
  // exactly what was submitted instead of racing the RSC refresh.
  const [status, setStatus] = useState(currentStatus);
  const [resolution, setResolution] = useState(currentResolution);

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-500">สถานะ</span>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
        <span className="text-zinc-500">วิธีแก้ไข</span>
        <textarea
          name="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          rows={4}
          placeholder="บันทึกวิธีแก้ไขปัญหา"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">บันทึกเรียบร้อย</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </form>
  );
}
