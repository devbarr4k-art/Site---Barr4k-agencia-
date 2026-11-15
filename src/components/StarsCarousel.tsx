"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { stars } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const INTERVAL = 2600; // tempo de cada carta no centro (ms)

/** Cartas em leque girando sozinhas em loop infinito (pausa com o mouse em cima) */
export default function StarsCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = stars.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), INTERVAL);
    return () => clearInterval(t);
  }, [paused, n]);

  const prev = stars[(active - 1 + n) % n];
  const next = stars[(active + 1) % n];

  return (
    <div className="select-none" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative mx-auto h-[420px] sm:h-[500px] w-full max-w-[720px] [perspective:1600px]">
        {stars.map((s, i) => {
          // distância circular até a carta do centro (por isso o loop não "volta" do fim pro começo)
          let d = i - active;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const abs = Math.abs(d);
          const hidden = abs > 2;
          return (
            <article
              key={s.name}
              aria-hidden={d !== 0}
              className="absolute left-1/2 top-1/2 w-[230px] sm:w-[290px] aspect-[3/4.2]"
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 46}%) translateZ(${-abs * 160}px) rotateY(${-d * 18}deg) rotateZ(${d * 2}deg)`,
                zIndex: 20 - abs * 2,
                opacity: hidden ? 0 : 1 - abs * 0.18,
                filter: `brightness(${1 - Math.min(abs, 2) * 0.28})`,
                transition: "transform .9s cubic-bezier(.2,.8,.2,1), opacity .9s, filter .9s",
              }}
            >
              <div className={`relative h-full w-full overflow-hidden bg-navy-2 ${d === 0 ? "ring-2 ring-amber" : "ring-1 ring-white/20"}`}>
                <Image
                  src={s.photo}
                  alt={s.name}
                  fill
                  sizes="300px"
                  quality={90}
                  draggable={false}
                  className="object-cover object-center scale-[1.12]"
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

      {/* Anterior / no centro / próximo */}
      <div className="mt-6 grid grid-cols-3 items-end gap-2 text-center">
        <div className="justify-self-start text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Previous</span>
          <div className="display text-2xl normal-case text-white/70">{prev.name}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber">{pad(active + 1)}/{pad(n)}</span>
          <div className="display text-4xl normal-case">{stars[active].name}</div>
        </div>
        <div className="justify-self-end text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Next</span>
          <div className="display text-2xl normal-case text-white/70">{next.name}</div>
        </div>
      </div>
      {/* barrinha de progresso até a próxima carta */}
      <div className="mx-auto mt-5 h-[2px] w-40 overflow-hidden bg-white/15">
        <div
          key={`${active}-${paused}`}
          className="h-full bg-amber"
          style={{ animation: paused ? "none" : `starsProgress ${INTERVAL}ms linear forwards`, width: paused ? "100%" : undefined }}
        />
      </div>
    </div>
  );
}
