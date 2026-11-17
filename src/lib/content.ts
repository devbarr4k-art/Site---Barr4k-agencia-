import "server-only";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { stars as defaultStars } from "@/lib/data";
import { BANNER_SLOTS, type Banner, type SiteContent, type Star } from "@/lib/content-types";

const PATH = "site/content.json";
export const CONTENT_TAG = "site-content";
export const blobReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const DEFAULT_CONTENT: SiteContent = {
  stars: defaultStars.map(({ name, role, tag, photo }) => ({ name, role, tag, photo })),
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
  const banners: Banner[] = Array.from({ length: BANNER_SLOTS }, (_, i) => {
    const b = Array.isArray(r.banners) ? (r.banners[i] as Record<string, unknown> | null) : null;
    const src = b ? str(b.src, 400) : "";
    if (!src || !okUrl(src)) return null;
    return { src, kind: b?.kind === "video" ? "video" : "image" };
  });
  return {
    stars: stars.length ? stars : DEFAULT_CONTENT.stars,
    frameworkText: str(r.frameworkText, 600) || DEFAULT_CONTENT.frameworkText,
    banners,
  };
}

async function readFresh(): Promise<SiteContent> {
  if (!blobReady()) return DEFAULT_CONTENT;
  try {
    const res = await get(PATH, { access: "public", useCache: false });
    if (!res || res.statusCode !== 200) return DEFAULT_CONTENT;
    return sanitize(JSON.parse(await new Response(res.stream).text()));
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
