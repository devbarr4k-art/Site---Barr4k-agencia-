"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { EMAILJS, CONTACT_EMAIL } from "@/lib/data";

/** Qualquer botão do site abre o popup com: window.dispatchEvent(new Event("open-contact")) */
export const openContact = () => window.dispatchEvent(new Event("open-contact"));

const TOPICS = ["Brand partnership", "Creator management", "Organization", "Event", "Other"];
const MAX = 1000;
// grade de pixels que "se desfaz" pra revelar o formulário
// computador 10x12; celular 6x9 (menos quadradinhos = abertura lisa em celular fraco)
const GRID = { desk: [10, 12], phone: [6, 9] } as const;

// cor "aleatória" fixa de cada pixel (sem formar listras)
const pxColor = (i: number) => {
  const h = (Math.imul(i + 1, 2654435761) >>> 0) % 10;
  return h < 2 ? "bg-amber" : h < 4 ? "bg-royal" : "bg-paper";
};

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [topics, setTopics] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const [chatApp, setChatApp] = useState<"Telegram" | "Discord">("Telegram");
  const [err, setErr] = useState("");
  const [pxDone, setPxDone] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  // atraso aleatório (mas fixo) de cada pixel
  const [[COLS, ROWS], setGrid] = useState<readonly [number, number]>(GRID.desk);
  const delays = useMemo(
    () => Array.from({ length: COLS * ROWS }, (_, i) => ((i * 37) % 23) * 22 + (i % COLS) * 8),
    [COLS, ROWS]
  );

  useEffect(() => {
    const onOpen = () => {
      setGrid(window.innerWidth < 640 ? GRID.phone : GRID.desk);
      setPxDone(false);
      setOpen(true);
      setClosing(false);
    };
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  // tira os pixels da abertura da tela quando a animação acaba (no celular alguns ficavam presos)
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setPxDone(true), 1200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstField.current?.focus({ preventScroll: true }), 650);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      if (status === "sent") {
        setStatus("idle");
        setTopics([]);
        setMsg("");
      }
    }, 380);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      // Telegram: aceita "@fulano", "fulano" ou "t.me/fulano"; Discord: o nome de usuário como veio
      chat:
        chatApp === "Telegram"
          ? String(fd.get("chat") || "").trim().replace(/^(https?:\/\/)?(t\.me|telegram\.me)\//i, "").replace(/^@/, "").replace(/[^\w]/g, "")
          : String(fd.get("chat") || "").trim().replace(/^@/, "").slice(0, 40),
      topics,
      message: msg,
      website: String(fd.get("website") || ""), // isca pra robô
    };
    // robô preencheu a isca: finge que deu certo
    if (data.website) return setStatus("sent");
    if (!data.email.trim() && !data.chat) {
      setErr("Leave your Telegram/Discord or email so we can reach you.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErr("");
    try {
      // EmailJS manda o e-mail (layout salvo no template de lá) pro dev.barr4k@gmail.com
      const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS.serviceId,
          template_id: EMAILJS.templateId,
          user_id: EMAILJS.publicKey,
          template_params: {
            name: data.name,
            email: data.email || "Not informed",
            reply_to: data.email || "",
            // nomes "telegram*" ficaram por causa do template do EmailJS; chat_app diz qual é
            chat_app: data.chat ? chatApp : "Telegram/Discord",
            telegram: data.chat ? (chatApp === "Telegram" ? `@${data.chat}` : data.chat) : "Not informed",
            telegram_link: !data.chat ? "https://www.bbagency.net" : chatApp === "Telegram" ? `https://t.me/${data.chat}` : "https://discord.com/app",
            company: data.company || "Not informed",
            topics: data.topics.join(" · ") || "Not specified",
            message: data.message,
          },
        }),
      });
      if (!r.ok) throw new Error("fail");
      setStatus("sent");
    } catch (e) {
      setErr(e instanceof Error && e.message !== "fail" ? e.message : "");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6 ${closing ? "cm-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-title"
    >
      {/* fundo escuro com desfoque */}
      <button type="button" aria-label="Close" onClick={close} className="cm-backdrop absolute inset-0 bg-ink/90 sm:bg-ink/80 sm:backdrop-blur-md" />

      <div className="cm-panel relative flex w-full max-w-2xl h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-navy ring-1 ring-white/15 sm:h-auto sm:max-h-[92dvh]">
        {/* manchas e retícula do deck */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* manchas feitas com gradiente (bem mais leve que blur no celular) */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(242,162,12,.45),transparent_65%)]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-44 -left-36 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(26,79,230,.55),transparent_65%)]" aria-hidden />
          <div className="halftone halftone-mark pointer-events-none absolute -right-6 top-24 hidden h-40 w-52 opacity-15 sm:block" aria-hidden />
        </div>

        {/* pixels que cobrem o painel e vão sumindo um a um */}
        {!pxDone && <div
          className="pointer-events-none absolute inset-0 z-20 grid [contain:strict]"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
          aria-hidden
        >
          {delays.map((d, i) => (
            <span key={i} className={`cm-px ${pxColor(i)}`} style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>}

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center bg-navy/60 ring-1 ring-white/20 transition hover:rotate-90 hover:bg-amber hover:text-ink hover:ring-amber"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-[1] min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-6 pb-10 sm:p-10">
          {status === "sent" ? (
            <div className="cm-in flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="relative">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className={`cm-burst absolute left-1/2 top-1/2 h-3 w-3 ${i % 3 === 0 ? "bg-amber" : i % 3 === 1 ? "bg-sky" : "bg-paper"}`}
                    style={{ ["--a" as string]: `${i * 30}deg` }}
                    aria-hidden
                  />
                ))}
                <div className="cm-pop grid h-20 w-20 place-items-center bg-amber text-ink">
                  <Check className="h-10 w-10" strokeWidth={3} />
                </div>
              </div>
              <h2 className="display mt-10 text-6xl sm:text-7xl">Message sent.</h2>
              <p className="grotesk mt-4 max-w-sm text-lg text-white/75">Thanks for reaching out. Our team will get back to you soon.</p>
              <button type="button" onClick={close} className="mt-8 bg-paper px-6 py-3 font-extrabold uppercase text-ink transition-colors hover:bg-amber">
                Back to site
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5 sm:space-y-6">
              <div className="cm-in" style={{ animationDelay: "380ms" }}>
                <span className="eyebrow text-amber">
                  <Image src="/img/logo-mark.png" alt="" width={18} height={13} className="mr-2 inline" />
                  Contact
                </span>
                <h2 id="contact-title" className="display mt-5 pr-12 text-5xl sm:pr-0 sm:text-7xl">
                  Start a <span className="text-amber">deal.</span>
                </h2>
                <p className="grotesk mt-3 max-w-md text-base text-white/70 sm:text-lg">Tell us about your brand or project and we&apos;ll match you with the right creators.</p>
              </div>

              <div className="grid gap-3 sm:gap-6 sm:grid-cols-2">
                <Field delay={460} label="Your name" name="name" required inputRef={firstField} autoComplete="name" />
                <div className="relative">
                  {/* escolhe onde a pessoa quer ser chamada */}
                  <div className="cm-in absolute right-0 -top-3 z-[1] flex gap-1" style={{ animationDelay: "520ms" }} role="radiogroup" aria-label="Contact app">
                    {([
                      ["Telegram", FaTelegramPlane],
                      ["Discord", FaDiscord],
                    ] as const).map(([app, Icon]) => (
                      <button
                        key={app}
                        type="button"
                        role="radio"
                        aria-checked={chatApp === app}
                        onClick={() => setChatApp(app)}
                        className={`inline-flex h-6 items-center gap-1 px-2 text-[10px] font-extrabold uppercase tracking-wider ring-1 transition-colors ${chatApp === app ? "bg-amber text-ink ring-amber" : "text-white/60 ring-white/25 hover:text-white hover:ring-white/60"}`}
                      >
                        <Icon className="h-3 w-3" /> {app}
                      </button>
                    ))}
                  </div>
                  <Field delay={520} label={`${chatApp} username`} name="chat" autoComplete="off" />
                </div>
                <Field delay={560} label="Email" name="email" type="email" autoComplete="email" />
                <Field delay={600} label="Company / brand" name="company" autoComplete="organization" />
                <p className="cm-in -mt-1 text-[11px] font-bold text-white/45 sm:col-span-2 sm:-mt-3" style={{ animationDelay: "620ms" }}>
                  Telegram/Discord or email: fill at least one so we can reach you.
                </p>
              </div>

              <fieldset className="cm-in" style={{ animationDelay: "640ms" }}>
                <legend className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-white/50">What&apos;s it about?</legend>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => {
                    const on = topics.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTopics((cur) => (on ? cur.filter((x) => x !== t) : [...cur, t]))}
                        className={`px-3 py-2 text-[11px] sm:px-4 sm:text-xs font-extrabold uppercase tracking-wider ring-1 transition-all active:scale-95 ${
                          on ? "bg-amber text-ink ring-amber" : "text-white/80 ring-white/25 hover:ring-white/60"
                        }`}
                      >
                        {on && <Check className="-ml-1 mr-1 inline h-3.5 w-3.5" strokeWidth={3} />}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="cm-in" style={{ animationDelay: "700ms" }}>
                <label className="cm-field block">
                  <textarea
                    name="message"
                    required
                    rows={4}
                    maxLength={MAX}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder=" "
                    className="peer grotesk w-full text-paper placeholder:text-transparent resize-none border-b-2 border-white/25 bg-transparent pb-2 pt-6 text-xl !leading-snug outline-none transition-colors focus:border-amber"
                  />
                  <span className="cm-label">Your message</span>
                </label>
                <div className="mt-1 text-right text-[11px] font-bold text-white/40 tabular-nums">
                  {msg.length}/{MAX}
                </div>
              </div>

              {/* isca escondida: gente não vê, robô preenche */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              {status === "error" && (
                <p className="cm-in text-sm text-amber-2" role="alert">
                  {err || "We couldn't send it right now."} You can also write to{" "}
                  <a className="underline" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("BB Agency – contact")}&body=${encodeURIComponent(msg)}`}>
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
              )}

              <div className="cm-in flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "760ms" }}>
                <a href={`mailto:${CONTACT_EMAIL}`} className="link-line self-start text-xs font-extrabold uppercase text-white/50 hover:text-white">
                  or email {CONTACT_EMAIL}
                </a>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-amber px-7 py-4 font-extrabold uppercase text-ink disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-out group-hover:translate-x-0" />
                  <span className="relative flex items-center gap-3">
                    {status === "sending" ? (
                      <>
                        Sending <Loader2 className="h-5 w-5 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send message <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  delay,
  autoComplete,
  inputRef,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  delay: number;
  autoComplete?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label className="cm-field cm-in block" style={{ animationDelay: `${delay}ms` }}>
      <input
        ref={inputRef}
        name={name}
        type={type}
        required={required}
        maxLength={200}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer grotesk w-full text-paper placeholder:text-transparent border-b-2 border-white/25 bg-transparent pb-2 pt-6 text-xl outline-none transition-colors focus:border-amber"
      />
      <span className="cm-label">
        {label}
        {required && <span className="text-amber"> *</span>}
      </span>
    </label>
  );
}

/** Botão laranja que abre o popup (usado no rodapé) */
export function ContactButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openContact}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-amber px-6 py-4 font-extrabold uppercase text-ink ${className}`}
    >
      <span className="absolute inset-0 translate-y-full bg-paper transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span className="relative flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping bg-ink/60" />
          <span className="relative inline-flex h-2.5 w-2.5 bg-ink" />
        </span>
        Send a message
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

/** Botão qualquer que abre o formulário (mesmo comportamento do "Let's talk" da navbar) */
export function OpenContact({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={openContact} className={className}>
      {children}
    </button>
  );
}
