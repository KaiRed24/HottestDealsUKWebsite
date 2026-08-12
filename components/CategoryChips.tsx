"use client";

export type ChipOption = { value: string; label: string };

export default function CategoryChips({
  options,
  selected,
  onChange,
}: {
  options: ChipOption[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`shrink-0 rounded-full px-4 py-2 min-h-11 text-sm font-semibold border transition-colors ${
              active
                ? "bg-red text-cream border-red"
                : "bg-paper text-ink border-ink/15 hover:border-ink/40"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
