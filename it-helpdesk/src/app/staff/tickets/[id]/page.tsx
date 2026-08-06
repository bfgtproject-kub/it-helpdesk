import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { claimTicket } from "@/app/actions/staff-tickets";
import UpdateTicketForm from "../UpdateTicketForm";

const SEVERITY_LABEL: Record<string, string> = {
  PENDING_REVIEW: "รอตรวจสอบ",
  LOW: "ต่ำ",
  MEDIUM: "ปานกลาง",
  HIGH: "สูง",
};

export default async function StaffTicketDetailPage(
  props: PageProps<"/staff/tickets/[id]">
) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.IT_STAFF && session.user.role !== Role.ADMIN)
  ) {
    redirect("/dashboard");
  }

  const { id } = await props.params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      assignedTo: { select: { name: true } },
      category: true,
    },
  });

  if (!ticket) notFound();

  const claimWithId = claimTicket.bind(null, ticket.id);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4 py-12">
      <div>
        <Link href="/staff/tickets" className="text-sm text-zinc-500 underline">
          &larr; Ticket ทั้งหมด
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{ticket.title}</h1>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <p>
          <span className="text-zinc-500">แจ้งโดย: </span>
          {ticket.createdBy.name} ({ticket.createdBy.email})
        </p>
        <p>
          <span className="text-zinc-500">ความรุนแรง: </span>
          {SEVERITY_LABEL[ticket.severity]}
        </p>
        <p>
          <span className="text-zinc-500">หมวดหมู่: </span>
          {ticket.category?.name ?? "รอ AI จัดหมวดหมู่"}
        </p>
        <p>
          <span className="text-zinc-500">ผู้รับผิดชอบ: </span>
          {ticket.assignedTo?.name ?? "ยังไม่มีผู้รับงาน"}
        </p>
      </div>

      <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>

      {!ticket.assignedTo && (
        <form action={claimWithId}>
          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            รับงานนี้
          </button>
        </form>
      )}

      <UpdateTicketForm
        ticketId={ticket.id}
        currentStatus={ticket.status}
        currentResolution={ticket.resolution ?? ""}
      />
    </main>
  );
}
