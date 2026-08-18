"use client";

import "./globals.css";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="th">
      <body className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
          <h1 className="font-serif text-xl font-semibold">ระบบขัดข้อง</h1>
          <p className="text-sm text-muted">เกิดข้อผิดพลาดร้ายแรง กรุณาลองโหลดหน้าใหม่อีกครั้ง</p>
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-full bg-gold-deep px-4 py-2 text-sm font-medium text-white"
          >
            โหลดใหม่
          </button>
        </div>
      </body>
    </html>
  );
}
