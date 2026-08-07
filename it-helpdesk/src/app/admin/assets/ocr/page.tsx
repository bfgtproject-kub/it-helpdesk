import { redirect } from "next/navigation";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import AssetOcrForm from "./AssetOcrForm";

export default async function AssetOcrPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
      <FadeIn>
        <Link href="/admin/assets" className="text-sm text-muted underline">
          &larr; ทรัพย์สินทั้งหมด
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
            <ScanLine className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            สแกนป้ายทรัพย์สินเก่า (AI)
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted">
          ถ่ายรูปหรืออัปโหลดรูปป้ายรหัสครุภัณฑ์ ระบบจะอ่านรหัสด้วย AI แล้วค้นหาในฐานข้อมูลให้
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <AssetOcrForm />
      </FadeIn>
    </main>
  );
}
