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
            className={`shrink-0 rounded-[var(--radius)] px-4 py-2 min-h-11 text-sm border transition-colors duration-150 ease-out ${
              active
                ? "bg-navy text-white border-navy font-medium"
                : "bg-white text-muted border-grey-line hover:border-navy hover:text-navy"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
