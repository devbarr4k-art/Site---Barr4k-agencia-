import Image from "next/image";
import { stars } from "@/lib/data";

/** Faixa de cartas inclinadas rodando sozinha em loop infinito (para ao passar o mouse) */
export default function StarsCarousel() {
  // lista duplicada: quando a primeira metade sai da tela, a segunda está no mesmo lugar
  const loop = [...stars, ...stars];
  return (
    <div className="relative overflow-hidden py-10 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul className="marquee stars-marquee items-center gap-5 sm:gap-7 pr-5 sm:pr-7">
        {loop.map((s, i) => (
          <li
            key={i}
            aria-hidden={i >= stars.length}
            className={`group relative w-[200px] sm:w-[250px] shrink-0 transition-transform duration-500 hover:z-10 hover:scale-105 hover:rotate-0 ${
              i % 2 ? "rotate-2 translate-y-4" : "-rotate-2"
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-navy-2 ring-1 ring-white/25 group-hover:ring-2 group-hover:ring-amber shadow-2xl shadow-black/60">
              <Image
                src={s.photo}
                alt={s.name}
                fill
                sizes="(max-width:640px) 200px, 250px"
                quality={90}
                className="object-cover object-center scale-[1.12] transition-transform duration-700 group-hover:scale-[1.18]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-[10px] font-extrabold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Image src="/img/logo-mark.png" alt="" width={18} height={13} /> BB Agency
                </span>
                <span className="text-white/60">{String((i % stars.length) + 1).padStart(2, "0")}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="display normal-case text-4xl sm:text-5xl">{s.name}</h3>
                <p className="mt-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber">{s.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
