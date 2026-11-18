"use client";

import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import type { Case } from "@/lib/content-types";
import { UploadButton } from "./UploadButton";
import { useConfirm } from "./Confirm";

const field = "w-full border border-white/20 bg-ink px-3 py-2.5 text-sm outline-none focus:border-amber";
const label = "block text-[10px] font-extrabold uppercase tracking-widest text-white/50";

/** Cards da seção "ORGs and Events" */
export default function CasesEditor({ list, onChange }: { list: Case[]; onChange: (list: Case[]) => void }) {
  const ask = useConfirm();
  const set = (i: number, patch: Partial<Case>) => onChange(list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const l = [...list];
    [l[i], l[j]] = [l[j], l[i]];
    onChange(l);
  };

  return (
    <section>
      <p className="eyebrow text-amber">Cases</p>
      <h2 className="display mt-2 text-4xl">ORGs and Events</h2>
      <p className="mt-2 text-sm text-white/60">The cards in the Cases section, 3 per row. Wide images work best (about 2:1).</p>

      <ul className="mt-6 space-y-3">
        {list.map((c, i) => (
          <li key={i} className="grid gap-4 border border-white/10 bg-navy/60 p-3 md:grid-cols-[220px_minmax(0,1fr)_auto]">
            <div>
              <div className="relative aspect-[16/8] overflow-hidden bg-ink ring-1 ring-white/15">
                {c.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-bold uppercase text-amber">No image</span>
                )}
              </div>
              <div className="mt-2">
                <UploadButton
                  accept="image/*"
                  onDone={(url) => set(i, { img: url })}
                  className="inline-flex items-center gap-1.5 border border-white/20 px-2.5 py-2 text-xs font-extrabold uppercase hover:border-amber hover:text-amber"
                >
                  <ImagePlus className="h-4 w-4" /> Image
                </UploadButton>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className={label}>Title</span>
                <input className={field} value={c.title} maxLength={120} onChange={(e) => set(i, { title: e.target.value })} />
              </div>
              <div>
                <span className={label}>Text</span>
                <textarea className={`${field} min-h-20`} value={c.text} maxLength={300} onChange={(e) => set(i, { text: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-1 self-start justify-self-end">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={async () => (await ask(`Remove ${c.title ? `"${c.title.slice(0, 40)}"` : "this case"}?`)) && onChange(list.filter((_, j) => j !== i))}
                className="p-2 text-white/60 hover:text-amber"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...list, { title: "", text: "", img: "" }])}
        className="mt-4 inline-flex items-center gap-2 border border-dashed border-white/30 px-4 py-3 text-sm font-extrabold uppercase hover:border-amber hover:text-amber"
      >
        <Plus className="h-4 w-4" /> Add case
      </button>
    </section>
  );
}
