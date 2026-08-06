import { notFound, redirect } from "next/navigation";
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

export default async function TicketDetailPage(
  props: PageProps<"/tickets/[id]">
) {
  const { id } = await props.params;
  const session = await auth();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!ticket) notFound();
  if (ticket.createdById !== session?.user.id) redirect("/tickets");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <div>
        <Link href="/tickets" className="text-sm text-zinc-500 underline">
          &larr; ตั๋วของฉัน
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{ticket.title}</h1>
      </div>

      <div className="flex gap-3 text-sm">
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          สถานะ: {STATUS_LABEL[ticket.status]}
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
          ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}
        </span>
        {ticket.category && (
          <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
            หมวดหมู่: {ticket.category.name}
          </span>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm">{ticket.description}</p>

      {ticket.resolution && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-950">
          <p className="font-medium text-green-700 dark:text-green-400">
            วิธีแก้ไข
          </p>
          <p className="mt-1 whitespace-pre-wrap">{ticket.resolution}</p>
        </div>
      )}

      <p className="text-xs text-zinc-400">
        แจ้งเมื่อ {ticket.createdAt.toLocaleString("th-TH")}
      </p>
    </main>
  );
}
