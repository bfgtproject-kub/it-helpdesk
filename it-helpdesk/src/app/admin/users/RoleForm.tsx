"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { updateUserRole } from "@/app/actions/admin-users";

const ROLE_OPTIONS = [
  { value: "USER", label: "ผู้ใช้งานทั่วไป" },
  { value: "IT_STAFF", label: "เจ้าหน้าที่ IT" },
  { value: "ADMIN", label: "ผู้ดูแลระบบ" },
];

export default function RoleForm({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: string;
  disabled?: boolean;
}) {
  const [role, setRole] = useState(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  // Deliberately not a <form action={...}> — React 19 resets uncontrolled
  // (and even controlled, since the reset happens outside React's own
  // commit cycle) form fields back to their pre-submit value once a form
  // action completes. Calling the server action directly, the same way
  // askChatbot/scanAssetLabel do elsewhere in this app, sidesteps that
  // native-form-submission machinery entirely.
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    setRole(newRole);
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("role", newRole);
      const result = await updateUserRole(userId, undefined, formData);
      if (result?.error) {
        setError(result.error);
        setRole(currentRole);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        name="role"
        value={role}
        disabled={disabled || pending}
        onChange={handleChange}
        className="rounded-lg border border-gold/25 bg-background px-2 py-1 text-sm text-foreground outline-none transition focus:border-gold disabled:opacity-50"
      >
        {ROLE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {disabled && <span className="text-xs text-muted">บัญชีของคุณเอง</span>}
      {pending && <span className="text-xs text-muted">กำลังบันทึก...</span>}
      {success && <span className="text-xs text-green-600">บันทึกแล้ว</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
