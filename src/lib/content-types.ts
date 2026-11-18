import type { Creator } from "@/lib/creators";
// Partes do site que o cliente edita sozinho pelo /admin (salvas no Vercel Blob).
export type Star = { name: string; role: string; tag: string; photo: string };
export type Banner = { src: string; kind: "image" | "video" } | null;
export type SiteContent = {
  stars: Star[];
  /** lista do popup "See full roster" */
  creators: Creator[];
  frameworkText: string;
  /** 2 quadrados extras na colagem do In-house graphics (GIF/vídeo/imagem) */
  banners: Banner[];
};
export const BANNER_SLOTS = 2;
