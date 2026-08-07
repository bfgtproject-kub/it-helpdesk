import { CheckCircle2, Clock, Wrench, Archive, type LucideIcon } from "lucide-react";
import type { AssetStatus } from "@/generated/prisma/client";

const STATUS_STYLE: Record<AssetStatus, { icon: LucideIcon; className: string }> = {
  AVAILABLE: { icon: CheckCircle2, className: "bg-green-50 text-green-700" },
  LOANED: { icon: Clock, className: "bg-blue-50 text-blue-700" },
  MAINTENANCE: { icon: Wrench, className: "bg-orange-50 text-orange-700" },
  RETIRED: { icon: Archive, className: "bg-gold-wash text-muted" },
};

export default function AssetStatusBadge({
  status,
  label,
}: {
  status: AssetStatus;
  label: string;
}) {
  const { icon: Icon, className } = STATUS_STYLE[status];
  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
