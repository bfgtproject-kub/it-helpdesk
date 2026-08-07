"use server";

import { auth } from "@/auth";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

export type TrendSummaryResult = { summary: string } | { error: string };

const MAX_TICKETS_FOR_SUMMARY = 500;

const SYSTEM_PROMPT = `คุณเป็นผู้ช่วยวิเคราะห์ข้อมูล ticket แจ้งปัญหา IT ภายในองค์กร จากสถิติที่ให้มา ให้เขียนสรุป insight สั้นๆ 2-4 ประโยค เป็นภาษาไทย เน้นแนวโน้มที่น่าสนใจหรือควรระวัง เช่น หมวดหมู่ไหนเกิดปัญหาบ่อยที่สุด เดือนไหนมีปัญหาเพิ่มขึ้นผิดปกติ หรือสัดส่วนความรุนแรงที่ควรจับตา
ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามใช้ markdown เช่น ** หรือ # หรือสัญลักษณ์หัวข้อ`;

export async function generateTrendSummary(): Promise<TrendSummaryResult> {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== Role.IT_STAFF && session.user.role !== Role.ADMIN)
  ) {
    return { error: "ไม่มีสิทธิ์ใช้งานฟีเจอร์นี้" };
  }

  const tickets = await prisma.ticket.findMany({
    take: MAX_TICKETS_FOR_SUMMARY,
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      severity: true,
      category: { select: { name: true } },
    },
  });

  if (tickets.length === 0) {
    return { summary: "ยังไม่มีข้อมูล ticket ในระบบมากพอสำหรับสรุปแนวโน้ม" };
  }

  const byCategory = new Map<string, number>();
  const byMonth = new Map<string, number>();
  const bySeverity = new Map<string, number>();

  for (const t of tickets) {
    const category = t.category?.name ?? "ไม่ระบุหมวดหมู่";
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);

    const month = t.createdAt.toISOString().slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + 1);

    bySeverity.set(t.severity, (bySeverity.get(t.severity) ?? 0) + 1);
  }

  const statsText = [
    `จำนวน ticket ทั้งหมด: ${tickets.length}`,
    `แยกตามหมวดหมู่: ${[...byCategory.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`,
    `แยกตามเดือน: ${[...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join(", ")}`,
    `แยกตามความรุนแรง: ${[...bySeverity.entries()].map(([k, v]) => `${k}=${v}`).join(", ")}`,
  ].join("\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: "ระบบ AI ไม่พร้อมใช้งานตอนนี้" };
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: statsText }],
    });

    let summary = "";
    for (const block of response.content) {
      if (block.type === "text") {
        summary += block.text;
      }
    }

    if (!summary) {
      return { error: "ระบบ AI ตอบไม่ได้ในขณะนี้ กรุณาลองใหม่" };
    }

    return { summary };
  } catch (err) {
    console.error("Trend summary error:", err);
    return { error: "ระบบ AI ขัดข้องชั่วคราว กรุณาลองใหม่" };
  }
}
