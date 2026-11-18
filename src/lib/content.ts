import "server-only";
import { put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { stars as defaultStars } from "@/lib/data";
import { fallbackCreators, loadCreators, type Creator } from "@/lib/creators";
import { BANNER_SLOTS, type Banner, type SiteContent, type Star } from "@/lib/content-types";

const PATH = "site/content.json";
export const CONTENT_TAG = "site-content";
export const blobReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const DEFAULT_CONTENT: SiteContent = {
  stars: defaultStars.map(({ name, role, tag, photo }) => ({ name, role, tag, photo })),
  creators: fallbackCreators,
  frameworkText:
    "We have an in-house media team of designers and editors who elevate brand and creator deals with cohesive, high-impact visual identities that extend campaigns beyond the stream.",
  banners: Array(BANNER_SLOTS).fill(null),
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const okUrl = (v: string) => v.startsWith("/img/") || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(v);

/** Limpa o que veio do painel (ou do arquivo salvo) e completa com o padrão */
export function sanitize(raw: unknown): SiteContent {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const stars: Star[] = Array.isArray(r.stars)
    ? r.stars
        .map((s) => {
          const o = (s ?? {}) as Record<string, unknown>;
          return { name: str(o.name, 40), role: str(o.role, 40), tag: str(o.tag, 40), photo: str(o.photo, 400) };
        })
        .filter((s) => s.name && okUrl(s.photo))
        .slice(0, 40)
    : DEFAULT_CONTENT.stars;
  const link = (v: unknown) => {
    const u = str(v, 300);
    return /^https:\/\/\S+$/i.test(u) ? u : undefined;
  };
  const creators: Creator[] = Array.isArray(r.creators)
    ? r.creators
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          const photo = str(o.photo, 400);
          const c: Creator = { name: str(o.name, 60) };
          for (const k of ["twitch", "kick", "youtube", "instagram"] as const) {
            const u = link(o[k]);
            if (u) c[k] = u;
          }
          if (photo && okUrl(photo)) c.photo = photo;
          return c;
        })
        .filter((c) => c.name)
        .slice(0, 1000)
    : DEFAULT_CONTENT.creators;
  const banners: Banner[] = Array.from({ length: BANNER_SLOTS }, (_, i) => {
    const b = Array.isArray(r.banners) ? (r.banners[i] as Record<string, unknown> | null) : null;
    const src = b ? str(b.src, 400) : "";
    if (!src || !okUrl(src)) return null;
    return { src, kind: b?.kind === "video" ? "video" : "image" };
  });
  return {
    stars: stars.length ? stars : DEFAULT_CONTENT.stars,
    creators,
    frameworkText: str(r.frameworkText, 600) || DEFAULT_CONTENT.frameworkText,
    banners,
  };
}

/** https://<loja>.public.blob.vercel-storage.com/site/content.json */
function publicUrl() {
  const id = (process.env.BLOB_STORE_ID ?? "").replace(/^store_/, "") || (process.env.BLOB_READ_WRITE_TOKEN ?? "").split("_")[3];
  return `https://${id.toLowerCase()}.public.blob.vercel-storage.com/${PATH}`;
}

async function readFresh(): Promise<SiteContent> {
  if (!blobReady()) return DEFAULT_CONTENT;
  try {
    // o link público fica 60 s no cache da CDN; o ?v= força a versão que acabou de ser salva
    const res = await fetch(`${publicUrl()}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok && res.status !== 404) throw new Error(`blob ${res.status}`);
    const raw = res.ok ? await res.json() : {};
    const content = sanitize(raw);
    // ainda não salvou o roster pelo painel: pega a planilha mais recente
    if (!Array.isArray(raw.creators)) content.creators = await loadCreators().catch(() => fallbackCreators);
    return content;
  } catch (e) {
    console.error("[content] leitura falhou", e);
    return DEFAULT_CONTENT;
  }
}

/** Conteúdo do site; fica em cache até alguém salvar no /admin */
export const getContent = unstable_cache(readFresh, ["site-content-v1"], { tags: [CONTENT_TAG] });
export const getContentFresh = readFresh;

export async function saveContent(c: SiteContent) {
  await put(PATH, JSON.stringify(c), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}
