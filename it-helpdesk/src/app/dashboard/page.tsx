import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, TicketStatus } from "@/generated/prisma/client";
import TicketStatusBars from "./TicketStatusBars";

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
      <div>
        <h1 className="text-2xl font-semibold">แดชบอร์ด</h1>
        <p className="text-sm text-zinc-500">IT Helpdesk & Asset Management</p>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <p>
          <span className="text-zinc-500">ชื่อ: </span>
          {user?.name}
        </p>
        <p>
          <span className="text-zinc-500">อีเมล: </span>
          {user?.email}
        </p>
        <p>
          <span className="text-zinc-500">สิทธิ์: </span>
          {user?.role ? ROLE_LABEL[user.role] : "-"}
        </p>
      </div>

      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium">
            {isStaffOrAdmin ? "สรุป Ticket ทั้งระบบ" : "สรุป Ticket ของฉัน"}
          </h2>
          <span className="whitespace-nowrap text-xs text-zinc-500">
            ทั้งหมด {totalTickets} รายการ
          </span>
        </div>
        <TicketStatusBars counts={statusCounts} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/tickets"
          className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          ตั๋วของฉัน
        </Link>
        <Link
          href="/tickets/new"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          แจ้งปัญหาใหม่
        </Link>
        <Link
          href="/assets"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          ยืม-คืนทรัพย์สิน
        </Link>
        <Link
          href="/chatbot"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          ถาม-ตอบ IT (AI)
        </Link>
        {isStaffOrAdmin && (
          <Link
            href="/staff/tickets"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
          >
            Ticket ทั้งหมด (Staff)
          </Link>
        )}
        {user?.role === "ADMIN" && (
          <>
            <Link
              href="/admin/assets"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              จัดการทรัพย์สิน
            </Link>
            <Link
              href="/admin/users"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              จัดการสิทธิ์ผู้ใช้
            </Link>
            <Link
              href="/admin/faq"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
            >
              จัดการฐานความรู้ FAQ
            </Link>
          </>
        )}
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700"
        >
          ออกจากระบบ
        </button>
      </form>
    </main>
  );
}
