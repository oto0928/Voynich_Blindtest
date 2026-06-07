interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  lineIndex?: number;
}

export function ProgressBar({
  current,
  total,
  label,
  lineIndex,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="card-padded space-y-3">
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span className="font-semibold text-stone-800">
          {label ?? "進捗"}
        </span>
        <span className="text-stone-600">
          {lineIndex !== undefined && (
            <span className="font-medium text-primary mr-2">
              現在 {lineIndex + 1} 行目
            </span>
          )}
          {current} / {total} 行完了（{pct}%）
        </span>
      </div>
      <div
        className="h-3 w-full rounded-full bg-stone-200 overflow-hidden border border-stone-300"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
