import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { QrCode, Download } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import FadeIn from "@/components/FadeIn";
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
      <FadeIn>
        <Link href="/admin/assets" className="text-sm text-muted underline">
          &larr; ทรัพย์สินทั้งหมด
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-foreground">{asset.name}</h1>
        <p className="text-sm text-muted">รหัสครุภัณฑ์: {asset.assetTag}</p>
      </FadeIn>

      <FadeIn
        delay={0.05}
        className="flex flex-col items-center gap-3 rounded-2xl border border-gold/25 bg-card p-5"
      >
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-gold-deep">
          <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
          QR Code
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URI, next/image can't optimize it anyway */}
        <img
          src={qrDataUrl}
          alt={`QR code สำหรับรหัสครุภัณฑ์ ${asset.assetTag}`}
          width={200}
          height={200}
          className="rounded-lg border border-gold/20"
        />
        <p className="text-center text-xs text-muted">
          สแกนเพื่อดึงรหัสครุภัณฑ์ {asset.assetTag} — ใช้ติดฉลากทรัพย์สินได้เลย
        </p>
        <a
          href={qrDataUrl}
          download={`qr-${asset.assetTag}.png`}
          className="inline-flex items-center gap-1 text-xs text-gold-deep underline"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          ดาวน์โหลด QR
        </a>
      </FadeIn>

      <FadeIn delay={0.1}>
        <AssetEditForm
          assetId={asset.id}
          currentName={asset.name}
          currentStatus={asset.status}
          currentPurchaseDate={
            asset.purchaseDate ? asset.purchaseDate.toISOString().slice(0, 10) : ""
          }
        />
      </FadeIn>
    </main>
  );
}
