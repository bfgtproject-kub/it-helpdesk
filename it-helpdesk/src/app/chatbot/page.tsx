"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { askChatbot } from "@/app/actions/chatbot";

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
      <div>
        <h1 className="text-2xl font-semibold">ถาม-ตอบปัญหา IT (AI)</h1>
        <p className="text-sm text-zinc-500">
          ถามคำถามที่พบบ่อยได้เลย ระบบจะตอบจากฐานความรู้ที่ทีม IT เตรียมไว้
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">
            ยังไม่มีการสนทนา ลองพิมพ์คำถามด้านล่างได้เลย
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "max-w-[85%] self-end whitespace-pre-wrap rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
                : "max-w-[85%] self-start whitespace-pre-wrap rounded-md border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800"
            }
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="self-start rounded-md border border-zinc-200 px-4 py-2 text-sm text-zinc-500 dark:border-zinc-800">
            กำลังตอบ...
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์คำถาม..."
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          ส่ง
        </button>
      </form>

      <Link href="/dashboard" className="text-sm text-zinc-500 underline">
        กลับไปแดชบอร์ด
      </Link>
    </main>
  );
}
