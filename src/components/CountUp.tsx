"use client";

import { useEffect, useRef, useState } from "react";

/** Número que sobe de 0 até o valor toda vez que entra na tela (zera quando sai) */
export default function CountUp({ to, duration = 1800 }: { to: number; duration?: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setV(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) run();
        else {
          cancelAnimationFrame(raf);
          setV(0);
        }
      },
      // só começa quando o número já está bem visível (não na borda da tela)
      { threshold: 0.9, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return <span ref={ref} className="tabular-nums">{v}</span>;
}
