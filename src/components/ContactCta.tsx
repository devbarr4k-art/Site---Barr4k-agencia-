"use client";

import { ArrowRight } from "lucide-react";
import { openContact } from "./ContactModal";

const ease = "duration-500 ease-[cubic-bezier(.7,0,.2,1)]";

/**
 * Botão de contato com a animação do kr3w.gg, nas cores da BB: escuro com um quadrado laranja e a seta;
 * no hover o laranja cresce e enche o botão, a seta sai e outra entra, e o texto rola pra cima já escuro.
 * Abre o formulário de contato.
 */
export default function ContactCta({
  label,
  size = "md",
  className = "",
  onClick,
}: {
  label: string;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}) {
  const s =
    size === "sm"
      ? { btn: "h-11 gap-3 pr-5 text-[13px]", pad: "5px", box: "h-8 w-8", icon: "h-4 w-4", line: "h-4 leading-4" }
      : { btn: "h-14 gap-4 pr-7 text-sm", pad: "6px", box: "h-11 w-11", icon: "h-5 w-5", line: "h-5 leading-5" };
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        openContact();
      }}
      style={{ ["--pad" as string]: s.pad }}
      className={`group relative inline-flex items-center overflow-hidden bg-ink pl-[var(--pad)] font-extrabold uppercase tracking-wide text-paper ring-1 ring-white/15 ${s.btn} ${className}`}
    >
      {/* quadrado laranja que cresce até encher o botão */}
      <span
        className={`absolute inset-y-[var(--pad)] left-[var(--pad)] bg-amber transition-[width] ${ease} ${s.box} !h-auto group-hover:w-[calc(100%-2*var(--pad))]`}
        aria-hidden
      />
      <span className={`relative grid shrink-0 place-items-center overflow-hidden text-ink ${s.box}`} aria-hidden>
        <ArrowRight className={`${s.icon} transition-transform ${ease} group-hover:translate-x-[200%]`} />
        <ArrowRight className={`absolute ${s.icon} -translate-x-[200%] transition-transform ${ease} group-hover:translate-x-0`} />
      </span>
      <span className={`relative block overflow-hidden ${s.line}`}>
        <span className={`block transition-transform ${ease} group-hover:-translate-y-full`}>{label}</span>
        <span className={`absolute inset-x-0 top-0 block translate-y-full text-ink transition-transform ${ease} group-hover:translate-y-0`} aria-hidden>
          {label}
        </span>
      </span>
    </button>
  );
}
