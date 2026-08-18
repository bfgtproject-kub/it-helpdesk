import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import ToastOnParam from "@/components/ToastOnParam";

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
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <Mascot variant="ticket" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />
      <Suspense fallback={null}>
        <ToastOnParam param="created" message="แจ้งปัญหาสำเร็จ" />
      </Suspense>

      <FadeIn>
        <Link href="/tickets" className="text-sm text-muted underline">
          &larr; ตั๋วของฉัน
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground">{ticket.title}</h1>
      </FadeIn>

      <FadeIn delay={0.05} className="flex gap-3 text-sm">
        <span className="rounded-full bg-gold-wash px-3 py-1 text-foreground">
          สถานะ: {STATUS_LABEL[ticket.status]}
        </span>
        <span className="rounded-full bg-gold-wash px-3 py-1 text-foreground">
          ความรุนแรง: {SEVERITY_LABEL[ticket.severity]}
        </span>
        {ticket.category && (
          <span className="rounded-full bg-gold-wash px-3 py-1 text-foreground">
            หมวดหมู่: {ticket.category.name}
          </span>
        )}
      </FadeIn>

      <FadeIn delay={0.1}>
        <p className="whitespace-pre-wrap text-sm text-foreground">{ticket.description}</p>

        {ticket.resolution && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm dark:border-green-900 dark:bg-green-950">
            <p className="font-medium text-green-700 dark:text-green-400">
              วิธีแก้ไข
            </p>
            <p className="mt-1 whitespace-pre-wrap">{ticket.resolution}</p>
          </div>
        )}

        <p className="mt-4 text-xs text-muted">
          แจ้งเมื่อ {ticket.createdAt.toLocaleString("th-TH")}
        </p>
      </FadeIn>
    </main>
  );
}
