import { useState } from "react";

/**
 * Simple tag/chip input for lists (current medicines, allergies).
 * Enter or the Add button commits a chip; clicking a chip removes it.
 */
export default function ChipInput({ label, items, onChange, addLabel, placeholder }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft("");
  };

  const remove = (item) => onChange(items.filter((i) => i !== item));

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-300"
        >
          {addLabel}
        </button>
      </div>
      {items.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => remove(item)}
              className="group flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-sm text-brand hover:bg-red-100 hover:text-red-700"
              title="Remove"
            >
              {item}
              <span className="text-xs group-hover:text-red-700">✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
