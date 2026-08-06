import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">ตั๋วของฉัน</h1>
          <p className="text-sm text-zinc-500">รายการแจ้งปัญหาที่คุณส่งเข้ามา</p>
        </div>
        <Link
          href="/tickets/new"
          className="whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          แจ้งปัญหาใหม่
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-sm text-zinc-500">ยังไม่มีรายการแจ้งปัญหา</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/tickets/${ticket.id}`}
                className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium">{ticket.title}</span>
                <span className="flex gap-3 text-zinc-500">
                  <span>สถานะ: {STATUS_LABEL[ticket.status]}</span>
                  <span>ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}</span>
                </span>
                <span className="text-xs text-zinc-400">
                  แจ้งเมื่อ {ticket.createdAt.toLocaleString("th-TH")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link href="/dashboard" className="text-sm text-zinc-500 underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
