import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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

export default async function TicketsPage() {
  const session = await auth();
  const tickets = await prisma.ticket.findMany({
    where: { createdById: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">ตั๋วของฉัน</h1>
          <p className="text-sm text-muted">รายการแจ้งปัญหาที่คุณส่งเข้ามา</p>
        </div>
        <Link
          href="/tickets/new"
          className="whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
        >
          แจ้งปัญหาใหม่
        </Link>
      </FadeIn>

      {tickets.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีรายการแจ้งปัญหา</p>
      ) : (
        <FadeIn delay={0.05}>
          <ul className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-gold/25 bg-card p-4 text-sm transition-colors duration-150 hover:border-gold/50"
                >
                  <span className="font-medium text-foreground">{ticket.title}</span>
                  <span className="flex flex-wrap gap-3 text-muted">
                    <span>สถานะ: {STATUS_LABEL[ticket.status]}</span>
                    <span>ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}</span>
                    {ticket.category && <span>หมวดหมู่: {ticket.category.name}</span>}
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
