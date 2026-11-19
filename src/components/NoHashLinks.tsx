"use client";

import { useEffect } from "react";
import { naturalTop } from "./StackFx";

/**
 * Links de âncora (#featured, #top...) rolam até a seção sem pôr "#" na URL.
 * Se alguém abrir o site com um "#" no endereço, rola até lá e limpa a URL.
 */
// onde parar: logo abaixo do menu (80px); seção com data-anchor-end (Stats presa) para no fim, com os números já na tela
const anchorY = (el: HTMLElement) =>
  el.hasAttribute("data-anchor-end") && el.offsetHeight > window.innerHeight * 1.5 ? naturalTop(el) + el.offsetHeight - window.innerHeight : naturalTop(el) - 80;

export default function NoHashLinks() {
  useEffect(() => {
    const clean = () => history.replaceState(null, "", location.pathname + location.search);
    const go = (id: string, smooth: boolean) => {
      const target = id === "top" || !id ? 0 : document.getElementById(id);
      if (target === null) return;
      // com a rolagem suave (Lenis) ligada, ela faz o caminho (ela já respeita o scroll-padding do menu fixo)
      // seções presas (sticky) mentem a posição; usa a posição "natural" menos a altura do menu
      if (window.__lenis) return window.__lenis.scrollTo(target === 0 ? 0 : anchorY(target), { immediate: !smooth, duration: 1.4 });
      if (target === 0) return window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      window.scrollTo({ top: anchorY(target), behavior: smooth ? "smooth" : "auto" });
    };
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      clean();
      requestAnimationFrame(() => go(id, false));
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      const href = a?.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      go(href.slice(1), true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
