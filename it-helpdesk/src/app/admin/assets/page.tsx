import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, ScanLine, Plus, Package } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, Role, AssetStatus } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import Mascot from "@/components/Mascot";
import ToastOnParam from "@/components/ToastOnParam";
import SearchFilterBar from "@/components/SearchFilterBar";
import Pagination from "@/components/Pagination";
import AssetStatusBadge from "@/components/AssetStatusBadge";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "พร้อมใช้งาน",
  LOANED: "ถูกยืม",
  MAINTENANCE: "ซ่อมบำรุง",
  RETIRED: "ปลดระวาง",
};

const PAGE_SIZE = 10;

export default async function AdminAssetsPage(props: PageProps<"/admin/assets">) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.AssetWhereInput = {
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { assetTag: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status && Object.values(AssetStatus).includes(status as AssetStatus)
      ? { status: status as AssetStatus }
      : {}),
  };

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.asset.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = q !== "" || status !== "";

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <Suspense fallback={null}>
        <ToastOnParam param="updated" message="บันทึกทรัพย์สินสำเร็จ" />
        <ToastOnParam param="deleted" message="ลบทรัพย์สินสำเร็จ" />
      </Suspense>

      <FadeIn className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
            <Boxes className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">จัดการทรัพย์สิน</h1>
            <p className="text-sm text-muted">ทั้งหมด {total} รายการ</p>
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

      <Suspense fallback={null}>
        <SearchFilterBar
          searchPlaceholder="ค้นหาชื่อหรือรหัสครุภัณฑ์..."
          filters={[
            {
              param: "status",
              label: "สถานะ",
              options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
      </Suspense>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Mascot variant="asset" className="h-20 w-20" />
          <p className="text-sm text-muted">
            {isFiltered ? "ไม่พบรายการที่ตรงกับการค้นหา" : "ยังไม่มีทรัพย์สินในระบบ"}
          </p>
        </div>
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

      <Suspense fallback={null}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
