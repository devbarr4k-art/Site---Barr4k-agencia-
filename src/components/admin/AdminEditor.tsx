"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ArrowDown, ArrowUp, Check, ExternalLink, ImagePlus, Loader2, LogOut, Plus, Trash2 } from "lucide-react";
import type { Banner, SiteContent, Star } from "@/lib/content-types";

const input = "w-full border border-white/20 bg-ink px-3 py-2.5 text-sm outline-none focus:border-amber";
const label = "block text-[10px] font-extrabold uppercase tracking-widest text-white/50";

async function sendFile(file: File) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const blob = await upload(`uploads/${safe}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
  return blob.url;
}

/** Botão que abre o seletor de arquivo e já sobe pro Blob */
function UploadButton({ accept, onDone, children, className = "" }: { accept: string; onDone: (url: string, file: File) => void; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <>
      <button type="button" disabled={busy} onClick={() => ref.current?.click()} className={className}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </button>
      {err && <span className="text-xs text-amber">{err}</span>}
      <input
        ref={ref}
        type="file"
        accept={accept}
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          setErr("");
          try {
            onDone(await sendFile(f), f);
          } catch {
            setErr("Upload failed (max 60 MB).");
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}

export default function AdminEditor({ initial }: { initial: SiteContent }) {
  const [c, setC] = useState<SiteContent>(initial);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

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
  const setBanner = (i: number, b: Banner) => update((c) => ({ ...c, banners: c.banners.map((x, j) => (j === i ? b : x)) }));

  const missingPhoto = c.stars.some((s) => !s.photo);
  const missingName = c.stars.some((s) => !s.name.trim());

  async function save() {
    if (missingPhoto || missingName) {
      setStatus("error");
      setMsg("Every star needs a name and a photo.");
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
              onClick={save}
              disabled={status === "saving" || (!dirty && status !== "error")}
              className="inline-flex items-center gap-2 bg-amber px-5 py-2.5 text-sm font-extrabold uppercase text-ink disabled:opacity-40"
            >
              {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : status === "saved" ? <Check className="h-4 w-4" /> : null}
              {status === "saved" ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        {(msg || status === "saved") && (
          <p className={`mx-auto max-w-5xl px-4 pb-3 text-sm sm:px-6 ${status === "error" ? "text-amber" : "text-white/70"}`}>
            {status === "saved" ? "Saved! The site updates on the next visit (refresh the page)." : msg}
          </p>
        )}
      </header>

      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-10 sm:px-6">
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
                    onClick={() => confirm(`Remove ${s.name || "this star"}?`) && update((c) => ({ ...c, stars: c.stars.filter((_, j) => j !== i) }))}
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

        {/* FRAMEWORK */}
        <section>
          <p className="eyebrow text-amber">Framework</p>
          <h2 className="display mt-2 text-4xl">In-house graphics</h2>
          <span className={`${label} mt-6`}>Text</span>
          <textarea
            className={`${input} mt-1 min-h-32`}
            maxLength={600}
            value={c.frameworkText}
            onChange={(e) => update((c) => ({ ...c, frameworkText: e.target.value }))}
          />

          <p className="mt-8 text-sm text-white/60">Animated banners: the 2 extra squares in the collage. GIF, MP4/WebM video or image, square works best.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {c.banners.map((b, i) => (
              <div key={i} className="border border-white/10 bg-navy/60 p-3">
                <span className={label}>Square {i + 1}</span>
                <div className="relative mt-2 aspect-square overflow-hidden bg-ink ring-1 ring-white/15">
                  {b ? (
                    b.kind === "video" ? (
                      <video src={b.src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.src} alt="" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-xs font-bold uppercase text-white/40">Empty (shows the BB placeholder)</span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <UploadButton
                    accept="image/*,video/mp4,video/webm"
                    onDone={(url, f) => setBanner(i, { src: url, kind: f.type.startsWith("video/") ? "video" : "image" })}
                    className="inline-flex items-center gap-1.5 border border-white/20 px-3 py-2 text-xs font-extrabold uppercase hover:border-amber hover:text-amber"
                  >
                    <ImagePlus className="h-4 w-4" /> {b ? "Replace" : "Upload"}
                  </UploadButton>
                  {b && (
                    <button type="button" onClick={() => setBanner(i, null)} className="p-2 text-white/60 hover:text-amber" aria-label="Remove banner">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
