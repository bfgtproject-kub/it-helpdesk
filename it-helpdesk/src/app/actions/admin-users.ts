"use server";

import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }
  return session.user;
}

export type UpdateRoleState = { error?: string; success?: boolean } | undefined;

export async function updateUserRole(
  userId: string,
  _prevState: UpdateRoleState,
  formData: FormData
): Promise<UpdateRoleState> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { error: "ไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้" };
  }

  const role = String(formData.get("role") ?? "");
  if (!Object.values(Role).includes(role as Role)) {
    return { error: "สิทธิ์ไม่ถูกต้อง" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export type ResetPasswordState =
  | { error?: string; tempPassword?: string }
  | undefined;

// Readable but strong enough to survive the short window before the user
// changes it. Words + digits so it can be read out over the phone or a chat
// without ambiguity, which is how a helpdesk actually hands one over.
const TEMP_WORDS = [
  "Falcon", "Harbor", "Lantern", "Meadow",
  "Quartz", "Summit", "Timber", "Willow",
];

function generateTempPassword() {
  const pick = () => TEMP_WORDS[randomInt(0, TEMP_WORDS.length)];
  return `${pick()}-${pick()}-${randomInt(1000, 9999)}`;
}

/**
 * Admin-initiated password reset — the recovery path for a user who is locked
 * out. There is no email provider configured in this project, so instead of a
 * emailed reset link the admin generates a temporary password and passes it to
 * the user, who then changes it at /settings.
 *
 * The plaintext is returned to the caller exactly once and never stored; only
 * the bcrypt hash is persisted, using the same cost factor as registration.
 */
export async function resetUserPassword(
  userId: string
): Promise<ResetPasswordState> {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { error: "ไม่พบผู้ใช้งาน" };
  }

  const tempPassword = generateTempPassword();
  const hashed = await bcrypt.hash(tempPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  revalidatePath("/admin/users");
  return { tempPassword };
}
