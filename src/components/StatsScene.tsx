"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/data";

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Stats presa na tela (estilo kr3w.gg): a seção é alta, o conteúdo fica parado
 * e cada número entra de lado e sobe conforme a rolagem anda.
 * No celular (uma coluna, não cabe na tela) não prende: os números entram ao passar.
 */
export default function StatsScene({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinned = r.height > vh * 1.5;
      // presa: 0 quando a seção aparece embaixo da tela → 1 no fim da parte presa
      // (assim os números já vão entrando enquanto ela sobe, e não depois que prende)
      setQ(reduce ? 1 : clamp(pinned ? (vh - r.top) / r.height : (vh * 0.85 - r.top) / (r.height * 0.9)));
    };
    const on = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // sm+: 170vh de altura com o miolo preso; celular: altura normal
    <div ref={ref} className="relative sm:h-[170vh]">
      <div className="relative flex flex-col justify-center py-24 sm:sticky sm:top-0 sm:h-[100svh] sm:py-0">
        {children}
        <div className="mt-16 grid gap-x-10 gap-y-16 sm:mt-12 sm:grid-cols-2 lg:mt-16">
          {stats.map((s, i) => {
            // entrada: os 4 estão na tela quando a seção encosta no topo (q ≈ 0.6);
            // contagem: termina já com a seção presa
            const t = ease(clamp((q - 0.12 - i * 0.08) / 0.24));
            const n = ease(clamp((q - 0.12 - i * 0.08) / 0.45));
            const side = i % 2 ? 1 : -1;
            return (
              <div
                key={s.label}
                className={`relative ${i % 2 ? "sm:pl-10 sm:text-left" : "sm:pr-10 sm:text-right"}`}
                style={{ opacity: t, transform: `translate3d(${(1 - t) * side * 90}px, ${(1 - t) * 40}px, 0)` }}
              >
                {/* número fantasma em pontinhos atrás, anda mais devagar (parallax) */}
                <span
                  className={`halftone-text pointer-events-none absolute -top-10 hidden font-black text-[9rem] leading-none [font-stretch:75%] sm:block sm:text-[12rem] ${i % 2 ? "left-0" : "right-0"}`}
                  style={{ transform: `translate3d(${(1 - t) * side * -60}px, 0, 0)` }}
                  aria-hidden
                >
                  {s.value}
                </span>
                <div className="relative">
                  {i >= 2 && <p className="display text-3xl sm:text-4xl">{s.label}</p>}
                  <p className="font-black text-7xl tracking-tight [font-stretch:80%] leading-[0.9] sm:text-8xl lg:text-9xl">
                    {s.prefix}
                    <span className="tabular-nums">{Math.round(s.value * n)}</span>
                    {s.suffix}
                  </p>
                  {i < 2 && <p className="display text-3xl sm:text-4xl">{s.label}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
