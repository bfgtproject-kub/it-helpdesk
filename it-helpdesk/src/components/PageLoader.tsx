import { Loader2 } from "lucide-react";

export default function PageLoader({
  label = "กำลังโหลด...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-24 text-muted">
      <Loader2 className="h-7 w-7 animate-spin text-gold-deep" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
