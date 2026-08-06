"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus, LoanStatus, Role } from "@/generated/prisma/client";

export type LoanFormState = { error?: string } | undefined;

export async function borrowAsset(
  assetId: string,
  _prevState: LoanFormState,
  _formData: FormData
): Promise<LoanFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findUnique({ where: { id: assetId } });
      if (!asset || asset.status !== AssetStatus.AVAILABLE) {
        throw new Error("ทรัพย์สินนี้ไม่พร้อมให้ยืมแล้ว");
      }

      await tx.assetLoan.create({
        data: {
          assetId,
          borrowerId: userId,
          status: LoanStatus.BORROWED,
        },
      });

      await tx.asset.update({
        where: { id: assetId },
        data: { status: AssetStatus.LOANED },
      });
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "เกิดข้อผิดพลาด" };
  }

  revalidatePath("/assets");
  return undefined;
}

export async function returnAsset(
  loanId: string,
  _prevState: LoanFormState,
  _formData: FormData
): Promise<LoanFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const currentUserId = session.user.id;
  const currentUserRole = session.user.role;

  try {
    await prisma.$transaction(async (tx) => {
      const loan = await tx.assetLoan.findUnique({ where: { id: loanId } });
      if (!loan || loan.status !== LoanStatus.BORROWED) {
        throw new Error("รายการยืมนี้ถูกคืนไปแล้ว");
      }

      const canReturn =
        loan.borrowerId === currentUserId ||
        currentUserRole === Role.IT_STAFF ||
        currentUserRole === Role.ADMIN;
      if (!canReturn) {
        throw new Error("คุณไม่มีสิทธิ์คืนทรัพย์สินนี้");
      }

      await tx.assetLoan.update({
        where: { id: loanId },
        data: { status: LoanStatus.RETURNED, returnedAt: new Date() },
      });

      await tx.asset.update({
        where: { id: loan.assetId },
        data: { status: AssetStatus.AVAILABLE },
      });
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "เกิดข้อผิดพลาด" };
  }

  revalidatePath("/assets");
  return undefined;
}
