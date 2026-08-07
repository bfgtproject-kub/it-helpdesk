"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import Link from "next/link";
import { ScanLine, CheckCircle2, AlertCircle } from "lucide-react";
import { scanAssetLabel, type OcrResult } from "@/app/actions/asset-ocr";

export default function AssetOcrForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setResult(null);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  function handleScan() {
    if (!file || pending) return;
    const formData = new FormData();
    formData.set("image", file);

    startTransition(async () => {
      const res = await scanAssetLabel(formData);
      setResult(res);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">รูปป้ายรหัสครุภัณฑ์</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="rounded-lg border border-gold/25 bg-background px-3 py-2 text-sm text-foreground"
        />
      </label>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- local blob preview, no optimization needed
        <img
          src={previewUrl}
          alt="ตัวอย่างรูปที่เลือก"
          className="max-h-64 w-full rounded-lg border border-gold/25 object-contain"
        />
      )}

      <button
        type="button"
        onClick={handleScan}
        disabled={!file || pending}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold-deep px-3 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
      >
        <ScanLine className="h-4 w-4" aria-hidden="true" />
        {pending ? "กำลังอ่านป้าย..." : "สแกนป้าย"}
      </button>

      {result && "error" in result && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {result.error}
        </p>
      )}

      {result && !("error" in result) && (
        <div className="flex flex-col gap-2 rounded-lg border border-gold/25 bg-card p-4 text-sm">
          {result.extractedTag ? (
            <p>
              <span className="text-muted">อ่านได้: </span>
              {result.extractedTag}
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-muted">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              อ่านรหัสครุภัณฑ์จากรูปนี้ไม่ได้ ลองถ่ายใหม่ให้ชัดขึ้น
            </p>
          )}

          {result.matchedAsset ? (
            <p className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
              <span>
                พบในระบบ: {result.matchedAsset.name} ({result.matchedAsset.assetTag}){" "}
                <Link
                  href={`/admin/assets/${result.matchedAsset.id}/edit`}
                  className="text-gold-deep underline"
                >
                  ไปที่รายการ
                </Link>
              </span>
            </p>
          ) : (
            result.extractedTag && (
              <p className="text-muted">
                ไม่พบทรัพย์สินที่ตรงกับรหัสนี้ในระบบ —{" "}
                <Link href="/admin/assets/new" className="text-gold-deep underline">
                  เพิ่มทรัพย์สินใหม่
                </Link>
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
