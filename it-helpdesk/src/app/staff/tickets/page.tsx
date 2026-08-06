import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

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
      <div>
        <h1 className="text-2xl font-semibold">Ticket ทั้งหมด</h1>
        <p className="text-sm text-zinc-500">
          รายการแจ้งปัญหาทั้งหมดในระบบ ({tickets.length} รายการ)
        </p>
      </div>

      {tickets.length === 0 ? (
        <p className="text-sm text-zinc-500">ยังไม่มีรายการแจ้งปัญหา</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/staff/tickets/${ticket.id}`}
                className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium">{ticket.title}</span>
                <span className="text-zinc-500">
                  แจ้งโดย {ticket.createdBy.name} ({ticket.createdBy.email})
                </span>
                <span className="flex flex-wrap gap-3 text-zinc-500">
                  <span>สถานะ: {STATUS_LABEL[ticket.status]}</span>
                  <span>ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}</span>
                  {ticket.category && <span>หมวดหมู่: {ticket.category.name}</span>}
                  <span>
                    ผู้รับผิดชอบ: {ticket.assignedTo?.name ?? "ยังไม่มีผู้รับงาน"}
                  </span>
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
