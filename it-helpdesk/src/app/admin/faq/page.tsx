import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, MessageCircleQuestion } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";

export default async function AdminFaqPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const faqs = await prisma.faqEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              จัดการฐานความรู้ (FAQ)
            </h1>
            <p className="text-sm text-muted">
              AI Chatbot จะตอบคำถามโดยอ้างอิงจากรายการนี้เท่านั้น ({faqs.length} รายการ)
            </p>
          </div>
        </div>
        <Link
          href="/admin/faq/new"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          เพิ่มคำถาม
        </Link>
      </FadeIn>

      {faqs.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีข้อมูลในฐานความรู้</p>
      ) : (
        <FadeIn delay={0.05}>
          <ul className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <Link
                  href={`/admin/faq/${faq.id}/edit`}
                  className="flex items-start gap-3 rounded-lg border border-gold/25 bg-card p-4 text-sm transition-colors duration-150 hover:border-gold/50"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                    <MessageCircleQuestion className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{faq.question}</p>
                    <p className="line-clamp-2 text-muted">{faq.answer}</p>
                  </div>
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
