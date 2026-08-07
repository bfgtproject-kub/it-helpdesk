"use client";

import { useActionState, useRef } from "react";
import { updateUserRole, type UpdateRoleState } from "@/app/actions/admin-users";

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
  const updateWithId = updateUserRole.bind(null, userId);
  const [state, action, pending] = useActionState<UpdateRoleState, FormData>(
    updateWithId,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="flex flex-col items-end gap-1">
      <select
        name="role"
        defaultValue={currentRole}
        disabled={disabled || pending}
        onChange={() => formRef.current?.requestSubmit()}
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
      {state?.success && <span className="text-xs text-green-600">บันทึกแล้ว</span>}
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
