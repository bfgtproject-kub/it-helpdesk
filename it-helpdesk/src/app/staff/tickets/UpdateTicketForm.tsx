"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateTicket } from "@/app/actions/staff-tickets";
import { useToast } from "@/components/ToastProvider";

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
  const [status, setStatus] = useState(currentStatus);
  const [resolution, setResolution] = useState(currentResolution);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { showToast } = useToast();

  // Deliberately not a <form action={...}> — React 19 resets uncontrolled
  // (and even controlled, since the reset happens outside React's own
  // commit cycle) form fields back to their pre-submit value once a form
  // action completes. Calling the server action directly, the same way
  // askChatbot/scanAssetLabel do elsewhere in this app, sidesteps that
  // native-form-submission machinery entirely — this is what actually
  // fixes the long-standing "select shows the old value after saving" bug.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("status", status);
      formData.set("resolution", resolution);
      const result = await updateTicket(ticketId, undefined, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      showToast("บันทึกตั๋วเรียบร้อย");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <span className="text-muted">วิธีแก้ไข</span>
        <textarea
          name="resolution"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          rows={4}
          placeholder="บันทึกวิธีแก้ไขปัญหา"
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "กำลังบันทึก..." : "บันทึก"}
      </button>
    </form>
  );
}
