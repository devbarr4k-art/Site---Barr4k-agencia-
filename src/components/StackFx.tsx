"use client";

import { useEffect } from "react";

/**
 * Seções empilhadas (estilo kr3w.gg): cada seção marcada com data-stack fica presa
 * quando você chega no fim dela, e a seguinte sobe por cima, escurecendo e encolhendo
 * de leve a de trás. A última (rodapé) só cobre, não prende.
 *
 * O "top" de cada uma é altura da tela − altura da seção: assim seção alta rola inteira
 * antes de prender (ninguém perde conteúdo).
 */
export default function StackFx() {
  useEffect(() => {
    const secs = [...document.querySelectorAll<HTMLElement>("[data-stack]")];
    if (secs.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tops = new Array<number>(secs.length).fill(0);
    let vh = window.innerHeight;
    let raf = 0;

    const tick = () => {
      raf = 0;
      // celular: a barra do navegador some/aparece e muda a altura da tela sem avisar
      if (window.innerHeight !== vh) return layout();
      for (let i = 0; i < secs.length - 1; i++) {
        const s = secs[i];
        // quanto da tela a próxima já cobriu (0 = nada, 1 = tudo)
        const p = Math.min(1, Math.max(0, 1 - secs[i + 1].getBoundingClientRect().top / vh));
        s.style.setProperty("--cover", p.toFixed(3));
        if (reduce) continue;
        if (p > 0) {
          s.style.transformOrigin = `50% ${-tops[i] + vh / 2}px`;
          s.style.transform = `scale(${1 - p * 0.06})`;
        } else if (s.style.transform) {
          s.style.transform = "";
        }
      }
    };
    const layout = () => {
      vh = window.innerHeight;
      secs.slice(0, -1).forEach((s, i) => {
        tops[i] = Math.min(0, vh - s.offsetHeight);
        s.style.position = "sticky";
        s.style.top = `${tops[i]}px`;
      });
      tick();
    };
    const onScroll = () => (raf ||= requestAnimationFrame(tick));

    layout();
    const ro = new ResizeObserver(() => layout());
    secs.forEach((s) => ro.observe(s));
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      secs.forEach((s) => {
        s.style.position = s.style.top = s.style.transform = s.style.transformOrigin = "";
        s.style.removeProperty("--cover");
      });
    };
  }, []);
  return null;
}

/** Posição "natural" da seção na página (sem o deslocamento do sticky), pra os links do menu */
export function naturalTop(el: HTMLElement) {
  const { position, transform } = el.style;
  el.style.position = "static"; // static ignora o "top" do sticky
  el.style.transform = ""; // e o encolhido de quando está coberta
  const y = el.getBoundingClientRect().top + window.scrollY;
  el.style.position = position;
  el.style.transform = transform;
  return y;
}
