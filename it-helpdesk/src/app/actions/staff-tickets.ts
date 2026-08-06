"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, TicketStatus } from "@/generated/prisma/client";

async function requireStaff() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.IT_STAFF && session.user.role !== Role.ADMIN)
  ) {
    redirect("/dashboard");
  }
  return session.user;
}

export async function claimTicket(ticketId: string, _formData: FormData) {
  const user = await requireStaff();

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assignedToId: user.id,
      status: TicketStatus.IN_PROGRESS,
    },
  });

  revalidatePath(`/staff/tickets/${ticketId}`);
  revalidatePath("/staff/tickets");
}

export type UpdateTicketState = { error?: string; success?: boolean } | undefined;

export async function updateTicket(
  ticketId: string,
  _prevState: UpdateTicketState,
  formData: FormData
): Promise<UpdateTicketState> {
  await requireStaff();

  const status = String(formData.get("status") ?? "");
  const resolution = String(formData.get("resolution") ?? "").trim();

  if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
    return { error: "สถานะไม่ถูกต้อง" };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: status as TicketStatus,
      resolution: resolution || null,
    },
  });

  revalidatePath(`/staff/tickets/${ticketId}`);
  revalidatePath("/staff/tickets");
  return { success: true };
}
