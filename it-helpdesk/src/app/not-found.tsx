import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
        <FileQuestion className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-serif text-xl font-semibold text-foreground">ไม่พบหน้านี้</h1>
        <p className="mt-1 text-sm text-muted">ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายหรือลบไปแล้ว</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-gold-deep px-4 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110"
      >
        กลับหน้าแรก
      </Link>
    </main>
  );
}
