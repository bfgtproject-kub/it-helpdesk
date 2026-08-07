import { redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, ScanLine, Plus, Package } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import AssetStatusBadge from "@/components/AssetStatusBadge";

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
      <FadeIn className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
            <Boxes className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">จัดการทรัพย์สิน</h1>
            <p className="text-sm text-muted">ทั้งหมด {assets.length} รายการ</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Link
            href="/admin/assets/ocr"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/40 px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-gold-wash"
          >
            <ScanLine className="h-4 w-4" aria-hidden="true" />
            สแกนป้ายเก่า (AI)
          </Link>
          <Link
            href="/admin/assets/new"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white shadow-sm transition-[filter] duration-150 hover:brightness-110"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            เพิ่มทรัพย์สิน
          </Link>
        </div>
      </FadeIn>

      {assets.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีทรัพย์สินในระบบ</p>
      ) : (
        <FadeIn delay={0.05}>
          <ul className="flex flex-col gap-3">
            {assets.map((asset) => (
              <li key={asset.id}>
                <Link
                  href={`/admin/assets/${asset.id}/edit`}
                  className="flex items-center gap-3 rounded-lg border border-gold/25 bg-card p-4 text-sm transition-colors duration-150 hover:border-gold/50 hover:bg-gold-wash/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                    <Package className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-medium text-foreground">{asset.name}</span>
                    <span className="text-muted">รหัสครุภัณฑ์: {asset.assetTag}</span>
                  </div>
                  <AssetStatusBadge status={asset.status} label={STATUS_LABEL[asset.status]} />
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
