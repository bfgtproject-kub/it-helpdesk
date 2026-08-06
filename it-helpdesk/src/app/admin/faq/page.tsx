import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

export default async function AdminFaqPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const faqs = await prisma.faqEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">จัดการฐานความรู้ (FAQ)</h1>
          <p className="text-sm text-zinc-500">
            AI Chatbot จะตอบคำถามโดยอ้างอิงจากรายการนี้เท่านั้น ({faqs.length} รายการ)
          </p>
        </div>
        <Link
          href="/admin/faq/new"
          className="whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          เพิ่มคำถาม
        </Link>
      </div>

      {faqs.length === 0 ? (
        <p className="text-sm text-zinc-500">ยังไม่มีข้อมูลในฐานความรู้</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <li key={faq.id}>
              <Link
                href={`/admin/faq/${faq.id}/edit`}
                className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium">{faq.question}</span>
                <span className="text-zinc-500 line-clamp-2">{faq.answer}</span>
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
