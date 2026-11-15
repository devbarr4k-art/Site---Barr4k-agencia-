import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { FaTwitch, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import StarsCarousel from "@/components/StarsCarousel";
import CountUp from "@/components/CountUp";
import { Blobs, CornerCrosses, Cross, PixelCluster } from "@/components/Decor";
import { team, brands, stats, graphics, cases, CREATORS_SHEET_URL, CONTACT_EMAIL, navLinks } from "@/lib/data";

const wrap = "relative z-[2] mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-4 sm:px-6 lg:px-8";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Team />
        <Featured />
        <Brands />
        <Stats />
        <Framework />
        <Cases />
        <Creators />
      </main>
      <Footer />
    </>
  );
}

/* ───────────── HERO ───────────── */
function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink flex items-center">
      <Blobs variant="hero" />
      {/* BB gigante em pontinhos, como no slide 1 */}
      <div className="halftone halftone-mark absolute -left-[12vw] top-[8%] h-[95%] w-[80vw] opacity-60" aria-hidden />
      <CornerCrosses />

      <div className={`${wrap} grid gap-10 lg:grid-cols-12 items-center pt-28 pb-20`}>
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <span className="eyebrow text-amber">Streaming · CS · Partnerships</span>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-6 flex items-center gap-3 sm:gap-6">
              <Image src="/img/logo-mark.png" alt="BB" width={293} height={218} priority className="w-[24vw] sm:w-40 lg:w-48 h-auto" />
              <h1 className="display text-[19vw] sm:text-[9rem] lg:text-[11rem] leading-[0.8]">
                BB<sup className="text-[0.25em] align-top ml-1 not-italic font-sans">®</sup>
                <span className="block text-[0.62em]">Agency</span>
              </h1>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <p className="grotesk mt-8 max-w-md text-xl sm:text-2xl">
              Operating since 2024, we are an agency created within the streaming industry. Specializing in CS gambling.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#featured" className="inline-flex items-center gap-2 bg-paper text-ink px-6 py-3.5 font-extrabold uppercase text-sm hover:bg-amber transition-colors">
                View creators <ArrowDown className="h-4 w-4" />
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 border border-white/40 px-6 py-3.5 font-extrabold uppercase text-sm hover:border-white transition-colors">
                Get in touch <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] hidden sm:flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        Scroll <span className="h-10 w-px bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}

