"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadButton } from "./UploadButton";
import { useConfirm } from "./Confirm";
import RosterEditor from "./RosterEditor";
import BrandsEditor from "./BrandsEditor";
import CasesEditor from "./CasesEditor";
import Inbox from "./Inbox";
import { ArrowDown, ArrowUp, Check, ExternalLink, ImagePlus, Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import type { SiteContent, Star } from "@/lib/content-types";

const input = "w-full border border-white/20 bg-ink px-3 py-2.5 text-sm outline-none focus:border-amber";
const label = "block text-[10px] font-extrabold uppercase tracking-widest text-white/50";

export default function AdminEditor({ initial }: { initial: SiteContent }) {
  const ask = useConfirm();
  const [c, setC] = useState<SiteContent>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"inbox" | "site">("inbox");
  const [newCount, setNewCount] = useState(0);

  const update = (fn: (c: SiteContent) => SiteContent) => {
    setC((prev) => fn(prev));
    setDirty(true);
    setStatus("idle");
  };
  const setStar = (i: number, patch: Partial<Star>) => update((c) => ({ ...c, stars: c.stars.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  const move = (i: number, d: number) =>
    update((c) => {
      const s = [...c.stars];
      const j = i + d;
      if (j < 0 || j >= s.length) return c;
      [s[i], s[j]] = [s[j], s[i]];
      return { ...c, stars: s };
    });

  const missingPhoto = c.stars.some((s) => !s.photo) || c.brands.some((b) => !b.logo) || c.cases.some((x) => !x.img);
  const missingName = c.stars.some((s) => !s.name.trim()) || c.creators.some((x) => !x.name.trim()) || c.brands.some((b) => !b.name.trim()) || c.cases.some((x) => !x.title.trim());

  async function save() {
    if (missingPhoto || missingName) {
      setStatus("error");
      setMsg("Something is missing: every star needs a name and photo, every sponsor a name and logo, every case a title and image, every creator a name.");
      return;
    }
    setStatus("saving");
    const r = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }).catch(() => null);
    if (r?.ok) {
      setStatus("saved");
      setDirty(false);
      setMsg("");
    } else {
      setStatus("error");
      setMsg(r?.status === 401 ? "Session expired, reload the page and log in again." : "Could not save. Try again.");
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="pb-32">
      {/* topo fixo com salvar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Image src="/img/logo-mark.png" alt="BB" width={44} height={33} />
          <span className="display text-2xl">Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" className="hidden items-center gap-1.5 px-3 py-2 text-xs font-extrabold uppercase text-white/70 hover:text-white sm:inline-flex">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button type="button" onClick={logout} className="p-2 text-white/60 hover:text-white" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              hidden={tab !== "site"}
              onClick={save}
              disabled={status === "saving" || (!dirty && status !== "error")}
              className="inline-flex items-center gap-2 bg-amber px-5 py-2.5 text-sm font-extrabold uppercase text-ink disabled:opacity-40"
            >
              {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : status === "saved" ? <Check className="h-4 w-4" /> : null}
              {status === "saved" ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        {/* abas: mensagens do formulário / conteúdo do site */}
        <nav className="mx-auto flex max-w-5xl gap-1 px-4 sm:px-6" aria-label="Sections">
          {([
            ["inbox", `Inbox${newCount ? ` (${newCount})` : ""}`],
            ["site", `Site content${dirty ? " •" : ""}`],
          ] as const).map(([k, t]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`border-b-2 px-3 py-2.5 text-xs font-extrabold uppercase tracking-wider ${tab === k ? "border-amber text-white" : "border-transparent text-white/50 hover:text-white"}`}
            >
              {t}
            </button>
          ))}
        </nav>
        {tab === "site" && (msg || status === "saved") && (
          <p className={`mx-auto max-w-5xl px-4 pb-3 text-sm sm:px-6 ${status === "error" ? "text-amber" : "text-white/70"}`}>
            {status === "saved" ? "Saved! The site updates on the next visit (refresh the page)." : msg}
          </p>
        )}
      </header>

      <div className={`mx-auto max-w-5xl px-4 pt-10 sm:px-6 ${tab === "inbox" ? "" : "hidden"}`}>
        <Inbox onCount={setNewCount} />
      </div>

      <div className={`mx-auto max-w-5xl space-y-16 px-4 pt-10 sm:px-6 ${tab === "site" ? "" : "hidden"}`}>
        {/* STARS */}
        <section>
          <p className="eyebrow text-amber">Featured</p>
          <h2 className="display mt-2 text-4xl">Stars we have worked with</h2>
          <p className="mt-2 text-sm text-white/60">Order here = order in the carousel. The two small lines on the card are free text.</p>

          <ul className="mt-6 space-y-3">
            {c.stars.map((s, i) => (
              <li key={i} className="flex flex-col gap-4 border border-white/10 bg-navy/60 p-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="relative h-24 w-[68px] shrink-0 overflow-hidden bg-navy-2 ring-1 ring-white/15">
                    {s.photo ? (
                      <Image src={s.photo} alt="" fill sizes="68px" className="object-cover object-top" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold uppercase text-amber">No photo</span>
                    )}
                  </div>
                  <UploadButton
                    accept="image/*"
                    onDone={(url) => setStar(i, { photo: url })}
                    className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-2 text-xs font-extrabold uppercase hover:border-amber hover:text-amber"
                  >
                    <ImagePlus className="h-4 w-4" /> Photo
                  </UploadButton>
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <div>
                    <span className={label}>Name</span>
                    <input className={input} value={s.name} maxLength={40} onChange={(e) => setStar(i, { name: e.target.value })} />
                  </div>
                  <div>
                    <span className={label}>Orange line</span>
                    <input className={input} value={s.role} maxLength={40} placeholder="e.g. Streamer" onChange={(e) => setStar(i, { role: e.target.value })} />
                  </div>
                  <div>
                    <span className={label}>Grey line</span>
                    <input className={input} value={s.tag} maxLength={40} placeholder="e.g. Twitch" onChange={(e) => setStar(i, { tag: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-1 self-end sm:self-center">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === c.stars.length - 1} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => (await ask(`Remove ${s.name || "this star"}?`)) && update((c) => ({ ...c, stars: c.stars.filter((_, j) => j !== i) }))}
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
            onClick={() => update((c) => ({ ...c, stars: [...c.stars, { name: "", role: "", tag: "", photo: "" }] }))}
            className="mt-4 inline-flex items-center gap-2 border border-dashed border-white/30 px-4 py-3 text-sm font-extrabold uppercase hover:border-amber hover:text-amber"
          >
            <Plus className="h-4 w-4" /> Add star
          </button>
        </section>

        <BrandsEditor list={c.brands} onChange={(brands) => update((c) => ({ ...c, brands }))} />

        <CasesEditor list={c.cases} onChange={(cases) => update((c) => ({ ...c, cases }))} />

        <RosterEditor list={c.creators} onChange={(creators) => update((c) => ({ ...c, creators }))} />

      </div>
    </div>
  );
}
