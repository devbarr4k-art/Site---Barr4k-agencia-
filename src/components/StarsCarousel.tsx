"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stars } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/** Carrossel de cartas em leque (arrastar, setas do teclado ou botões) */
export default function StarsCarousel() {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const drag = useRef<{ x: number; id: number } | null>(null);
  const n = stars.length;

  const go = useCallback((d: number) => setActive((a) => (a + d + n) % n), [n]);

  // gira sozinho até a pessoa mexer
  const touched = useRef(false);
  useEffect(() => {
    const t = setInterval(() => !touched.current && go(1), 4200);
    return () => clearInterval(t);
  }, [go]);

  const onDown = (e: React.PointerEvent) => {
    touched.current = true;
    drag.current = { x: e.clientX, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (drag.current) setDragX(e.clientX - drag.current.x);
  };
  const onUp = () => {
    if (!drag.current) return;
    if (dragX < -60) go(1);
    else if (dragX > 60) go(-1);
    drag.current = null;
    setDragX(0);
  };

  const prev = stars[(active - 1 + n) % n];
  const next = stars[(active + 1) % n];

  return (
    <div
      className="select-none outline-none"
      tabIndex={0}
      aria-roledescription="carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") { touched.current = true; go(-1); }
        if (e.key === "ArrowRight") { touched.current = true; go(1); }
      }}
    >
      <div
        className="relative mx-auto h-[420px] sm:h-[500px] w-full max-w-[720px] touch-pan-y cursor-grab active:cursor-grabbing [perspective:1600px]"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {stars.map((s, i) => {
          // distância circular até a carta ativa
          let d = i - active;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const off = d + dragX / 260;
          const abs = Math.abs(off);
          const hidden = Math.abs(d) > 2;
          return (
            <article
              key={s.name}
              onClick={() => { if (d !== 0) { touched.current = true; go(d); } }}
              className="absolute left-1/2 top-1/2 w-[230px] sm:w-[290px] aspect-[3/4.2]"
              style={{
                transform: `translate(-50%, -50%) translateX(${off * 46}%) translateZ(${-abs * 160}px) rotateY(${-off * 18}deg) rotateZ(${off * 2}deg)`,
                zIndex: 20 - Math.round(abs * 2),
                opacity: hidden ? 0 : 1 - abs * 0.18,
                filter: `brightness(${1 - Math.min(abs, 2) * 0.28})`,
                transition: drag.current ? "none" : "transform .7s cubic-bezier(.2,.8,.2,1), opacity .7s, filter .7s",
                pointerEvents: hidden ? "none" : "auto",
              }}
            >
              <div className={`relative h-full w-full overflow-hidden bg-navy-2 ${d === 0 ? "ring-2 ring-amber" : "ring-1 ring-white/20"}`}>
                <Image
                  src={s.photo}
                  alt={s.name}
                  fill
                  sizes="300px"
                  draggable={false}
                  className="object-cover scale-[1.12] origin-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Image src="/img/logo-mark.png" alt="" width={18} height={13} /> BB Agency
                  </span>
                  <span className="text-white/60">{pad(i + 1)}</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="display text-5xl sm:text-6xl normal-case">{s.name}</h3>
                  <p className="mt-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider">
                    <span className="text-amber">{s.role}</span>
                    <span className="text-white/60">{s.tag}</span>
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Anterior / selecionado / próximo */}
      <div className="mt-6 grid grid-cols-3 items-end gap-2 text-center">
        <button onClick={() => { touched.current = true; go(-1); }} className="group justify-self-start text-left">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Previous
          </span>
          <span className="display text-2xl normal-case text-white/70 group-hover:text-white">{prev.name}</span>
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber">Selected · {pad(active + 1)}/{pad(n)}</span>
          <div className="display text-4xl normal-case">{stars[active].name}</div>
        </div>
        <button onClick={() => { touched.current = true; go(1); }} className="group justify-self-end text-right">
          <span className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
            Next <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="display text-2xl normal-case text-white/70 group-hover:text-white">{next.name}</span>
        </button>
      </div>
      <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Drag to explore</p>
    </div>
  );
}
