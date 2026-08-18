import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, TicketStatus } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import SearchFilterBar from "@/components/SearchFilterBar";
import Pagination from "@/components/Pagination";

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

const PAGE_SIZE = 10;

export default async function TicketsPage(props: PageProps<"/tickets">) {
  const session = await auth();

  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.TicketWhereInput = {
    createdById: session!.user.id,
    ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    ...(status && Object.values(TicketStatus).includes(status as TicketStatus)
      ? { status: status as TicketStatus }
      : {}),
  };

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.ticket.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = q !== "" || status !== "";

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">ตั๋วของฉัน</h1>
          <p className="text-sm text-muted">ทั้งหมด {total} รายการ</p>
        </div>
        <Link
          href="/tickets/new"
          className="whitespace-nowrap rounded-full bg-gold px-4 py-2 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
        >
          แจ้งปัญหาใหม่
        </Link>
      </FadeIn>

      <Suspense fallback={null}>
        <SearchFilterBar
          searchPlaceholder="ค้นหาหัวข้อ..."
          filters={[
            {
              param: "status",
              label: "สถานะ",
              options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
      </Suspense>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Mascot variant="ticket" className="h-20 w-20" />
          <p className="text-sm text-muted">
            {isFiltered ? "ไม่พบรายการที่ตรงกับการค้นหา" : "ยังไม่มีรายการแจ้งปัญหา"}
          </p>
        </div>
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

      <Suspense fallback={null}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
