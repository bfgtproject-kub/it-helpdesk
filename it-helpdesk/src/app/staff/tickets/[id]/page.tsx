import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { claimTicket } from "@/app/actions/staff-tickets";
import FadeIn from "@/components/FadeIn";
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
      <FadeIn>
        <Link href="/staff/tickets" className="text-sm text-muted underline">
          &larr; Ticket ทั้งหมด
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground">{ticket.title}</h1>
      </FadeIn>

      <FadeIn delay={0.05} className="rounded-xl border border-gold/25 bg-card p-4 text-sm">
        <p>
          <span className="text-muted">แจ้งโดย: </span>
          {ticket.createdBy.name} ({ticket.createdBy.email})
        </p>
        <p>
          <span className="text-muted">ความรุนแรง: </span>
          {SEVERITY_LABEL[ticket.severity]}
        </p>
        <p>
          <span className="text-muted">หมวดหมู่: </span>
          {ticket.category?.name ?? "รอ AI จัดหมวดหมู่"}
        </p>
        <p>
          <span className="text-muted">ผู้รับผิดชอบ: </span>
          {ticket.assignedTo?.name ?? "ยังไม่มีผู้รับงาน"}
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="whitespace-pre-wrap text-sm text-foreground">{ticket.description}</p>
      </FadeIn>

      {!ticket.assignedTo && (
        <FadeIn delay={0.15}>
          <form action={claimWithId}>
            <button
              type="submit"
              className="rounded-full bg-gold px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110"
            >
              รับงานนี้
            </button>
          </form>
        </FadeIn>
      )}

      <FadeIn delay={0.2}>
        <UpdateTicketForm
          ticketId={ticket.id}
          currentStatus={ticket.status}
          currentResolution={ticket.resolution ?? ""}
        />
      </FadeIn>
    </main>
  );
}
