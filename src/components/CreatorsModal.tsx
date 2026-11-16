"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { FaInstagram, FaTwitch, FaYoutube } from "react-icons/fa";
import { SiKick } from "react-icons/si";
import { fallbackCreators, type Creator } from "@/lib/creators";
import avatars from "@/lib/creators-avatars.json";

// fotos de perfil baixadas da Twitch/YouTube (public/img/creators); sem foto = iniciais
const AVATARS = avatars as Record<string, string>;

/** Qualquer botão abre o popup com: openCreators() */
export const openCreators = () => window.dispatchEvent(new Event("open-creators"));

const PLATFORMS = [
  { key: "twitch", label: "Twitch", Icon: FaTwitch },
  { key: "kick", label: "Kick", Icon: SiKick },
  { key: "youtube", label: "YouTube", Icon: FaYoutube },
  { key: "instagram", label: "Instagram", Icon: FaInstagram },
] as const;
type PKey = (typeof PLATFORMS)[number]["key"];

const pad3 = (n: number) => String(n).padStart(3, "0");
const COLS = 12;
const ROWS = 8;

export default function CreatorsModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [list, setList] = useState<Creator[]>(fallbackCreators);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<PKey | "all">("all");
  const [count, setCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // lista ao vivo da planilha (cai na cópia salva se falhar)
  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch("/api/creators")
      .then((r) => r.json())
      .then((d) => alive && Array.isArray(d.creators) && d.creators.length && setList(d.creators))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open]);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setClosing(false);
    };
    window.addEventListener("open-creators", onOpen);
    return () => window.removeEventListener("open-creators", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 700);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
     
  }, [open]);

  // contador subindo até o total
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start - 350) / 1100, 1);
      setCount(Math.round(Math.max(p, 0) ** 0.6 * list.length));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, list.length]);

  function close() {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setQ("");
      setFilter("all");
    }, 380);
  }

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list
      .map((c, i) => ({ c, n: i + 1 }))
      .filter(({ c }) => (!s || c.name.toLowerCase().includes(s)) && (filter === "all" || c[filter]));
  }, [list, q, filter]);

  const delays = useMemo(() => Array.from({ length: COLS * ROWS }, (_, i) => ((i * 37) % 29) * 18 + (i % COLS) * 6), []);
  const names = useMemo(() => list.map((c) => c.name).join("  ✦  "), [list]);

  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-[80] flex items-stretch justify-center sm:p-5 lg:p-8 ${closing ? "cm-out" : ""}`} role="dialog" aria-modal="true" aria-labelledby="roster-title">
      <button type="button" aria-label="Close" onClick={close} className="cm-backdrop absolute inset-0 bg-ink/90 sm:bg-ink/80 sm:backdrop-blur-md" />

      <div className="cm-panel relative flex w-full max-w-7xl flex-col overflow-hidden bg-navy ring-1 ring-white/15">
        {/* fundo do slide de Creators + BB gigante de mini logos */}
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/img/bg/s8-v2.jpg)" }} aria-hidden />
        <div className="grain" aria-hidden />
        <div className="halftone halftone-mark pointer-events-none absolute -right-[8%] -top-[10%] h-[80%] w-[55%] opacity-25" aria-hidden />

        {/* pixels que somem revelando o painel */}
        <div className="pointer-events-none absolute inset-0 z-30 grid [contain:strict]" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }} aria-hidden>
          {delays.map((d, i) => (
            <span key={i} className={`cm-px ${(Math.imul(i + 3, 2654435761) >>> 0) % 10 < 2 ? "bg-amber" : (Math.imul(i + 3, 2654435761) >>> 0) % 10 < 4 ? "bg-royal" : "bg-paper"}`} style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>

        {/* faixa de nomes rodando atrás do título */}
        <div className="pointer-events-none absolute inset-x-0 top-6 overflow-hidden opacity-[0.07]" aria-hidden>
          <div className="marquee roster-marquee display whitespace-nowrap text-[7rem] leading-none">
            <span className="pr-10">{names}</span>
            <span className="pr-10">{names}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center bg-ink/40 ring-1 ring-white/25 transition hover:rotate-90 hover:bg-amber hover:text-ink hover:ring-amber"
        >
          <X className="h-5 w-5" />
        </button>

        {/* topo */}
        <div className="relative z-10 shrink-0 px-5 pt-8 sm:px-10 sm:pt-10">
          <div className="cm-in flex flex-wrap items-end justify-between gap-6" style={{ animationDelay: "380ms" }}>
            <div>
              <span className="eyebrow">
                <Image src="/img/logo-mark.png" alt="" width={18} height={13} className="mr-2 inline" />
                Creators
              </span>
              <h2 id="roster-title" className="display mt-4 text-6xl sm:text-8xl">
                The <span className="text-amber">roster</span>
              </h2>
            </div>
            <div className="pr-14 text-right sm:pr-16">
              <div className="font-black leading-none tabular-nums text-6xl sm:text-7xl">+{count}</div>
              <div className="display mt-1 text-xl normal-case text-white/70">Creators We Can Bring to Your Product</div>
            </div>
          </div>

          <div className="cm-in mt-6 flex flex-col gap-3 md:flex-row md:items-center" style={{ animationDelay: "460ms" }}>
            <label className="group relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-0 h-5 w-5 text-white/50 transition-colors group-focus-within:text-amber" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a creator..."
                aria-label="Search a creator"
                className="grotesk w-full border-b-2 border-white/25 bg-transparent py-2 pl-8 text-xl outline-none transition-colors placeholder:text-white/35 focus:border-amber"
              />
            </label>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:pb-0">
              {([{ key: "all", label: "All", Icon: null }, ...PLATFORMS] as const).map(({ key, label, Icon }) => {
                const on = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(key)}
                    className={`flex shrink-0 items-center gap-2 px-4 py-2 text-xs font-extrabold uppercase tracking-wider ring-1 transition-all active:scale-95 ${
                      on ? "bg-amber text-ink ring-amber" : "bg-ink/30 text-white/80 ring-white/25 hover:ring-white/60"
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* lista */}
        <div
          ref={gridRef}
          onMouseMove={(e) => {
            const r = gridRef.current!.getBoundingClientRect();
            gridRef.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
            gridRef.current!.style.setProperty("--my", `${e.clientY - r.top + gridRef.current!.scrollTop}px`);
          }}
          className="roster-grid relative z-10 mt-4 flex-1 overflow-y-auto overscroll-contain px-5 pb-10 pt-3 sm:px-10"
        >
          {shown.length === 0 ? (
            <div className="grid place-items-center py-24 text-center">
              <div className="display text-5xl normal-case text-white/60">No creator found.</div>
              <button type="button" onClick={() => (setQ(""), setFilter("all"))} className="link-line mt-4 text-xs font-extrabold uppercase text-amber">
                Clear search
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map(({ c, n }, i) => (
                <li key={`${c.name}-${n}`} className="roster-card group relative" style={{ animationDelay: `${520 + Math.min(i, 24) * 35}ms` }}>
                  <div className="relative flex h-full items-center gap-4 overflow-hidden bg-ink/55 p-3 ring-1 ring-white/12 backdrop-blur-[2px] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-ink/75 group-hover:ring-amber">
                    {/* quadrado com as iniciais, estilo pixel do deck */}
                    <div className={`relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden transition-transform duration-500 group-hover:rotate-[-6deg] ${n % 3 === 0 ? "bg-amber text-ink" : n % 3 === 1 ? "bg-royal" : "bg-paper text-ink"}`}>
                      <span className="display text-3xl normal-case">{c.name.replace(/[^a-z0-9]/gi, "").slice(0, 2) || "?"}</span>
                      {AVATARS[c.name] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={AVATARS[c.name]}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover grayscale-[15%] transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                        />
                      )}
                      <span className="absolute -right-1 -top-1 z-[1] h-3 w-3 bg-ink transition-transform group-hover:scale-150" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold tracking-widest text-white/40 tabular-nums">#{pad3(n)}</div>
                      <div className="truncate text-xl font-black tracking-tight transition-colors group-hover:text-amber">{c.name}</div>
                      <div className="mt-1.5 flex gap-2.5">
                        {PLATFORMS.map(({ key, label, Icon }) =>
                          c[key] ? (
                            <a
                              key={key}
                              href={c[key]}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${c.name} on ${label}`}
                              className="text-white/60 transition-all hover:scale-125 hover:text-amber"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
        {/* esmaecido no fim da lista */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-navy to-transparent" aria-hidden />
      </div>
    </div>
  );
}

/** Botão que abre o popup (usado no "click here!" da seção Creators) */
export function CreatorsButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openCreators} className={className}>
      {children}
    </button>
  );
}
