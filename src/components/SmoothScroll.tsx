"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Rolagem suave com inércia (Lenis), o mesmo tipo do kr3w.gg: a roda do mouse não "pula",
 * a página desliza e desacelera. No celular o toque continua nativo.
 * Dentro dos popups (role="dialog") a rolagem fica normal, pra não brigar com o scroll deles.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      prevent: (node) => !!node.closest?.('[role="dialog"], [data-lenis-prevent]'),
    });
    window.__lenis = lenis;
    // popup aberto (body com overflow hidden) → pausa a rolagem da página
    const sync = () => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      mo.disconnect();
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
