import Link from "next/link";
import {
  Ticket as TicketIcon,
  BarChart3,
  Plus,
  Boxes,
  Bot,
  ClipboardList,
  Archive,
  ShieldCheck,
  BookOpen,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, TicketStatus } from "@/generated/prisma/client";
import TicketStatusBars from "./TicketStatusBars";
import TrendSummaryButton from "./TrendSummaryButton";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import UserAvatar from "@/components/UserAvatar";

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

function ActionTile({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-start gap-2.5 rounded-2xl border border-gold/25 bg-card p-4 transition-colors duration-150 hover:border-gold/50 hover:bg-gold-wash/50"
    >
      <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </Link>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;
  const isStaffOrAdmin = user?.role === Role.IT_STAFF || user?.role === Role.ADMIN;
  const isAdmin = user?.role === Role.ADMIN;

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
    <>
      <Mascot variant="ai" className="pointer-events-none fixed bottom-4 right-4 z-0 hidden h-16 w-16 sm:block" />
      <main id="main-content" tabIndex={-1} className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">
            IT Helpdesk &amp; Asset Management
          </p>
          <h1 className="mt-1 text-balance font-serif text-4xl font-semibold tracking-tight text-foreground">
            แดชบอร์ด
          </h1>
        </FadeIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <FadeIn
            delay={0.05}
            className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-card p-6 shadow-[0_1px_2px_rgba(176,141,87,0.06),0_10px_28px_-14px_rgba(176,141,87,0.35)] sm:col-span-4"
          >
            <UserAvatar name={user?.name ?? "?"} image={user?.image} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">{user?.name}</p>
              <p className="truncate text-sm text-muted">{user?.email}</p>
              <span className="mt-1.5 inline-block rounded-full bg-gold-wash px-2.5 py-0.5 text-xs font-medium text-gold-deep">
                {user?.role ? ROLE_LABEL[user.role] : "-"}
              </span>
            </div>
            <Link
              href="/settings"
              aria-label="ตั้งค่าบัญชี"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-gold-wash hover:text-gold-deep"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </Link>
          </FadeIn>

          <FadeIn
            delay={0.1}
            className="flex flex-col justify-between gap-6 rounded-2xl bg-gold-deep p-6 text-white shadow-[0_12px_28px_-10px_rgba(124,98,57,0.55)] sm:col-span-2"
          >
            <TicketIcon className="h-6 w-6 text-white/80" aria-hidden="true" />
            <div>
              <p className="font-serif text-4xl font-semibold tabular-nums">{totalTickets}</p>
              <p className="text-xs text-white/80">
                {isStaffOrAdmin ? "Ticket ทั้งระบบ" : "Ticket ของฉัน"}
              </p>
            </div>
          </FadeIn>

          <FadeIn
            delay={0.15}
            className="rounded-2xl border border-gold/25 bg-card p-6 sm:col-span-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gold" aria-hidden="true" />
              <h2 className="text-base font-semibold text-foreground">
                {isStaffOrAdmin ? "สรุป Ticket ทั้งระบบ" : "สรุป Ticket ของฉัน"}
              </h2>
            </div>
            <TicketStatusBars counts={statusCounts} />
            {isStaffOrAdmin && <TrendSummaryButton />}
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            เมนูลัด
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Link
              href="/tickets/new"
              className="col-span-2 flex items-center gap-3 rounded-2xl bg-gold-deep p-5 text-white shadow-[0_14px_34px_-12px_rgba(124,98,57,0.55)] transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Plus className="h-6 w-6 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">แจ้งปัญหาใหม่</p>
                <p className="text-xs text-white/80">รายงานปัญหา IT ที่พบ</p>
              </div>
            </Link>

            <ActionTile href="/tickets" icon={TicketIcon} label="ตั๋วของฉัน" />
            <ActionTile href="/assets" icon={Boxes} label="ยืม-คืนทรัพย์สิน" />
            <ActionTile href="/chatbot" icon={Bot} label="ถาม-ตอบ IT (AI)" />
            {isStaffOrAdmin && (
              <ActionTile href="/staff/tickets" icon={ClipboardList} label="Ticket ทั้งหมด" />
            )}
            {isAdmin && (
              <>
                <ActionTile href="/admin/assets" icon={Archive} label="จัดการทรัพย์สิน" />
                <ActionTile href="/admin/users" icon={ShieldCheck} label="จัดการสิทธิ์ผู้ใช้" />
                <ActionTile href="/admin/faq" icon={BookOpen} label="จัดการฐานความรู้ FAQ" />
              </>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-150 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              ออกจากระบบ
            </button>
          </form>
        </FadeIn>
      </main>
    </>
  );
}
