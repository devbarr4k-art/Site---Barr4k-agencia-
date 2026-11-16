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
    photo: "/img/team/boltz-v2.jpg",
    bio: "Ricardo “boltz” Prass is a Brazilian CS:GO professional with over 10 years in the competitive scene, known for teams like SK and Immortals, winning multiple tier S titles. Today, he focuses on content creation and streaming, securing major CS gambling partnerships in Brazil.",
    socials: { twitch: "#", youtube: "#", x: "#", instagram: "#" },
  },
  {
    name: "BARR4K",
    photo: "/img/team/barr4k-v2.jpg",
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
  { name: "Yuri22", role: "Creator", tag: "Streaming", photo: "/img/stars/yuri22-v2.jpg" },
  { name: "Jon Vlogs", role: "Creator · Host", tag: "All Stars League", photo: "/img/stars/jonvlogs-v2.jpg" },
  { name: "Coringa", role: "Streamer", tag: "Twitch", photo: "/img/stars/coringa-v2.jpg" },
  { name: "Fallen", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/fallen-v2.jpg" },
  { name: "Fer", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/fer-v2.jpg" },
  { name: "Boltz", role: "Ex-pro · Streamer", tag: "Counter-Strike", photo: "/img/stars/boltz-v3.jpg" },
];

// ratio = largura/altura do PNG; url = site da empresa ("#" = falta confirmar com o cliente)
export const brands = [
  { name: "CSGOBIG", logo: "/img/brands/csgobig.png", h: 34, ratio: 487 / 103, url: "https://csgobig.com" },
  { name: "Rain.gg", logo: "/img/brands/rain.png", h: 30, ratio: 482 / 93, url: "https://rain.gg" },
  { name: "Gamers Club", logo: "/img/brands/gamersclub.png", h: 26, ratio: 477 / 72, url: "https://gamersclub.com.br" },
  { name: "Degen.com", logo: "/img/brands/degen.png", h: 20, ratio: 472 / 49, url: "https://degen.com" },
  { name: "Clash.gg", logo: "/img/brands/clash.png", h: 30, ratio: 480 / 92, url: "https://clash.gg" },
  { name: "CSGOSKINS", logo: "/img/brands/csgoskins-v2.png", h: 21, ratio: 475 / 63, url: "https://csgoskins.gg" },
  { name: "Keydrop", logo: "/img/brands/keydrop.png", h: 36, ratio: 481 / 110, url: "https://key-drop.com" },
  { name: "paiN Gaming", logo: "/img/brands/pain-v2.png", h: 44, ratio: 149 / 101, url: "https://www.pain.gg/" },
  { name: "All Star League", logo: "/img/brands/allstar-v2.png", h: 58, ratio: 161 / 151, url: "https://www.instagram.com/allstarleague_cs/" },
  { name: "Gamdom", logo: "/img/brands/gamdom.png", h: 50, ratio: 115 / 145, url: "https://gamdom.com" },
];

export const stats = [
  { prefix: "+", value: 100, suffix: "", label: "Successful campaigns" },
  { prefix: "+", value: 90, suffix: "M", label: "Total followers" },
  { prefix: "+", value: 300, suffix: "M", label: "Monthly views" },
  { prefix: "+", value: 150, suffix: "", label: "Streamers" },
];

// Ordem = posição na colagem do Framework (igual ao slide do PDF)
export const graphics = [
  { src: "/img/gfx/skins-v3.jpg", alt: "Get exclusive skins campaign" },
  { src: "/img/gfx/degen-v3.png", alt: "Degen apparel campaign" },
  { src: "/img/gfx/cases-v3.jpg", alt: "New cases campaign" },
  { src: "/img/gfx/fallen-v3.png", alt: "Fallen x Zenith limited edition" },
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
