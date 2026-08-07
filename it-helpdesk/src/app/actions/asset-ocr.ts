"use server";

import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { auth } from "@/auth";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const SUPPORTED_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;
type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number];

const OcrSchema = z.object({
  tagFound: z.boolean(),
  tag: z.string().nullable(),
});

export type OcrResult =
  | { error: string }
  | {
      extractedTag: string | null;
      matchedAsset: { id: string; assetTag: string; name: string } | null;
    };

export async function scanAssetLabel(formData: FormData): Promise<OcrResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.ADMIN) {
    return { error: "ไม่มีสิทธิ์ใช้งานฟีเจอร์นี้" };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "กรุณาเลือกไฟล์รูปภาพ" };
  }
  if (!SUPPORTED_MEDIA_TYPES.includes(file.type as SupportedMediaType)) {
    return { error: "รองรับเฉพาะไฟล์ JPEG, PNG, GIF หรือ WebP" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "ไฟล์ใหญ่เกินไป (ไม่เกิน 5MB)" };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "ระบบ AI ไม่พร้อมใช้งานตอนนี้ กรุณากรอกรหัสครุภัณฑ์ด้วยตนเองแทน" };
  }

  const mediaType = file.type as SupportedMediaType;
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  try {
    const response = await anthropic.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      output_config: { format: zodOutputFormat(OcrSchema) },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: "อ่านรหัสครุภัณฑ์ (asset tag) ที่พิมพ์อยู่บนป้ายในรูปนี้ ตอบเฉพาะรหัสที่เห็นจริงบนป้ายเท่านั้น ห้ามเดา ถ้าไม่เห็นป้ายหรืออ่านตัวอักษรไม่ออก ให้ตอบ tagFound เป็น false",
            },
          ],
        },
      ],
    });

    const parsed = response.parsed_output;
    if (!parsed || !parsed.tagFound || !parsed.tag?.trim()) {
      return { extractedTag: null, matchedAsset: null };
    }

    const extractedTag = parsed.tag.trim();

    const matchedAsset =
      (await prisma.asset.findFirst({
        where: { assetTag: { equals: extractedTag, mode: "insensitive" } },
        select: { id: true, assetTag: true, name: true },
      })) ??
      (await prisma.asset.findFirst({
        where: { assetTag: { contains: extractedTag, mode: "insensitive" } },
        select: { id: true, assetTag: true, name: true },
      }));

    return { extractedTag, matchedAsset };
  } catch (err) {
    console.error("Asset OCR error:", err);
    return { error: "ระบบ AI ขัดข้องชั่วคราว กรุณาลองใหม่ หรือกรอกรหัสครุภัณฑ์ด้วยตนเอง" };
  }
}
