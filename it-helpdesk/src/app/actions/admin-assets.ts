"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, AssetStatus } from "@/generated/prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }
  return session.user;
}

export type AssetFormState = { error?: string } | undefined;

export async function createAsset(
  _prevState: AssetFormState,
  formData: FormData
): Promise<AssetFormState> {
  await requireAdmin();

  const assetTag = String(formData.get("assetTag") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const purchaseDateRaw = String(formData.get("purchaseDate") ?? "");

  if (assetTag.length < 2) {
    return { error: "กรุณากรอกรหัสครุภัณฑ์" };
  }
  if (name.length < 2) {
    return { error: "กรุณากรอกชื่อทรัพย์สิน" };
  }

  const existing = await prisma.asset.findUnique({ where: { assetTag } });
  if (existing) {
    return { error: "รหัสครุภัณฑ์นี้มีอยู่แล้ว" };
  }

  await prisma.asset.create({
    data: {
      assetTag,
      name,
      purchaseDate: purchaseDateRaw ? new Date(purchaseDateRaw) : null,
    },
  });

  revalidatePath("/admin/assets");
  redirect("/admin/assets");
}

export async function updateAsset(
  assetId: string,
  _prevState: AssetFormState,
  formData: FormData
): Promise<AssetFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const purchaseDateRaw = String(formData.get("purchaseDate") ?? "");

  if (name.length < 2) {
    return { error: "กรุณากรอกชื่อทรัพย์สิน" };
  }
  if (!Object.values(AssetStatus).includes(status as AssetStatus)) {
    return { error: "สถานะไม่ถูกต้อง" };
  }

  await prisma.asset.update({
    where: { id: assetId },
    data: {
      name,
      status: status as AssetStatus,
      purchaseDate: purchaseDateRaw ? new Date(purchaseDateRaw) : null,
    },
  });

  revalidatePath("/admin/assets");
  redirect("/admin/assets");
}

export async function deleteAsset(assetId: string, _formData: FormData) {
  await requireAdmin();
  await prisma.asset.delete({ where: { id: assetId } });
  revalidatePath("/admin/assets");
  redirect("/admin/assets");
}
