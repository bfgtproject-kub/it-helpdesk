import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { TicketSeverity } from "@/generated/prisma/client";

export const TICKET_CATEGORIES = [
  "ฮาร์ดแวร์",
  "ซอฟต์แวร์",
  "เครือข่าย",
  "บัญชีผู้ใช้",
  "อื่นๆ",
] as const;

const ClassificationSchema = z.object({
  category: z.enum(TICKET_CATEGORIES),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

const SYSTEM_PROMPT = `คุณเป็นระบบผู้ช่วยจัดหมวดหมู่ ticket แจ้งปัญหา IT ภายในองค์กร

ความหมายของแต่ละหมวดหมู่:
- ฮาร์ดแวร์: อุปกรณ์ทางกายภาพเสียหรือไม่ทำงาน เช่น คอมพิวเตอร์ เครื่องพิมพ์ จอภาพ เมาส์ คีย์บอร์ด เปิดไม่ติด
- ซอฟต์แวร์: โปรแกรม แอปพลิเคชัน หรือระบบปฏิบัติการมีปัญหา เช่น ติดตั้งไม่ได้ ค้าง error อัปเดตไม่ได้
- เครือข่าย: อินเทอร์เน็ต Wi-Fi การเชื่อมต่อเครือข่าย VPN หลุดหรือใช้งานไม่ได้
- บัญชีผู้ใช้: การเข้าสู่ระบบ รหัสผ่าน สิทธิ์การใช้งาน บัญชีถูกล็อกหรือลืมรหัสผ่าน
- อื่นๆ: ไม่เข้าพวกข้างต้น หรือเป็นคำขอทั่วไป

จากหัวข้อและรายละเอียดปัญหาที่ผู้ใช้แจ้งเข้ามา ให้ทำสองอย่าง:
1. เลือกหมวดหมู่ที่ตรงที่สุดจากตัวเลือกที่กำหนดเท่านั้น
2. ประเมินความรุนแรงของปัญหา:
   - HIGH: งานหยุดชะงักทั้งหมด ทำงานต่อไม่ได้เลย หรือเกี่ยวกับความปลอดภัย/ข้อมูลรั่วไหล
   - MEDIUM: กระทบการทำงานบางส่วน มีทางแก้ไขชั่วคราวได้
   - LOW: ปัญหาเล็กน้อย ไม่กระทบการทำงานหลัก หรือเป็นคำขอทั่วไป`;

/**
 * Classifies a ticket via Claude and writes category/severity back to the DB.
 * Fails silently on any error — the ticket keeps its PENDING_REVIEW default
 * (see Phase 2 milestone: AI outage must never block ticket creation).
 */
export async function classifyAndUpdateTicket(
  ticketId: string,
  title: string,
  description: string
): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) return;

  try {
    const response = await anthropic.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      output_config: {
        format: zodOutputFormat(ClassificationSchema),
      },
      messages: [
        {
          role: "user",
          content: `หัวข้อ: ${title}\n\nรายละเอียด: ${description}`,
        },
      ],
    });

    const result = response.parsed_output;
    if (!result) return;

    const category = await prisma.category.upsert({
      where: { name: result.category },
      update: {},
      create: { name: result.category },
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        categoryId: category.id,
        severity: result.severity as TicketSeverity,
      },
    });
  } catch (err) {
    console.error(`AI classification failed for ticket ${ticketId}:`, err);
  }
}
