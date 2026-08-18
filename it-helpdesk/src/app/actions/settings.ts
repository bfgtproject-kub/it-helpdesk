"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ProfileFormState = { error?: string; success?: boolean } | undefined;

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (name.length < 2) {
    return { error: "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร" };
  }
  if (image && !/^https?:\/\/.+/i.test(image)) {
    return { error: "ลิงก์รูปภาพไม่ถูกต้อง ต้องขึ้นต้นด้วย http:// หรือ https://" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, image: image || null },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/admin/users");
  return { success: true };
}

export type PasswordFormState = { error?: string; success?: boolean } | undefined;

export async function changePassword(
  _prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "รหัสผ่านใหม่ไม่ตรงกัน" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { error: "ไม่พบผู้ใช้งาน" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
