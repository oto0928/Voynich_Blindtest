import type { ChallengeLine, LineResponse, TokenTag } from "@/lib/types";

interface TokenPickerProps {
  line: ChallengeLine;
  response: LineResponse;
  activeTag: TokenTag;
  onActiveTagChange: (tag: TokenTag) => void;
  onUpdate: (response: LineResponse) => void;
}

const TAGS: { id: TokenTag; label: string; activeClass: string; chipClass: string }[] = [
  {
    id: "source",
    label: "原料",
    activeClass: "border-amber-500 bg-amber-100 text-amber-900",
    chipClass: "bg-amber-100 border-amber-400 text-amber-900",
  },
  {
    id: "process",
    label: "処理",
    activeClass: "border-sky-500 bg-sky-100 text-sky-900",
    chipClass: "bg-sky-100 border-sky-400 text-sky-900",
  },
  {
    id: "product",
    label: "製品",
    activeClass: "border-emerald-500 bg-emerald-100 text-emerald-900",
    chipClass: "bg-emerald-100 border-emerald-400 text-emerald-900",
  },
];

function tokenClass(pos: number, response: LineResponse): string {
  const base =
    "inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-2.5 py-1.5 rounded-[var(--radius-button)] border-2 font-mono-transcription text-sm cursor-pointer select-none transition-all";

  if (response.source_token_positions.includes(pos))
    return `${base} bg-amber-100 border-amber-400 text-amber-900 font-semibold`;
  if (response.process_token_positions.includes(pos))
    return `${base} bg-sky-100 border-sky-400 text-sky-900 font-semibold`;
  if (response.product_token_positions.includes(pos))
    return `${base} bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold`;
  return `${base} bg-white border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50`;
}

function togglePos(list: number[], pos: number): number[] {
  return list.includes(pos)
    ? list.filter((p) => p !== pos)
    : [...list, pos].sort((a, b) => a - b);
}

export function TokenPicker({
  line,
  response,
  activeTag,
  onActiveTagChange,
  onUpdate,
}: TokenPickerProps) {
  const handleTokenClick = (pos: number) => {
    if (!activeTag) return;
    const key =
      activeTag === "source"
        ? "source_token_positions"
        : activeTag === "process"
          ? "process_token_positions"
          : "product_token_positions";
    let next = { ...response };
    for (const t of ["source", "process", "product"] as const) {
      if (t === activeTag) continue;
      const k =
        t === "source"
          ? "source_token_positions"
          : t === "process"
            ? "process_token_positions"
            : "product_token_positions";
      next = {
        ...next,
        [k]: (next[k] as number[]).filter((p) => p !== pos),
      };
    }
    next = {
      ...next,
      [key]: togglePos(next[key as keyof LineResponse] as number[], pos),
    };
    onUpdate(next);
  };

  return (
    <div className="space-y-4 border-2 border-dashed border-stone-300 rounded-[var(--radius-card)] p-4 md:p-5 bg-stone-50">
      <div>
        <p className="label-text">語の分類（任意）</p>
        <p className="hint-text mt-1">
          原料・処理・製品に該当する語があればタップしてください
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TAGS.map(({ id, label, activeClass }) => (
          <button
            key={id ?? "none"}
            type="button"
            onClick={() => onActiveTagChange(activeTag === id ? null : id)}
            className={`min-h-[44px] px-4 py-2 rounded-[var(--radius-button)] border-2 text-sm font-semibold transition-all ${
              activeTag === id
                ? activeClass
                : "bg-white border-stone-200 text-stone-700 hover:border-stone-400"
            }`}
          >
            {label}を選ぶ
          </button>
        ))}
        {activeTag && (
          <button
            type="button"
            onClick={() => onActiveTagChange(null)}
            className="min-h-[44px] px-4 py-2 rounded-[var(--radius-button)] border border-stone-300 bg-white text-sm text-stone-600 hover:bg-stone-100"
          >
            解除
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {line.tokens.map((t) => (
          <button
            key={t.pos}
            type="button"
            onClick={() => handleTokenClick(t.pos)}
            disabled={!activeTag}
            className={`${tokenClass(t.pos, response)} ${!activeTag ? "opacity-60 cursor-default" : ""}`}
            title={`位置 ${t.pos}: ${t.eva}`}
          >
            <span className="text-[10px] text-stone-400 mr-1.5 font-sans">
              {t.pos}
            </span>
            {t.eva}
          </button>
        ))}
      </div>
    </div>
  );
}
