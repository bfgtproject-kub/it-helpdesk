import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "รอดำเนินการ",
  IN_PROGRESS: "กำลังดำเนินการ",
  RESOLVED: "แก้ไขแล้ว",
  CLOSED: "ปิดงาน",
};

const SEVERITY_LABEL: Record<string, string> = {
  PENDING_REVIEW: "รอตรวจสอบ",
  LOW: "ต่ำ",
  MEDIUM: "ปานกลาง",
  HIGH: "สูง",
};

export default async function StaffTicketsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.IT_STAFF && session.user.role !== Role.ADMIN)
  ) {
    redirect("/dashboard");
  }

  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true, email: true } },
      assignedTo: { select: { name: true } },
      category: true,
    },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-12">
      <FadeIn>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Ticket ทั้งหมด</h1>
        <p className="text-sm text-muted">
          รายการแจ้งปัญหาทั้งหมดในระบบ ({tickets.length} รายการ)
        </p>
      </FadeIn>

      {tickets.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีรายการแจ้งปัญหา</p>
      ) : (
        <FadeIn delay={0.05}>
          <ul className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/staff/tickets/${ticket.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-gold/25 bg-card p-4 text-sm transition-colors duration-150 hover:border-gold/50"
                >
                  <span className="font-medium text-foreground">{ticket.title}</span>
                  <span className="text-muted">
                    แจ้งโดย {ticket.createdBy.name} ({ticket.createdBy.email})
                  </span>
                  <span className="flex flex-wrap gap-3 text-muted">
                    <span>สถานะ: {STATUS_LABEL[ticket.status]}</span>
                    <span>ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}</span>
                    {ticket.category && <span>หมวดหมู่: {ticket.category.name}</span>}
                    <span>
                      ผู้รับผิดชอบ: {ticket.assignedTo?.name ?? "ยังไม่มีผู้รับงาน"}
                    </span>
                  </span>
                  <span className="text-xs text-muted">
                    แจ้งเมื่อ {ticket.createdAt.toLocaleString("th-TH")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeIn>
      )}

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
