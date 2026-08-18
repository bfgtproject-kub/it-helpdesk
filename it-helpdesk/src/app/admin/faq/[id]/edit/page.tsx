import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import FaqEditForm from "../../FaqEditForm";

export default async function EditFaqPage(
  props: PageProps<"/admin/faq/[id]/edit">
) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await props.params;
  const faq = await prisma.faqEntry.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 px-4">
      <Mascot variant="faq" className="pointer-events-none fixed bottom-4 right-4 hidden h-16 w-16 sm:block sm:bottom-6 sm:right-6" />

      <FadeIn>
        <Link href="/admin/faq" className="text-sm text-muted underline">
          &larr; ฐานความรู้ทั้งหมด
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground">แก้ไขคำถาม</h1>
      </FadeIn>

      <FadeIn delay={0.05}>
        <FaqEditForm
          faqId={faq.id}
          currentQuestion={faq.question}
          currentAnswer={faq.answer}
        />
      </FadeIn>
    </main>
  );
}
