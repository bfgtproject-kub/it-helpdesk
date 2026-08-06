import { notFound, redirect } from "next/navigation";
import Link from "next/link";
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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <Link href="/admin/assets" className="text-sm text-zinc-500 underline">
          &larr; ทรัพย์สินทั้งหมด
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{asset.name}</h1>
        <p className="text-sm text-zinc-500">รหัสครุภัณฑ์: {asset.assetTag}</p>
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
