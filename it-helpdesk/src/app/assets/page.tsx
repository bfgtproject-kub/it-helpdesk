import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AssetStatus, LoanStatus, Role } from "@/generated/prisma/client";
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
      <div>
        <h1 className="text-2xl font-semibold">ยืม-คืนทรัพย์สิน</h1>
        <p className="text-sm text-zinc-500">
          เลือกทรัพย์สินที่ต้องการยืมจากรายการด้านล่าง
        </p>
      </div>

      {assets.length === 0 ? (
        <p className="text-sm text-zinc-500">ยังไม่มีทรัพย์สินในระบบ</p>
      ) : (
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
                className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800"
              >
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-zinc-500">รหัสครุภัณฑ์: {asset.assetTag}</p>
                  <p className="text-zinc-500">
                    สถานะ: {STATUS_LABEL[asset.status]}
                    {activeLoan &&
                      ` — ยืมโดย ${isMine ? "คุณ" : activeLoan.borrower.name}`}
                  </p>
                </div>

                {asset.status === AssetStatus.AVAILABLE && (
                  <BorrowButton assetId={asset.id} />
                )}
                {canReturn && <ReturnButton loanId={activeLoan.id} />}
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/dashboard" className="text-sm text-zinc-500 underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
