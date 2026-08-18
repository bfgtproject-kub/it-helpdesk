"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Save, KeyRound } from "lucide-react";
import { updateProfile, changePassword } from "@/app/actions/settings";
import { useToast } from "@/components/ToastProvider";
import UserAvatar from "@/components/UserAvatar";

export default function SettingsForm({
  name: initialName,
  email,
  image: initialImage,
}: {
  name: string;
  email: string;
  image: string | null;
}) {
  const { showToast } = useToast();

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage ?? "");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profilePending, startProfileTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, startPasswordTransition] = useTransition();

  // Not <form action={...}> — see other forms in this app for the full React
  // 19 form-reset explanation. Calling the server action directly keeps
  // fields in local state so a failed save doesn't lose what was typed.
  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileError(null);

    startProfileTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("image", image);
      const result = await updateProfile(undefined, formData);
      if (result?.error) {
        setProfileError(result.error);
        return;
      }
      showToast("บันทึกโปรไฟล์เรียบร้อย");
    });
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);

    startPasswordTransition(async () => {
      const formData = new FormData();
      formData.set("currentPassword", currentPassword);
      formData.set("newPassword", newPassword);
      formData.set("confirmPassword", confirmPassword);
      const result = await changePassword(undefined, formData);
      if (result?.error) {
        setPasswordError(result.error);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("เปลี่ยนรหัสผ่านเรียบร้อย");
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
          โปรไฟล์
        </h2>

        <div className="flex items-center gap-4">
          <UserAvatar name={name || "?"} image={image} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted">{email}</p>
            <p className="text-xs text-muted">อีเมลไม่สามารถแก้ไขได้</p>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">ชื่อ-นามสกุล</span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">ลิงก์รูปโปรไฟล์ (ถ้ามี)</span>
          <input
            name="image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/my-photo.jpg"
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
          <span className="text-xs text-muted">
            วางลิงก์รูปที่โฮสต์ไว้ที่อื่นแล้ว (เช่น Google, imgur) เว้นว่างไว้เพื่อใช้ตัวอักษรย่อแทน
          </span>
        </label>

        {profileError && <p className="text-sm text-red-600">{profileError}</p>}

        <button
          type="submit"
          disabled={profilePending}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {profilePending ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 border-t border-gold/20 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
          เปลี่ยนรหัสผ่าน
        </h2>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">รหัสผ่านปัจจุบัน</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">ยืนยันรหัสผ่านใหม่</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
          />
        </label>

        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

        <button
          type="submit"
          disabled={passwordPending}
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-gold-wash disabled:opacity-50"
        >
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          {passwordPending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
        </button>
      </form>
    </div>
  );
}
