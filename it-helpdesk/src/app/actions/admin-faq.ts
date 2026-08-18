"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export type FaqFormState = { error?: string } | undefined;

export async function createFaqEntry(
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  await requireAdmin();

  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();

  if (question.length < 5) {
    return { error: "กรุณากรอกคำถามอย่างน้อย 5 ตัวอักษร" };
  }
  if (answer.length < 5) {
    return { error: "กรุณากรอกคำตอบอย่างน้อย 5 ตัวอักษร" };
  }

  await prisma.faqEntry.create({ data: { question, answer } });

  revalidatePath("/admin/faq");
  redirect("/admin/faq?created=1");
}

export async function updateFaqEntry(
  faqId: string,
  _prevState: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  await requireAdmin();

  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();

  if (question.length < 5) {
    return { error: "กรุณากรอกคำถามอย่างน้อย 5 ตัวอักษร" };
  }
  if (answer.length < 5) {
    return { error: "กรุณากรอกคำตอบอย่างน้อย 5 ตัวอักษร" };
  }

  await prisma.faqEntry.update({
    where: { id: faqId },
    data: { question, answer },
  });

  revalidatePath("/admin/faq");
  redirect("/admin/faq?updated=1");
}

export async function deleteFaqEntry(faqId: string, _formData: FormData) {
  await requireAdmin();
  await prisma.faqEntry.delete({ where: { id: faqId } });
  revalidatePath("/admin/faq");
  redirect("/admin/faq?deleted=1");
}
