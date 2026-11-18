"use client";

import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import type { Brand } from "@/lib/content-types";
import { UploadButton } from "./UploadButton";

const field = "w-full border border-white/20 bg-ink px-3 py-2.5 text-sm outline-none focus:border-amber";
const label = "block text-[10px] font-extrabold uppercase tracking-widest text-white/50";

/** largura/altura da imagem enviada (pra logo não sair esticada) */
function measure(url: string) {
  return new Promise<number>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 3);
    img.onerror = () => resolve(3);
    img.src = url;
  });
}

/** Logo branca igual aparece na faixa do site */
function Preview({ b }: { b: Brand }) {
  if (!b.logo) return <span className="text-[10px] font-bold uppercase text-amber">No logo</span>;
  return (
    <span
      className="block bg-white"
      style={{
        // cabe na caixa de 116 px sem cortar
        width: Math.min(b.h * b.ratio, 116),
        height: Math.min(b.h * b.ratio, 116) / b.ratio,
        WebkitMask: `url(${b.logo}) center / contain no-repeat`,
        mask: `url(${b.logo}) center / contain no-repeat`,
      }}
    />
  );
}

export default function BrandsEditor({ list, onChange }: { list: Brand[]; onChange: (list: Brand[]) => void }) {
  const set = (i: number, patch: Partial<Brand>) => onChange(list.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const l = [...list];
    [l[i], l[j]] = [l[j], l[i]];
    onChange(l);
  };

  return (
    <section>
      <p className="eyebrow text-amber">Brands</p>
      <h2 className="display mt-2 text-4xl">Sponsors</h2>
      <p className="mt-2 text-sm text-white/60">
        The logos in the moving strip. Order here = order in the strip. Use a logo with a transparent background (PNG or SVG): the site shows it in white and orange on hover.
      </p>

      <ul className="mt-6 space-y-3">
        {list.map((b, i) => (
          <li key={i} className="grid gap-4 border border-white/10 bg-navy/60 p-3 md:grid-cols-[250px_minmax(0,1fr)_auto] md:items-center">
            <div className="flex items-center gap-3">
              <div className="grid h-20 w-[140px] shrink-0 place-items-center overflow-hidden bg-ink px-3 ring-1 ring-white/15">
                <Preview b={b} />
              </div>
              <UploadButton
                accept="image/png,image/svg+xml,image/webp"
                onDone={async (url) => set(i, { logo: url, ratio: await measure(url) })}
                className="inline-flex items-center gap-1.5 border border-white/20 px-2.5 py-2 text-xs font-extrabold uppercase hover:border-amber hover:text-amber"
              >
                <ImagePlus className="h-4 w-4" /> Logo
              </UploadButton>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_150px]">
              <div>
                <span className={label}>Name</span>
                <input className={field} value={b.name} maxLength={40} onChange={(e) => set(i, { name: e.target.value })} />
              </div>
              <div>
                <span className={label}>Link</span>
                <input
                  className={field}
                  value={b.url === "#" ? "" : b.url}
                  placeholder="https://..."
                  onChange={(e) => set(i, { url: e.target.value.trim() || "#" })}
                />
              </div>
              <div>
                <span className={label}>Size</span>
                <input type="range" min={14} max={46} value={b.h} onChange={(e) => set(i, { h: Number(e.target.value) })} className="mt-3 w-full accent-[var(--color-amber)]" />
              </div>
            </div>
            <div className="flex gap-1 justify-self-end">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === list.length - 1} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => confirm(`Remove ${b.name || "this sponsor"}?`) && onChange(list.filter((_, j) => j !== i))}
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
        onClick={() => onChange([...list, { name: "", logo: "", url: "#", h: 32, ratio: 3 }])}
        className="mt-4 inline-flex items-center gap-2 border border-dashed border-white/30 px-4 py-3 text-sm font-extrabold uppercase hover:border-amber hover:text-amber"
      >
        <Plus className="h-4 w-4" /> Add sponsor
      </button>
    </section>
  );
}
