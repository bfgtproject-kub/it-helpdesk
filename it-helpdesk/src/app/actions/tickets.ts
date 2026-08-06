"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { classifyAndUpdateTicket } from "@/lib/ticket-classifier";

export type TicketFormState = { error?: string } | undefined;

export async function createTicket(
  _prevState: TicketFormState,
  formData: FormData
): Promise<TicketFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (title.length < 5) {
    return { error: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร" };
  }
  if (description.length < 10) {
    return { error: "กรุณาอธิบายรายละเอียดปัญหาอย่างน้อย 10 ตัวอักษร" };
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      createdById: session.user.id,
    },
  });

  await classifyAndUpdateTicket(ticket.id, title, description);

  redirect(`/tickets/${ticket.id}`);
}
