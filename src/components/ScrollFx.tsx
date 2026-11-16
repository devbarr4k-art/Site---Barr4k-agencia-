"use client";

import { useEffect, useRef } from "react";

/**
 * Efeito de rolagem: enquanto a seção passa pela tela, o conteúdo sobe devagar,
 * gira de leve e cresce até o centro da tela (parallax). Usa só transform, então fica leve.
 */
export default function ScrollFx({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 (entrando por baixo) → 0 (centro da tela) → 1 (saindo por cima)
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
      const a = Math.abs(p);
      el.style.transform = `translate3d(0, ${p * 70}px, 0) rotate(${p * -4}deg) scale(${1 - a * 0.12})`;
      el.style.opacity = String(1 - Math.max(0, a - 0.55) * 1.6);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
