"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { Bot, User, Send } from "lucide-react";
import { askChatbot } from "@/app/actions/chatbot";
import FadeIn from "@/components/FadeIn";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || pending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    startTransition(async () => {
      const result = await askChatbot(question);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: result.answer }]);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <FadeIn className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
          <Bot className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            ถาม-ตอบปัญหา IT (AI)
          </h1>
          <p className="text-sm text-muted">
            ถามคำถามที่พบบ่อยได้เลย ระบบจะตอบจากฐานความรู้ที่ทีม IT เตรียมไว้
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted">ยังไม่มีการสนทนา ลองพิมพ์คำถามด้านล่างได้เลย</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "flex max-w-[85%] items-end gap-2 self-end"
                : "flex max-w-[85%] items-end gap-2 self-start"
            }
          >
            {m.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
            <div
              className={
                m.role === "user"
                  ? "whitespace-pre-wrap rounded-2xl bg-gold-deep px-4 py-2 text-sm text-white"
                  : "whitespace-pre-wrap rounded-2xl border border-gold/25 bg-card px-4 py-2 text-sm text-foreground"
              }
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
                <User className="h-4 w-4" aria-hidden="true" />
              </div>
            )}
          </div>
        ))}
        {pending && (
          <div className="flex max-w-[85%] items-end gap-2 self-start">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="rounded-2xl border border-gold/25 bg-card px-4 py-2 text-sm text-muted">
              กำลังตอบ...
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถาม..."
          className="flex-1 rounded-full border border-gold/25 bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold-deep px-4 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110 disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          ส่ง
        </button>
      </form>

      <Link href="/dashboard" className="text-sm text-muted underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
