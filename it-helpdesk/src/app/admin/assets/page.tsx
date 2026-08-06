import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "พร้อมใช้งาน",
  LOANED: "ถูกยืม",
  MAINTENANCE: "ซ่อมบำรุง",
  RETIRED: "ปลดระวาง",
};

export default async function AdminAssetsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const assets = await prisma.asset.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">จัดการทรัพย์สิน</h1>
          <p className="text-sm text-zinc-500">ทั้งหมด {assets.length} รายการ</p>
        </div>
        <Link
          href="/admin/assets/new"
          className="whitespace-nowrap rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          เพิ่มทรัพย์สิน
        </Link>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-zinc-500">ยังไม่มีทรัพย์สินในระบบ</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {assets.map((asset) => (
            <li key={asset.id}>
              <Link
                href={`/admin/assets/${asset.id}/edit`}
                className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-sm hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium">{asset.name}</span>
                <span className="text-zinc-500">รหัสครุภัณฑ์: {asset.assetTag}</span>
                <span className="text-zinc-500">สถานะ: {STATUS_LABEL[asset.status]}</span>
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
