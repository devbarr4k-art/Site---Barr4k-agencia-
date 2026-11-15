"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks, CONTACT_EMAIL } from "@/lib/data";

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "bg-ink/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl 2xl:max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/img/logo-mark.png" alt="" width={44} height={33} priority />
          <span className="display text-2xl leading-none normal-case">
            BB <span className="not-italic font-sans font-extrabold text-sm tracking-tight align-top">AGENCY</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="link-line text-[13px] font-extrabold uppercase tracking-wide text-white/80 hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden lg:inline-flex items-center gap-2 border border-white/30 px-4 py-2 text-[13px] font-extrabold uppercase tracking-wide hover:bg-amber hover:text-ink hover:border-amber transition-colors"
        >
          Let&apos;s talk <ArrowUpRight className="h-4 w-4" />
        </a>

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
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-amber text-ink py-4 font-extrabold uppercase"
          >
            Let&apos;s talk <ArrowUpRight className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
