"use client";

import { useEffect, useState } from "react";
import type { ChipOption } from "@/components/CategoryChips";

type Group = { key: string; title: string; options: ChipOption[] };

// Mobile bottom sheet for the shop page. "filters" mode edits a draft and
// only commits on Apply (so the grid doesn't jump around underneath while
// choosing); "sort" mode applies as soon as an option is tapped.
export default function FilterSheet(props: {
  open: boolean;
  mode: "filters" | "sort";
  groups: Group[];
  values: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  // Mounted only while open, so the draft is freshly seeded from the live
  // values every time the sheet opens.
  if (!props.open) return null;
  return <SheetBody {...props} />;
}

function SheetBody({
  mode,
  groups,
  values,
  onApply,
  onClose,
}: {
  mode: "filters" | "sort";
  groups: Group[];
  values: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const title = mode === "filters" ? "Filters" : "Sort";

  return (
    <div className="md:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50"
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(7,26,51,0.2)]">
        <div className="flex items-center justify-between border-b border-grey-line px-5 py-2">
          <h2 className="text-h3 font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-2xl text-ink"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          {groups.map((group) => (
            <fieldset key={group.key} className="mb-5 last:mb-0">
              <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {group.title}
              </legend>
              <div className={mode === "sort" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
                {group.options.map((option) => {
                  const active = draft[group.key] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        const next = { ...draft, [group.key]: option.value };
                        setDraft(next);
                        if (mode === "sort") onApply(next);
                      }}
                      className={`min-h-11 rounded-[var(--radius)] border px-4 text-sm transition-colors duration-150 ${
                        mode === "sort" ? "text-left" : ""
                      } ${
                        active
                          ? "border-navy bg-navy font-semibold text-white"
                          : "border-grey-line bg-white text-ink hover:border-navy"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        {mode === "filters" && (
          <div className="flex gap-3 border-t border-grey-line px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() =>
                setDraft(Object.fromEntries(groups.map((g) => [g.key, "all"])))
              }
              className="btn-secondary flex-1"
            >
              Clear
            </button>
            <button type="button" onClick={() => onApply(draft)} className="btn-primary flex-[2]">
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
