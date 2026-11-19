import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { FaTwitch, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import StarsCarousel from "@/components/StarsCarousel";
import ContactModal, { ContactButton, OpenContact } from "@/components/ContactModal";
import CreatorsModal, { CreatorsButton } from "@/components/CreatorsModal";
import ScrollFx from "@/components/ScrollFx";
import SmoothScroll from "@/components/SmoothScroll";
import StackFx from "@/components/StackFx";
import StatsScene from "@/components/StatsScene";
import { CornerCrosses, Cross } from "@/components/Decor";
import { team, CONTACT_EMAIL, navLinks } from "@/lib/data";
import { getContent } from "@/lib/content";
import type { Brand, Case, SiteContent } from "@/lib/content-types";

const wrap = "relative z-[2] mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8";

export default async function Home() {
  const content = await getContent();
  return (
    <>
      <Navbar />
      <ContactModal />
      <CreatorsModal creators={content.creators} />
      <SmoothScroll />
      <StackFx />
      <main id="top">
        <Hero />
        <Team />
        <Featured content={content} />
        <Brands brands={content.brands} />
        <Stats />
        <Framework content={content} />
        <Cases cases={content.cases} />
        <Creators />
      </main>
      <Footer />
    </>
  );
}

/* ───────────── HERO ───────────── */
function Hero() {
  return (
    <section data-stack className="relative min-h-[100svh] overflow-hidden bg-ink flex items-center">
      <SlideBg n={1} />
      {/* BB gigante em pontinhos, como no slide 1 */}
      <div className="halftone halftone-mark pointer-events-none absolute -left-[14vw] top-[6%] h-[96%] w-[64vw] opacity-45 max-lg:opacity-20" aria-hidden />
      <CornerCrosses />

      <div className={`${wrap} grid gap-10 lg:grid-cols-12 items-center pt-28 pb-20`}>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <span className="eyebrow text-amber">Streaming · CS · Partnerships</span>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 flex items-center gap-3 sm:gap-6">
              <Image src="/img/logo-mark.png" alt="BB" width={293} height={218} priority className="w-[24vw] sm:w-40 lg:w-48 h-auto" />
              <h1 className="font-serif italic uppercase tracking-[-0.04em] text-[15vw] sm:text-[7rem] lg:text-[8.5rem] leading-[0.82]">
                BB<sup className="ml-3 align-[0.15em] text-[0.36em] not-italic">®</sup>
                <span className="block">Agency</span>
              </h1>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <p className="grotesk mt-8 max-w-md text-xl sm:text-2xl">
              Operating since 2021, we are an agency created within the streaming industry. Specializing in CS gambling.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#featured" className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-extrabold uppercase text-sm hover:bg-amber transition-colors">
                View creators <ArrowDown className="h-4 w-4" />
              </a>
              <OpenContact className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 font-extrabold uppercase text-sm hover:border-white transition-colors">
                Get in touch <ArrowUpRight className="h-4 w-4" />
              </OpenContact>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────── TEAM ───────────── */
function Team() {
  const icons = { twitch: FaTwitch, youtube: FaYoutube, x: FaXTwitter, instagram: FaInstagram } as const;
  return (
    <section id="team" data-stack className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <SlideBg n={2} />
      </div>
      <CornerCrosses />
      <div className={wrap}>
        <Reveal>
          <h2 className="display normal-case text-6xl sm:text-7xl lg:text-8xl flex items-end gap-3 flex-wrap">
            the team <span className="block">behind</span>
            <Image src="/img/logo-mark.png" alt="BB" width={90} height={67} className="w-16 sm:w-20 mb-2" />
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-12">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 150}>
              <article className={`flex flex-col gap-6 sm:flex-row ${i === 1 ? "lg:mt-24" : ""}`}>
                {/* foto já com a moldura em degraus e os quadradinhos do PDF (fundo transparente) */}
                <div className="group relative shrink-0 sm:w-[52%]">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    width={1030}
                    height={1356}
                    quality={90}
                    sizes="(max-width:640px) 100vw, 340px"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-5xl font-black tracking-tight">{m.name}</h3>
                    <div className="mt-3 flex gap-4">
                      {(Object.keys(m.socials) as (keyof typeof icons)[]).map((k) => {
                        const Icon = icons[k];
                        return (
                          <a key={k} href={m.socials[k]} target="_blank" rel="noreferrer" aria-label={`${m.name} ${k}`} className={`text-white transition-colors ${i === 0 ? "hover:text-royal" : "hover:text-amber"}`}>
                            <Icon className="h-6 w-6" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <p className="mt-6 font-serif text-xl leading-[1.02] text-white [hyphens:auto] text-justify sm:text-2xl" lang="en">{m.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fundo de cada seção = degradê tirado do slide correspondente do PDF (public/img/bg/sN.jpg) */
function SlideBg({ n, flip = false }: { n: number; flip?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/img/bg/s${n}-v2.jpg)`, transform: flip ? "scaleX(-1)" : undefined }}
      />
      <div className="grain grain-soft" />
    </div>
  );
}


/* ───────────── FEATURED (carrossel estilo neeve) ───────────── */
function Featured({ content }: { content: SiteContent }) {
  return (
    <section id="featured" data-stack className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <SlideBg n={3} />
      <CornerCrosses />
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-5">
          <Reveal><span className="eyebrow">Featured</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-6 text-6xl sm:text-7xl xl:text-8xl">Stars we have worked with</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grotesk mt-8 max-w-sm text-xl text-white/85">
              Each personality has a clear positioning, a strong identity, and connection with the audience. Featuring hundreds of talented names.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <a href="#creators" className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold uppercase text-amber link-line">
              See full roster <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          <StarsCarousel stars={content.stars} />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── BRANDS ───────────── */
function Brands({ brands }: { brands: Brand[] }) {
  const row = [...brands, ...brands];
  return (
    <section id="brands" data-stack className="relative overflow-hidden py-24 lg:py-32 bg-royal">
      <SlideBg n={4} />
      {/* "b" gigante de mini "b", na mesma posição e proporção do slide de Brands */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="halftone halftone-mark halftone-stretch pointer-events-none absolute left-[4%] -top-[35%] h-[170%] w-[44%] opacity-85 max-lg:left-[-20%] max-lg:w-[120%] max-lg:opacity-35" aria-hidden />
      </div>
      <CornerCrosses />
      <div className={`${wrap} grid gap-12 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-6 lg:col-start-6 lg:text-right">
          <Reveal><span className="eyebrow lg:mr-[52%]">Brands</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-3 text-6xl sm:text-7xl lg:text-[5.2rem] [text-shadow:0_2px_24px_rgba(2,10,28,.35)]">Companies that trusted our team:</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grotesk mt-3 text-xl lg:ml-auto lg:max-w-[24rem] lg:text-2xl lg:leading-[1.05]">Each partnership was designed for performance and visibility.</p>
          </Reveal>
        </div>
      </div>

      {/* Faixa rodando (para com o mouse em cima pra clicar na marca) */}
      <div className="relative z-[2] mt-16 border-y border-white/20 bg-ink/40 py-8 backdrop-blur-sm overflow-hidden">
        <div className="marquee brands-marquee items-center gap-20 pr-20">
          {row.map((b, i) => (
            <BrandLogo key={i} b={b} maxH={46} hidden={i >= brands.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Logo branca que fica laranja no hover e leva pro site da empresa */
function BrandLogo({ b, maxH, hidden }: { b: Brand; maxH?: number; hidden?: boolean }) {
  const h = maxH ? Math.min(b.h, maxH) : b.h;
  const external = !!b.url && b.url !== "#";
  return (
    <a
      href={b.url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={b.name}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className="group inline-block py-1"
    >
      <span
        className="block h-[calc(var(--h)*0.72)] sm:h-[var(--h)] bg-white/90 transition-all duration-300 group-hover:bg-amber group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(242,162,12,0.55)] group-focus-visible:bg-amber"
        style={{
          // no celular a logo fica 72% do tamanho (cabe nas 2 colunas)
          ["--h" as string]: `${h}px`,
          aspectRatio: b.ratio,
          WebkitMask: `url(${b.logo}) center / contain no-repeat`,
          mask: `url(${b.logo}) center / contain no-repeat`,
        }}
      />
    </a>
  );
}

/* ───────────── STATS (presa na tela, números entram com a rolagem) ───────────── */
function Stats() {
  return (
    <section id="stats" data-stack data-anchor-end className="relative bg-ink">
      {/* fundo preso junto com o conteúdo (a seção é bem mais alta que a tela) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="relative overflow-hidden sm:sticky sm:top-0 sm:h-[100svh] max-sm:absolute max-sm:inset-0">
          <SlideBg n={5} />
          <CornerCrosses />
        </div>
      </div>
      <div className={wrap}>
        <StatsScene>
          <Reveal className="text-center">
            <span className="eyebrow">Stats</span>
            <p className="display normal-case mt-2 text-3xl">Numbers don&apos;t lie!</p>
          </Reveal>
        </StatsScene>
      </div>
    </section>
  );
}

/* ───────────── FRAMEWORK ───────────── */
function Framework({ content }: { content: SiteContent }) {
  return (
    <section id="framework" data-stack className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <SlideBg n={6} />
      <CornerCrosses />
      <div className={`${wrap} grid gap-16 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-5">
          <Reveal><span className="eyebrow">Framework</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-6 text-6xl sm:text-7xl lg:text-8xl">In-house <span className="block pl-[0.6em]">graphics</span></h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grotesk mt-8 max-w-sm whitespace-pre-line text-xl text-white/85">{content.frameworkText}</p>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          {/* colagem fixa, recortada do slide do PDF (artes, bordas e quadradinhos exatamente como lá) */}
          <ScrollFx>
            <div className="relative mx-auto w-full max-w-[600px]">
              <Image
                src="/img/framework-collage.png"
                alt="Campaign graphics made by our in-house team"
                width={1544}
                height={1840}
                quality={90}
                sizes="(max-width:1024px) 92vw, 600px"
                className="h-auto w-full"
              />
            </div>
          </ScrollFx>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── CASES ───────────── */
function Cases({ cases }: { cases: Case[] }) {
  return (
    <section id="cases" data-stack className="relative overflow-hidden py-24 lg:py-32 bg-royal">
      <SlideBg n={7} />
      <div className="halftone halftone-mark pointer-events-none absolute -right-[10%] top-[30%] h-[80%] w-[55%] opacity-35" aria-hidden />
      <CornerCrosses />
      <div className={wrap}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal><span className="eyebrow">Cases</span></Reveal>
            <Reveal delay={100}>
              <h2 className="display mt-6 text-6xl sm:text-7xl lg:text-8xl normal-case">ORGs and <span className="block uppercase">Events</span></h2>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="grotesk max-w-sm text-xl">
              We manage CS organizations and build tournaments that connect brands, players, and audiences with real results.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={`${i}-${c.title}`} delay={(i % 3) * 120} as="article" className={i % 3 === 1 ? "md:translate-y-10" : ""}>
              <div className="group h-full rounded-2xl border-[3px] border-white bg-white/10 p-3 backdrop-blur-[2px] transition-colors hover:bg-white/20">
                <div className="relative aspect-[16/8] overflow-hidden rounded-xl">
                  <Image src={c.img} alt="" fill quality={90} sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <h3 className="mt-4 px-1 text-2xl font-black leading-tight [font-stretch:80%]">{c.title}</h3>
                <p className="mt-2 px-1 pb-2 text-sm text-white/75">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── CREATORS (planilha) ───────────── */
function Creators() {
  return (
    <section id="creators" data-stack className="relative overflow-hidden bg-ink py-28 lg:py-40">
      <SlideBg n={8} />
      <div className="halftone halftone-mark pointer-events-none absolute -right-[6%] -top-[4%] h-[110%] w-[60%] opacity-30" aria-hidden />
      <CornerCrosses />
      <div className={`${wrap} flex flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16`}>
        <Reveal className="max-w-xs md:text-right">
          <span className="eyebrow">Creators</span>
          <p className="grotesk mt-4 text-xl">Check the real-time spreadsheet with all the streamers we can fit into your product.</p>
        </Reveal>
        <Reveal delay={150}>
          <CreatorsButton className="group block text-left">
            <span className="display normal-case block border-b-2 border-white pb-2 text-7xl sm:text-8xl transition-colors group-hover:text-amber group-hover:border-amber">
              click here!
            </span>
            {/* caixa do logo + quadradinhos, iguais ao PDF */}
            <span className="mt-6 block w-[230px] sm:w-[300px] transition-transform duration-500 group-hover:-rotate-2 group-hover:scale-[1.03]">
              <Image src="/img/creators-box.png" alt="" width={660} height={720} className="h-auto w-full" />
            </span>
          </CreatorsButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── FOOTER / CONTATO ───────────── */
function Footer() {
  return (
    <footer data-stack className="relative overflow-hidden border-t border-white/10 bg-navy">
      <SlideBg n={1} flip />
      <div className={`${wrap} py-20`}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow text-amber">Contact</span>
            <h2 className="display mt-6 text-7xl sm:text-8xl lg:text-9xl">Let&apos;s talk.</h2>
            <p className="grotesk mt-6 max-w-md text-xl text-white/80">
              For brand partnerships, creator management, organizations and events.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ContactButton />
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center gap-3 px-6 py-4 font-extrabold uppercase ring-1 ring-white/30 hover:bg-paper hover:text-ink hover:ring-paper transition-colors">
                {CONTACT_EMAIL} <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 grid grid-cols-2 gap-8 content-end">
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-line text-sm font-extrabold uppercase text-white/70 hover:text-white">{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-end justify-end gap-3">
              <Cross />
              <Image src="/img/logo-mark.png" alt="BB Agency" width={110} height={82} />
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} BB Agency. All rights reserved.</span>
          <span>Brands shown are partners. +18 · Play responsibly.</span>
        </div>
      </div>
    </footer>
  );
}
