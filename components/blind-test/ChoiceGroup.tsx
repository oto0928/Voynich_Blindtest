import type { ChoiceValue } from "@/lib/types";
import { CHOICE_LABELS } from "@/lib/config";

interface ChoiceGroupProps {
  label: string;
  help?: string[];
  value: ChoiceValue | null;
  onChange: (v: ChoiceValue) => void;
  name: string;
  index?: number;
}

export function ChoiceGroup({
  label,
  help,
  value,
  onChange,
  name,
  index,
}: ChoiceGroupProps) {
  const options = Object.entries(CHOICE_LABELS) as [
    ChoiceValue,
    (typeof CHOICE_LABELS)[ChoiceValue],
  ][];

  return (
    <fieldset className="space-y-3 border-0 p-0 m-0">
      <legend className="flex items-start gap-2 text-base md:text-lg font-bold text-stone-900 mb-1">
        {index !== undefined && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-stone-200 text-stone-700 text-xs font-bold shrink-0 mt-0.5">
            {index}
          </span>
        )}
        <span>{label}</span>
      </legend>
      {help && help.length > 0 && (
        <ul className="text-sm text-stone-600 space-y-1.5 ml-0 pl-4 border-l-2 border-stone-200">
          {help.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 pt-1">
        {options.map(([key, { label: optLabel, hint }]) => {
          const selected = value === key;
          return (
            <label
              key={key}
              className={`flex flex-col items-center justify-center min-h-[52px] px-2 py-3 rounded-[var(--radius-button)] border-2 cursor-pointer transition-all text-center ${
                selected
                  ? "border-primary bg-primary-light text-primary font-bold scale-[1.02]"
                  : "border-stone-200 bg-white hover:border-stone-400 text-stone-800 hover:bg-stone-50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={key}
                checked={selected}
                onChange={() => onChange(key)}
                className="sr-only"
              />
              <span className="text-base">{optLabel}</span>
              <span
                className={`text-xs mt-0.5 ${selected ? "text-primary/70" : "text-stone-500"}`}
              >
                {hint}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
