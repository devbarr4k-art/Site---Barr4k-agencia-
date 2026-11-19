"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react";
import { navLinks } from "@/lib/data";
import { openContact } from "./ContactModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava a rolagem com o menu do celular aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      // borda sempre presente (só muda de cor) pra não piscar branca na transição
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "bg-ink/80 backdrop-blur-md border-white/10" : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl 2xl:max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {/* só a logo BB, sem o texto */}
          <Image src="/img/logo-mark.png" alt="BB Agency" width={56} height={42} priority />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="link-line text-[13px] font-extrabold uppercase tracking-wide text-white/80 hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        {/* animação estilo kr3w.gg: botão branco; o quadrado azul da seta cresce e enche o botão,
            a seta sai e outra entra, e o texto rola pra cima já em branco */}
        <button
          type="button"
          onClick={openContact}
          className="group relative hidden h-11 items-center gap-3 overflow-hidden bg-paper pl-[5px] pr-5 text-[13px] font-extrabold uppercase tracking-wide text-ink lg:inline-flex"
        >
          <span
            className="absolute bottom-[5px] left-[5px] top-[5px] w-8 bg-royal transition-[width] duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:w-[calc(100%-10px)]"
            aria-hidden
          />
          <span className="relative grid h-8 w-8 shrink-0 place-items-center overflow-hidden text-white" aria-hidden>
            <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-x-[200%]" />
            <ArrowRight className="absolute h-4 w-4 -translate-x-[200%] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-x-0" />
          </span>
          <span className="relative block h-4 overflow-hidden leading-4">
            <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">Let&apos;s talk</span>
            <span className="absolute inset-x-0 top-0 block translate-y-full text-white transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0" aria-hidden>
              Let&apos;s talk
            </span>
          </span>
        </button>

        <button
          type="button"
          className="lg:hidden p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Menu do celular */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ${open ? "max-h-[100svh]" : "max-h-0"}`}
      >
        <nav className="flex h-[calc(100svh-5rem)] flex-col justify-between px-4 sm:px-6 pb-10 pt-4">
          <ul className="flex flex-col">
            {navLinks.map((l, i) => (
              <li key={l.href} className="border-b border-white/10">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className="display text-5xl">{l.label}</span>
                  <span className="text-xs font-bold text-white/40">0{i + 1}</span>
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openContact();
            }}
            className="inline-flex items-center justify-center gap-2 bg-amber text-ink py-4 font-extrabold uppercase"
          >
            Let&apos;s talk <ArrowUpRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
