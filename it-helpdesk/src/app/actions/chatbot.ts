"use server";

import { auth } from "@/auth";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";

export type ChatbotResult = { answer: string } | { error: string };

// Simple RAG: the knowledge base is small (a student-project FAQ list), so
// "retrieval" is just fetching the whole table (bounded) instead of running
// vector search — cheap and avoids Thai-tokenization edge cases.
const MAX_FAQ_ENTRIES = 20;

export async function askChatbot(question: string): Promise<ChatbotResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: "กรุณาเข้าสู่ระบบก่อน" };
  }

  const trimmed = question.trim();
  if (!trimmed) {
    return { error: "กรุณาพิมพ์คำถาม" };
  }
  if (trimmed.length > 500) {
    return { error: "คำถามยาวเกินไป กรุณาพิมพ์ให้สั้นลง" };
  }

  const faqs = await prisma.faqEntry.findMany({
    orderBy: { createdAt: "asc" },
    take: MAX_FAQ_ENTRIES,
  });

  if (faqs.length === 0) {
    return {
      answer:
        "ยังไม่มีข้อมูลในฐานความรู้ตอนนี้ครับ กรุณาแจ้งปัญหาเป็น ticket แทน จะมีเจ้าหน้าที่ดูแลให้",
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      error: "ระบบ AI ไม่พร้อมใช้งานตอนนี้ กรุณาแจ้งปัญหาเป็น ticket แทน",
    };
  }

  const knowledgeBase = faqs
    .map((f, i) => `[${i + 1}] คำถาม: ${f.question}\nคำตอบ: ${f.answer}`)
    .join("\n\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: `คุณเป็นผู้ช่วยตอบคำถามพนักงานเกี่ยวกับปัญหา IT ภายในองค์กร โดยอ้างอิงจากฐานความรู้ด้านล่างเท่านั้น

ฐานความรู้:
${knowledgeBase}

กติกา:
- ตอบโดยอ้างอิงจากฐานความรู้ข้างต้นเท่านั้น ห้ามเดาหรือตอบจากความรู้ทั่วไปที่อยู่นอกฐานความรู้
- ถ้าไม่มีข้อมูลที่เกี่ยวข้องในฐานความรู้ ให้ตอบตรงๆ ว่าไม่พบข้อมูล และแนะนำให้แจ้งปัญหาเป็น ticket แทน
- ตอบสั้น กระชับ เข้าใจง่าย เป็นภาษาไทย
- ตอบเป็นข้อความธรรมดาเท่านั้น ห้ามใช้ markdown เช่น ** หรือ # หรือสัญลักษณ์หัวข้อ (ระบบแสดงผลข้อความดิบ ไม่รองรับการจัดรูปแบบ)`,
      messages: [{ role: "user", content: trimmed }],
    });

    let answer = "";
    for (const block of response.content) {
      if (block.type === "text") {
        answer += block.text;
      }
    }

    if (!answer) {
      return {
        error: "ระบบ AI ตอบไม่ได้ในขณะนี้ กรุณาลองใหม่ หรือแจ้งปัญหาเป็น ticket แทน",
      };
    }

    return { answer };
  } catch (err) {
    console.error("Chatbot error:", err);
    return {
      error: "ระบบ AI ขัดข้องชั่วคราว กรุณาลองใหม่ หรือแจ้งปัญหาเป็น ticket แทน",
    };
  }
}
