"use client";

import { useEffect } from "react";

/**
 * Links de âncora (#featured, #top...) rolam até a seção sem pôr "#" na URL.
 * Se alguém abrir o site com um "#" no endereço, rola até lá e limpa a URL.
 */
export default function NoHashLinks() {
  useEffect(() => {
    const clean = () => history.replaceState(null, "", location.pathname + location.search);
    const go = (id: string, smooth: boolean) => {
      if (id === "top" || !id) return window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
      document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
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
