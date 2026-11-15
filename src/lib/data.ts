// Conteúdo do site (tirado do deck da BB Agency). Trocar aqui quando o cliente mandar os textos/fotos finais.

export const navLinks = [
  { label: "Featured", href: "#featured" },
  { label: "Brands", href: "#brands" },
  { label: "Stats", href: "#stats" },
  { label: "Creators", href: "#creators" },
  { label: "Framework", href: "#framework" },
  { label: "Cases", href: "#cases" },
];

// Link da planilha em tempo real com os streamers (pedir pro cliente)
export const CREATORS_SHEET_URL = "#";
export const CONTACT_EMAIL = "contact@bbagency.gg";

export const team = [
  {
    name: "BOLTZ",
    photo: "/img/team/boltz.jpg",
    bio: "Ricardo “boltz” Prass is a Brazilian CS:GO professional with over 10 years in the competitive scene, known for teams like SK and Immortals, winning multiple tier S titles. Today, he focuses on content creation and streaming, securing major CS gambling partnerships in Brazil.",
    socials: { twitch: "#", youtube: "#", x: "#", instagram: "#" },
  },
  {
    name: "BARR4K",
    photo: "/img/team/barr4k.jpg",
    bio: "João “barr4k” Scalamandre is a Twitch Partner streamer and car content YouTuber. He is also embedded in the partnerships sector for virtual casino and CS2 gambling platforms, leveraging a strong network and close relationships with major figures in the Brazilian scene.",
    socials: {
      twitch: "https://twitch.tv/barr4k",
      youtube: "https://www.youtube.com/@barr4k/",
      x: "https://x.com/jpbarrak",
      instagram: "https://instagram.com/barr4k",
    },
  },
];

export const stars = [
  { name: "Yuri22", role: "Creator", tag: "Streaming", photo: "/img/stars/yuri22.jpg" },
  { name: "Jon Vlogs", role: "Creator · Host", tag: "All Stars League", photo: "/img/stars/jonvlogs.jpg" },
  { name: "Coringa", role: "Streamer", tag: "Twitch", photo: "/img/stars/coringa.jpg" },
  { name: "Fallen", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/fallen.jpg" },
  { name: "Fer", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/fer.jpg" },
  { name: "Boltz", role: "Ex-pro · Streamer", tag: "Counter-Strike", photo: "/img/stars/boltz.jpg" },
];

export const brands = [
  { name: "CSGOBIG", logo: "/img/brands/csgobig.png", h: 34 },
  { name: "Rain.gg", logo: "/img/brands/rain.png", h: 30 },
  { name: "Gamers Club", logo: "/img/brands/gamersclub.png", h: 26 },
  { name: "Degen.com", logo: "/img/brands/degen.png", h: 20 },
  { name: "Clash.gg", logo: "/img/brands/clash.png", h: 30 },
  { name: "CSGOSKINS", logo: "/img/brands/csgoskins.png", h: 28 },
  { name: "Keydrop", logo: "/img/brands/keydrop.png", h: 36 },
  { name: "paiN Gaming", logo: "/img/brands/pain.png", h: 44 },
  { name: "All Star League", logo: "/img/brands/allstar.png", h: 58 },
  { name: "Partner", logo: "/img/brands/brand3.png", h: 46 },
];

export const stats = [
  { prefix: "+", value: 100, suffix: "", label: "Successful campaigns" },
  { prefix: "+", value: 90, suffix: "M", label: "Total followers" },
  { prefix: "+", value: 300, suffix: "M", label: "Monthly views" },
  { prefix: "+", value: 150, suffix: "", label: "Streamers" },
];

export const graphics = [
  { src: "/img/gfx/gfx-1.jpg", alt: "Get exclusive skins campaign" },
  { src: "/img/gfx/gfx-2.jpg", alt: "Degen apparel campaign" },
  { src: "/img/gfx/gfx-3.jpg", alt: "New cases campaign" },
  { src: "/img/gfx/gfx-4.jpg", alt: "Fallen x Zenith limited edition" },
];

export const cases = [
  {
    title: "Imperial welcomes CSGOSKINS sponsorship.",
    text: "Imperial Esports lands CSGOSKINS deal, gaining support to stay competitive on the international stage.",
    img: "/img/cases/case-imperial.jpg",
  },
  {
    title: "All Stars League announces CSGOBIG as gold sponsor.",
    text: "Influencers tournament All Stars League, hosted by Jon Vlogs, secures CSGOBIG sponsorship, boosting visibility and growth.",
    img: "/img/cases/case-allstars.jpg",
  },
  {
    title: "PAIN Gaming teams up with Keydrop.",
    text: "paiN Gaming adds Keydrop as sponsor, strengthening its brand ahead of upcoming CS tournaments.",
    img: "/img/cases/case-pain.jpg",
  },
];
