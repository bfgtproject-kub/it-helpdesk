import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import AssetEditForm from "../../AssetEditForm";

export default async function EditAssetPage(
  props: PageProps<"/admin/assets/[id]/edit">
) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const { id } = await props.params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) notFound();

  // QR encodes the assetTag itself (not a URL) — same identifier the OCR
  // feature will later read off old paper labels, so both paths resolve
  // to the same "look up asset by tag" lookup.
  const qrDataUrl = await QRCode.toDataURL(asset.assetTag, {
    margin: 1,
    width: 200,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4 py-12">
      <div>
        <Link href="/admin/assets" className="text-sm text-zinc-500 underline">
          &larr; ทรัพย์สินทั้งหมด
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{asset.name}</h1>
        <p className="text-sm text-zinc-500">รหัสครุภัณฑ์: {asset.assetTag}</p>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URI, next/image can't optimize it anyway */}
        <img
          src={qrDataUrl}
          alt={`QR code สำหรับรหัสครุภัณฑ์ ${asset.assetTag}`}
          width={200}
          height={200}
        />
        <p className="text-xs text-zinc-500">
          สแกนเพื่อดึงรหัสครุภัณฑ์ {asset.assetTag} — ใช้ติดฉลากทรัพย์สินได้เลย
        </p>
        <a
          href={qrDataUrl}
          download={`qr-${asset.assetTag}.png`}
          className="text-xs text-zinc-500 underline"
        >
          ดาวน์โหลด QR
        </a>
      </div>

      <AssetEditForm
        assetId={asset.id}
        currentName={asset.name}
        currentStatus={asset.status}
        currentPurchaseDate={
          asset.purchaseDate ? asset.purchaseDate.toISOString().slice(0, 10) : ""
        }
      />
    </main>
  );
}
