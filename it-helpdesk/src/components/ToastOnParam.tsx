"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "./ToastProvider";

/**
 * For actions that redirect() server-side on success (create/update/delete
 * flows) — there's no client code left running after a server redirect to
 * fire a toast, so the action appends `?<param>=1` to the destination URL
 * instead, and this component (dropped anywhere on that destination page)
 * shows the toast on mount and strips the param so a refresh/back-nav
 * doesn't re-show it.
 */
export default function ToastOnParam({
  param,
  message,
  kind = "success",
}: {
  param: string;
  message: string;
  kind?: "success" | "error";
}) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (searchParams.get(param) !== "1") return;
    firedRef.current = true;

    showToast(message, kind);

    const params = new URLSearchParams(searchParams);
    params.delete(param);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
