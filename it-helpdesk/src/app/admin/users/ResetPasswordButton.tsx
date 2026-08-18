"use client";

import { useState, useTransition } from "react";
import { KeyRound, Copy, Check } from "lucide-react";
import { resetUserPassword } from "@/app/actions/admin-users";
import { useToast } from "@/components/ToastProvider";

export default function ResetPasswordButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { showToast } = useToast();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleReset() {
    if (pending) return;
    if (
      !confirm(
        `ตั้งรหัสผ่านชั่วคราวใหม่ให้ "${userName}"?\n\nรหัสผ่านเดิมจะใช้ไม่ได้ทันที และจะแสดงรหัสใหม่ให้เพียงครั้งเดียว`
      )
    ) {
      return;
    }

    startTransition(async () => {
      const result = await resetUserPassword(userId);
      if (result?.error) {
        showToast(result.error, "error");
        return;
      }
      if (result?.tempPassword) {
        setTempPassword(result.tempPassword);
        setCopied(false);
        showToast("ตั้งรหัสผ่านชั่วคราวเรียบร้อย");
      }
    });
  }

  async function handleCopy() {
    if (!tempPassword) return;
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure origin / denied permission) — the
      // password is on screen anyway, so this is a convenience, not the path.
      showToast("คัดลอกอัตโนมัติไม่ได้ กรุณาคัดลอกด้วยตนเอง", "error");
    }
  }

  return (
    <div className="relative flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleReset}
        disabled={pending}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-neu-sm transition-shadow duration-150 hover:shadow-neu active:shadow-neu-pressed disabled:opacity-50"
      >
        <KeyRound className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        {pending ? "กำลังตั้งรหัส..." : "รีเซ็ตรหัสผ่าน"}
      </button>

      {/* Floated rather than inline: expanding this row inline squeezed the
          user's email into truncation on narrower screens. */}
      {tempPassword && (
        <div
          role="status"
          className="absolute right-0 top-full z-10 mt-2 flex w-max flex-col items-end gap-1 rounded-xl bg-accent-soft px-3 py-2 shadow-neu"
        >
          <span className="text-[11px] text-muted">
            รหัสชั่วคราว (แสดงครั้งเดียว)
          </span>
          <div className="flex items-center gap-2">
            <code className="select-all font-mono text-sm font-semibold text-accent">
              {tempPassword}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="คัดลอกรหัสผ่านชั่วคราว"
              className="text-accent transition-opacity hover:opacity-70"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
          <span className="text-[11px] text-muted">
            ให้ผู้ใช้เปลี่ยนรหัสที่หน้าตั้งค่าทันที
          </span>
        </div>
      )}
    </div>
  );
}
