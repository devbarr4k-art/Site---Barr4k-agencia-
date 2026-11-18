import type { Creator } from "@/lib/creators";
// Partes do site que o cliente edita sozinho pelo /admin (salvas no Vercel Blob).
export type Star = { name: string; role: string; tag: string; photo: string };
/** Patrocinador da faixa de Brands. h = altura da logo em px no PC, ratio = largura/altura do arquivo */
export type Brand = { name: string; logo: string; url: string; h: number; ratio: number };
export type Banner = { src: string; kind: "image" | "video" } | null;
export type SiteContent = {
  stars: Star[];
  brands: Brand[];
  /** lista do popup "See full roster" */
  creators: Creator[];
  frameworkText: string;
  /** 2 quadrados extras na colagem do In-house graphics (GIF/vídeo/imagem) */
  banners: Banner[];
};
export const BANNER_SLOTS = 2;
