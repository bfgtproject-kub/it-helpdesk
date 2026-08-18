type StatusCount = {
  status: string;
  label: string;
  count: number;
  barClass: string;
};

export default function TicketStatusBars({ counts }: { counts: StatusCount[] }) {
  const max = Math.max(...counts.map((c) => c.count), 0);

  if (max === 0) {
    return <p className="text-sm text-muted">ยังไม่มีข้อมูล ticket</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {counts.map((c) => {
        const widthPct = c.count === 0 ? 0 : Math.max((c.count / max) * 100, 6);
        return (
          <div key={c.status} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted">{c.label}</span>
            {/* Recessed track so the bars read as sitting inside the surface. */}
            <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-background shadow-neu-inset">
              <div
                className={`h-5 rounded-full ${c.barClass}`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
              {c.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
