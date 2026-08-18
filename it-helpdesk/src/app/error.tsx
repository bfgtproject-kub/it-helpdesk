"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-wash text-gold-deep">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-serif text-xl font-semibold text-foreground">เกิดข้อผิดพลาดบางอย่าง</h1>
        <p className="mt-1 text-sm text-muted">ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง หรือกลับไปหน้าแรก</p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold-deep px-4 py-2 text-sm font-medium text-white transition-[filter] duration-150 hover:brightness-110"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          ลองอีกครั้ง
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-gold/25 px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-gold-wash"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
