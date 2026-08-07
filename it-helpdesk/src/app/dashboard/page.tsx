import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, TicketStatus } from "@/generated/prisma/client";
import TicketStatusBars from "./TicketStatusBars";
import TrendSummaryButton from "./TrendSummaryButton";
import FadeIn from "@/components/FadeIn";

const ROLE_LABEL: Record<string, string> = {
  USER: "ผู้ใช้งานทั่วไป",
  IT_STAFF: "เจ้าหน้าที่ IT",
  ADMIN: "ผู้ดูแลระบบ",
};

const STATUS_CHART_CONFIG: {
  status: TicketStatus;
  label: string;
  barClass: string;
}[] = [
  {
    status: TicketStatus.OPEN,
    label: "รอดำเนินการ",
    barClass: "bg-[#2a78d6] dark:bg-[#3987e5]",
  },
  {
    status: TicketStatus.IN_PROGRESS,
    label: "กำลังดำเนินการ",
    barClass: "bg-[#eb6834] dark:bg-[#d95926]",
  },
  {
    status: TicketStatus.RESOLVED,
    label: "แก้ไขแล้ว",
    barClass: "bg-[#1baf7a] dark:bg-[#199e70]",
  },
  {
    status: TicketStatus.CLOSED,
    label: "ปิดงาน",
    barClass: "bg-[#eda100] dark:bg-[#c98500]",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isStaffOrAdmin = user?.role === Role.IT_STAFF || user?.role === Role.ADMIN;

  const grouped = user
    ? await prisma.ticket.groupBy({
        by: ["status"],
        where: isStaffOrAdmin ? undefined : { createdById: user.id },
        _count: true,
      })
    : [];

  const countByStatus = new Map(grouped.map((g) => [g.status, g._count]));
  const statusCounts = STATUS_CHART_CONFIG.map((c) => ({
    status: c.status,
    label: c.label,
    barClass: c.barClass,
    count: countByStatus.get(c.status) ?? 0,
  }));
  const totalTickets = statusCounts.reduce((sum, c) => sum + c.count, 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn>
        <h1 className="font-serif text-2xl font-semibold text-foreground">แดชบอร์ด</h1>
        <p className="text-sm text-muted">IT Helpdesk & Asset Management</p>
      </FadeIn>

      <FadeIn delay={0.05} className="rounded-xl border border-gold/25 bg-card p-4 text-sm">
        <p>
          <span className="text-muted">ชื่อ: </span>
          {user?.name}
        </p>
        <p>
          <span className="text-muted">อีเมล: </span>
          {user?.email}
        </p>
        <p>
          <span className="text-muted">สิทธิ์: </span>
          {user?.role ? ROLE_LABEL[user.role] : "-"}
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="rounded-xl border border-gold/25 bg-card p-4">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">
            {isStaffOrAdmin ? "สรุป Ticket ทั้งระบบ" : "สรุป Ticket ของฉัน"}
          </h2>
          <span className="whitespace-nowrap text-xs text-muted">
            ทั้งหมด {totalTickets} รายการ
          </span>
        </div>
        <TicketStatusBars counts={statusCounts} />
        {isStaffOrAdmin && <TrendSummaryButton />}
      </FadeIn>

      <FadeIn delay={0.15} className="flex flex-wrap gap-3">
        <Link
          href="/tickets"
          className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
        >
          ตั๋วของฉัน
        </Link>
        <Link
          href="/tickets/new"
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
        >
          แจ้งปัญหาใหม่
        </Link>
        <Link
          href="/assets"
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
        >
          ยืม-คืนทรัพย์สิน
        </Link>
        <Link
          href="/chatbot"
          className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
        >
          ถาม-ตอบ IT (AI)
        </Link>
        {isStaffOrAdmin && (
          <Link
            href="/staff/tickets"
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
          >
            Ticket ทั้งหมด (Staff)
          </Link>
        )}
        {user?.role === "ADMIN" && (
          <>
            <Link
              href="/admin/assets"
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
            >
              จัดการทรัพย์สิน
            </Link>
            <Link
              href="/admin/users"
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
            >
              จัดการสิทธิ์ผู้ใช้
            </Link>
            <Link
              href="/admin/faq"
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
            >
              จัดการฐานความรู้ FAQ
            </Link>
          </>
        )}
      </FadeIn>

      <FadeIn delay={0.2}>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-gold/40 px-4 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
          >
            ออกจากระบบ
          </button>
        </form>
      </FadeIn>
    </main>
  );
}
