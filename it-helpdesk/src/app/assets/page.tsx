import Link from "next/link";
import { redirect } from "next/navigation";
import { Boxes, Package } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus, LoanStatus, Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
import AssetStatusBadge from "@/components/AssetStatusBadge";
import { BorrowButton, ReturnButton } from "./LoanButton";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "พร้อมให้ยืม",
  LOANED: "ถูกยืมอยู่",
  MAINTENANCE: "ซ่อมบำรุง",
  RETIRED: "ปลดระวาง",
};

export default async function AssetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      loans: {
        where: { status: LoanStatus.BORROWED },
        include: { borrower: { select: { id: true, name: true } } },
      },
    },
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <Boxes className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">ยืม-คืนทรัพย์สิน</h1>
          <p className="text-sm text-muted">เลือกทรัพย์สินที่ต้องการยืมจากรายการด้านล่าง</p>
        </div>
      </FadeIn>

      {assets.length === 0 ? (
        <p className="text-sm text-muted">ยังไม่มีทรัพย์สินในระบบ</p>
      ) : (
        <FadeIn delay={0.05}>
          <ul className="flex flex-col gap-3">
            {assets.map((asset) => {
              const activeLoan = asset.loans[0];
              const isMine = activeLoan?.borrower.id === session.user.id;
              const canReturn =
                activeLoan &&
                (isMine ||
                  session.user.role === Role.IT_STAFF ||
                  session.user.role === Role.ADMIN);

              return (
                <li
                  key={asset.id}
                  className="flex items-center gap-3 rounded-lg border border-gold/25 bg-card p-4 text-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                    <Package className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{asset.name}</p>
                    <p className="text-muted">รหัสครุภัณฑ์: {asset.assetTag}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <AssetStatusBadge status={asset.status} label={STATUS_LABEL[asset.status]} />
                      {activeLoan && (
                        <span className="text-xs text-muted">
                          ยืมโดย {isMine ? "คุณ" : activeLoan.borrower.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {asset.status === AssetStatus.AVAILABLE && (
                    <BorrowButton assetId={asset.id} />
                  )}
                  {canReturn && <ReturnButton loanId={activeLoan.id} />}
                </li>
              );
            })}
          </ul>
        </FadeIn>
      )}

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
