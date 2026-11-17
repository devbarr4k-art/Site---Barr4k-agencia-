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
export const CREATORS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1NxQjusKuAPqO8r2ryOV7k76RyN8UZcYl2t6oMCxrU70/edit?gid=203520932#gid=203520932";
export const CONTACT_EMAIL = "contact@bbagency.gg";

export const team = [
  {
    name: "BOLTZ",
    photo: "/img/team/boltz-frame.png",
    bio: "Ricardo “boltz” Prass is a Brazilian CS:GO professional with over 10 years in the competitive scene, known for teams like SK and Immortals, winning multiple tier S titles. Today, he focuses on content creation and streaming, securing major CS gambling partnerships in Brazil.",
    socials: {
      twitch: "https://www.twitch.tv/boltz",
      youtube: "https://www.youtube.com/@boltz",
      x: "https://x.com/Boltz",
      instagram: "https://www.instagram.com/boltzcs/",
    },
  },
  {
    name: "BARR4K",
    photo: "/img/team/barr4k-frame-v3.png",
    bio: "João “barr4k” Scalamandre is a Twitch Partner streamer and car content YouTuber. He is also embedded in the partnerships sector for virtual casino and CS2 gambling platforms, leveraging a strong network and close relationships with major figures in the Brazilian scene.",
    socials: {
      twitch: "https://www.twitch.tv/barr4k",
      youtube: "https://www.youtube.com/@barr4k/",
      x: "https://x.com/jpbarrak",
      instagram: "https://www.instagram.com/barr4k/",
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
  // fotos de perfil da Twitch; "tag" = onde trabalhamos juntos (confirmar com o cliente)
  { name: "Luqueta", role: "Streamer", tag: "Twitch", photo: "/img/stars/luqueta-v2.jpg" },
  { name: "Coldzera", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/coldzera-v3.jpg" },
  { name: "FNX", role: "CS Legend", tag: "Counter-Strike", photo: "/img/stars/fnx-v3.jpg" },
  { name: "FKS", role: "Streamer", tag: "Twitch", photo: "/img/stars/fks-v2.jpg" },
  { name: "Gordox", role: "Streamer", tag: "Twitch", photo: "/img/stars/gordox-v2.jpg" },
  { name: "Zigueira", role: "Streamer", tag: "Twitch", photo: "/img/stars/zigueira-v3.jpg" },
];

// ratio = largura/altura do PNG; url = site da empresa ("#" = falta confirmar com o cliente)
export const brands = [
  { name: "Polymarket", logo: "/img/brands/polymarket.png", h: 30, ratio: 911 / 166, url: "https://polymarket.com" },
  { name: "1win", logo: "/img/brands/1win.svg", h: 44, ratio: 76 / 36, url: "https://1win.com" },
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
  { prefix: "+", value: 150, suffix: "", label: "Successful campaigns" },
  { prefix: "+", value: 90, suffix: "M", label: "Total followers" },
  { prefix: "+", value: 300, suffix: "M", label: "Monthly views" },
  { prefix: "+", value: 100, suffix: "", label: "Streamers" },
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

// Formulário de contato via EmailJS (emailjs.com, conta do Barr4k com o Gmail conectado).
// Os 3 códigos são públicos. Template HTML pra colar no EmailJS: email/emailjs-template.html
export const EMAILJS = {
  serviceId: "service_35rcixl",
  templateId: "template_7mfl0ts",
  publicKey: "ljbIGjpG_zjyCf8OW",
};
