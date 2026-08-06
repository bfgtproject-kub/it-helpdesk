"use server";

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
