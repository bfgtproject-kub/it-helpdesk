"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import Link from "next/link";
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
        <span className="text-zinc-500">รูปป้ายรหัสครุภัณฑ์</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- local blob preview, no optimization needed
        <img
          src={previewUrl}
          alt="ตัวอย่างรูปที่เลือก"
          className="max-h-64 w-full rounded-md border border-zinc-200 object-contain dark:border-zinc-800"
        />
      )}

      <button
        type="button"
        onClick={handleScan}
        disabled={!file || pending}
        className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {pending ? "กำลังอ่านป้าย..." : "สแกนป้าย"}
      </button>

      {result && "error" in result && (
        <p className="text-sm text-red-600">{result.error}</p>
      )}

      {result && !("error" in result) && (
        <div className="flex flex-col gap-2 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          {result.extractedTag ? (
            <p>
              <span className="text-zinc-500">อ่านได้: </span>
              {result.extractedTag}
            </p>
          ) : (
            <p className="text-zinc-500">อ่านรหัสครุภัณฑ์จากรูปนี้ไม่ได้ ลองถ่ายใหม่ให้ชัดขึ้น</p>
          )}

          {result.matchedAsset ? (
            <p>
              พบในระบบ: {result.matchedAsset.name} ({result.matchedAsset.assetTag}){" "}
              <Link
                href={`/admin/assets/${result.matchedAsset.id}/edit`}
                className="underline"
              >
                ไปที่รายการ
              </Link>
            </p>
          ) : (
            result.extractedTag && (
              <p className="text-zinc-500">
                ไม่พบทรัพย์สินที่ตรงกับรหัสนี้ในระบบ —{" "}
                <Link href="/admin/assets/new" className="underline">
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
