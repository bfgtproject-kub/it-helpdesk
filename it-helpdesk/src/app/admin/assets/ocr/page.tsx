import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/client";
import AssetOcrForm from "./AssetOcrForm";

export default async function AssetOcrPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
      <div>
        <Link href="/admin/assets" className="text-sm text-zinc-500 underline">
          &larr; ทรัพย์สินทั้งหมด
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">สแกนป้ายทรัพย์สินเก่า (AI)</h1>
        <p className="text-sm text-zinc-500">
          ถ่ายรูปหรืออัปโหลดรูปป้ายรหัสครุภัณฑ์ ระบบจะอ่านรหัสด้วย AI แล้วค้นหาในฐานข้อมูลให้
        </p>
      </div>

      <AssetOcrForm />
    </main>
  );
}
