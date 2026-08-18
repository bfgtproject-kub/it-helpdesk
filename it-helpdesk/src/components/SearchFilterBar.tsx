"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export type FilterConfig = {
  param: string;
  label: string;
  options: { value: string; label: string }[];
};

/**
 * URL-driven search + filter controls for a list page. Search text is
 * debounced before updating the URL (avoids a server round-trip per
 * keystroke); filter selects update immediately. Changing either resets
 * the `page` param back to 1 since the result set changed underneath it.
 */
export default function SearchFilterBar({
  searchPlaceholder = "ค้นหา...",
  filters = [],
}: {
  searchPlaceholder?: string;
  filters?: FilterConfig[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value }), 400);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[180px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <label className="sr-only" htmlFor="search-filter-q">
          {searchPlaceholder}
        </label>
        <input
          id="search-filter-q"
          type="text"
          value={q}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          className="w-full rounded-full border border-gold/25 bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-gold"
        />
      </div>

      {filters.map((f) => (
        <select
          key={f.param}
          value={searchParams.get(f.param) ?? ""}
          onChange={(e) => updateParams({ [f.param]: e.target.value })}
          className="rounded-full border border-gold/25 bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-gold"
        >
          <option value="">{f.label}: ทั้งหมด</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