/* ───────────── TEAM ───────────── */
function Team() {
  const icons = { twitch: FaTwitch, youtube: FaYoutube, x: FaXTwitter, instagram: FaInstagram } as const;
  return (
    <section id="team" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="blob blob-amber drift-a" style={{ width: "50vw", height: "50vw", left: "-18vw", top: "-22vw" }} />
        <div className="blob blob-blue drift-b" style={{ width: "40vw", height: "40vw", right: "-14vw", top: "20%", opacity: 0.55 }} />
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
                <div className="relative shrink-0 sm:w-[46%]">
                  <PixelCluster variant="a" size={16} className="absolute -left-4 -top-4 z-10" />
                  <PixelCluster variant="b" size={16} className="absolute -right-4 -bottom-4 z-10" />
                  <div className="relative aspect-[4/5] overflow-hidden ring-1 ring-white/20 group">
                    <Image src={m.photo} alt={m.name} fill quality={90} sizes="(max-width:640px) 100vw, 300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-5xl font-black tracking-tight [font-stretch:80%]">{m.name}</h3>
                    <div className="mt-3 flex gap-3">
                      {(Object.keys(m.socials) as (keyof typeof icons)[]).map((k) => {
                        const Icon = icons[k];
                        return (
                          <a key={k} href={m.socials[k]} target="_blank" rel="noreferrer" aria-label={`${m.name} ${k}`} className="grid h-9 w-9 place-items-center border border-white/25 hover:bg-amber hover:text-ink hover:border-amber transition-colors">
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <p className="mt-6 font-serif text-lg leading-snug text-white/85 sm:text-xl">{m.bio}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Fundo azul do deck com mancha laranja (sem o cinza do degradê direto) */
function Glow({ flip = false }: { flip?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-royal via-navy-2 to-ink" />
      <div className="blob blob-amber drift-a" style={{ width: "60vw", height: "60vw", top: "-26vw", ...(flip ? { right: "-20vw" } : { left: "-22vw" }) }} />
      <div className="blob blob-blue drift-b" style={{ width: "50vw", height: "50vw", bottom: "-24vw", ...(flip ? { left: "-10vw" } : { right: "10vw" }), opacity: 0.6 }} />
    </div>
  );
}

/* ───────────── FEATURED (carrossel estilo neeve) ───────────── */
function Featured() {
  return (
    <section id="featured" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <Blobs variant="bottom" />
      <CornerCrosses />
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-5">
          <Reveal><span className="eyebrow">Featured</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-6 text-6xl sm:text-7xl xl:text-8xl">Stars that work with us</h2>
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
          <StarsCarousel />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── BRANDS ───────────── */
function Brands() {
  const row = [...brands, ...brands];
  return (
    <section id="brands" className="relative overflow-hidden py-24 lg:py-32 bg-royal">
      <Glow />
      <div className="halftone absolute inset-0 opacity-25 [mask-image:linear-gradient(90deg,black,transparent_70%)]" aria-hidden />
      <CornerCrosses />
      <div className={`${wrap} grid gap-12 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-6">
          <Reveal><span className="eyebrow">Brands</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-6 text-6xl sm:text-7xl lg:text-8xl">Companies that trusted our team:</h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grotesk mt-6 max-w-xs text-xl">Each partnership was designed for performance and visibility.</p>
          </Reveal>
        </div>
        <div className="lg:col-span-6 grid grid-cols-2 gap-x-8 gap-y-10 items-center">
          {brands.slice(0, 7).map((b, i) => (
            <Reveal key={b.name} delay={i * 60} className={i === 6 ? "col-span-2 sm:col-span-1" : ""}>
              <BrandLogo b={b} />
            </Reveal>
          ))}
          <Reveal delay={420} className="col-span-2 flex items-center gap-10">
            {brands.slice(7).map((b) => (
              <BrandLogo key={b.name} b={b} />
            ))}
          </Reveal>
        </div>
      </div>

      {/* Faixa rodando */}
      <div className="relative z-[2] mt-20 border-y border-white/20 bg-ink/40 py-6 backdrop-blur-sm overflow-hidden">
        <div className="marquee items-center gap-16 pr-16">
          {row.map((b, i) => (
            <BrandLogo key={i} b={b} maxH={36} hidden={i >= brands.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Logo branca que fica laranja no hover e leva pro site da empresa */
function BrandLogo({ b, maxH, hidden }: { b: (typeof brands)[number]; maxH?: number; hidden?: boolean }) {
  const h = maxH ? Math.min(b.h, maxH) : b.h;
  const external = b.url !== "#";
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
        className="block bg-white/90 transition-all duration-300 group-hover:bg-amber group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(242,162,12,0.55)] group-focus-visible:bg-amber"
        style={{
          height: h,
          width: h * b.ratio,
          WebkitMask: `url(${b.logo}) center / contain no-repeat`,
          mask: `url(${b.logo}) center / contain no-repeat`,
        }}
      />
    </a>
  );
}

/* ───────────── STATS ───────────── */
function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <Blobs variant="left" />
      <CornerCrosses />
      <div className={wrap}>
        <Reveal className="text-center">
          <span className="eyebrow">Stats</span>
          <p className="display normal-case mt-2 text-3xl">Numbers don&apos;t lie!</p>
        </Reveal>
        <div className="mt-16 grid gap-y-16 gap-x-10 sm:grid-cols-2">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120} className={`relative ${i % 2 ? "sm:text-left sm:pl-10" : "sm:text-right sm:pr-10"}`}>
              {/* número fantasma em pontinhos atrás */}
              <span className={`halftone-text pointer-events-none absolute -top-10 font-black text-[9rem] sm:text-[12rem] leading-none [font-stretch:75%] ${i % 2 ? "left-0" : "right-0"}`} aria-hidden>
                {s.value}
              </span>
              <div className="relative">
                {i >= 2 && <p className="display text-3xl sm:text-4xl">{s.label}</p>}
                <p className="font-black text-7xl sm:text-8xl lg:text-9xl tracking-tight [font-stretch:80%] leading-[0.9]">
                  {s.prefix}<CountUp to={s.value} />{s.suffix}
                </p>
                {i < 2 && <p className="display text-3xl sm:text-4xl">{s.label}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── FRAMEWORK ───────────── */
function Framework() {
  // posições medidas no slide do PDF (em % da área da colagem); z = quem fica na frente, como no slide
  const pos = [
    { left: "4.4%", top: "13.1%", width: "53.6%", z: 2 },
    { left: "46.7%", top: "0%", width: "53.3%", z: 3 },
    { left: "49.9%", top: "48.6%", width: "35.2%", z: 1 },
    { left: "0%", top: "62.8%", width: "44.8%", z: 1 },
  ];
  return (
    <section id="framework" className="relative overflow-hidden bg-ink py-24 lg:py-32">
      <Blobs variant="left" />
      <CornerCrosses />
      <div className={`${wrap} grid gap-16 lg:grid-cols-12 items-center`}>
        <div className="lg:col-span-5">
          <Reveal><span className="eyebrow">Framework</span></Reveal>
          <Reveal delay={100}>
            <h2 className="display mt-6 text-6xl sm:text-7xl lg:text-8xl">In-house <span className="block pl-[0.6em]">graphics</span></h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grotesk mt-8 max-w-sm text-xl text-white/85">
              We have an in-house media team of designers and editors who elevate brand and creator deals with cohesive, high-impact visual identities that extend campaigns beyond the stream.
            </p>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:col-span-7">
          <div className="relative mx-auto aspect-[698/846] w-full max-w-[540px]">
            {graphics.map((g, i) => (
              <div
                key={g.src}
                className="absolute transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.04] hover:!z-30 shadow-2xl shadow-black/70"
                style={{ left: pos[i].left, top: pos[i].top, width: pos[i].width, zIndex: pos[i].z }}
              >
                <Image src={g.src} alt={g.alt} width={600} height={600} quality={90} className="h-auto w-full ring-1 ring-white/70" />
              </div>
            ))}
            {/* quadradinhos brancos em volta, como no slide */}
            <PixelCluster variant="a" size={16} className="absolute left-[-5%] top-[10%] z-10" />
            <PixelCluster variant="c" size={16} className="absolute left-[36%] top-[-4%] z-10" />
            <PixelCluster variant="b" size={16} className="absolute right-[-5%] top-[2%] z-10" />
            <PixelCluster variant="a" size={16} className="absolute left-[80%] top-[70%] z-10" />
            <PixelCluster variant="b" size={16} className="absolute left-[-5%] top-[63%] z-10" />
            <PixelCluster variant="c" size={16} className="absolute left-[47%] top-[93%] z-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── CASES ───────────── */
function Cases() {
  return (
    <section id="cases" className="relative overflow-hidden py-24 lg:py-32 bg-royal">
      <Glow flip />
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
            <Reveal key={c.title} delay={i * 120} as="article" className={i === 1 ? "md:translate-y-10" : ""}>
              <div className="group h-full rounded-2xl border-2 border-white/80 bg-ink/50 p-3 backdrop-blur-sm transition-colors hover:bg-ink/80">
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
    <section id="creators" className="relative overflow-hidden bg-ink py-28 lg:py-40">
      <div className="halftone absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_65%)]" aria-hidden />
      <Blobs variant="bottom" />
      <CornerCrosses />
      <div className={`${wrap} flex flex-col items-center gap-12 md:flex-row md:justify-center md:gap-16`}>
        <Reveal className="max-w-xs md:text-right">
          <span className="eyebrow">Creators</span>
          <p className="grotesk mt-4 text-xl">Check the real time spreadsheet with all the streamers we manage.</p>
        </Reveal>
        <Reveal delay={150}>
          <a href={CREATORS_SHEET_URL} target="_blank" rel="noreferrer" className="group block">
            <span className="display normal-case block border-b-2 border-white pb-2 text-7xl sm:text-8xl transition-colors group-hover:text-amber group-hover:border-amber">
              click here!
            </span>
            <span className="relative mt-8 inline-block">
              <span className="grid h-36 w-36 place-items-center border-4 border-white bg-ink transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                <Image src="/img/logo-mark.png" alt="" width={96} height={72} />
              </span>
              <PixelCluster variant="c" size={22} className="absolute -bottom-20 left-20" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── FOOTER / CONTATO ───────────── */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy">
      <Blobs variant="right" />
      <div className={`${wrap} py-20`}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow text-amber">Contact</span>
            <h2 className="display mt-6 text-7xl sm:text-8xl lg:text-9xl">Let&apos;s talk.</h2>
            <p className="grotesk mt-6 max-w-md text-xl text-white/80">
              For brand partnerships, creator management, organizations and events.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-8 inline-flex items-center gap-3 bg-amber px-6 py-4 font-extrabold uppercase text-ink hover:bg-paper transition-colors">
              {CONTACT_EMAIL} <ArrowUpRight className="h-5 w-5" />
            </a>
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
