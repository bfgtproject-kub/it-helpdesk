"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefForPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <nav aria-label="เปลี่ยนหน้า" className="flex items-center justify-center gap-3 pt-2">
      <Link
        href={hrefForPage(page - 1)}
        aria-disabled={page <= 1}
        tabIndex={page <= 1 ? -1 : undefined}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 text-foreground transition-colors duration-150 ${
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gold-wash"
        }`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </Link>
      <span className="text-sm text-muted">
        หน้า {page} จาก {totalPages}
      </span>
      <Link
        href={hrefForPage(page + 1)}
        aria-disabled={page >= totalPages}
        tabIndex={page >= totalPages ? -1 : undefined}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-gold/25 text-foreground transition-colors duration-150 ${
          page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-gold-wash"
        }`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </nav>
  );
}
