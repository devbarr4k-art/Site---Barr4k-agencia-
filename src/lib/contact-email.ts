// E-mail que chega quando alguém manda o formulário, no visual do site: azul-noite,
// faixa com o degradê e a logo BB, título em serifa itálica e detalhes em laranja.
// Tudo em tabela + estilo inline, que é o que Gmail, Outlook e apps de celular entendem.

export type ContactLead = {
  name: string;
  email: string;
  company: string;
  topics: string[];
  message: string;
};

export const SITE_URL = "https://sitebarr4kagencia.vercel.app";

const c = {
  page: "#020a1c",
  card: "#06142e",
  box: "#0b1d40",
  line: "#1b2f5c",
  text: "#f3efe6",
  muted: "#9aa6c4",
  amber: "#f2a20c",
  royal: "#1a4fe6",
};

// Instrument Serif / Archivo quando o leitor aceita fonte web (Apple Mail, iOS); senão cai em serifa/sans parecidas
const serif = "'Instrument Serif',Georgia,'Times New Roman',serif";
const sans = "'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif";

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);

export function contactEmailHtml(lead: ContactLead) {
  const firstName = lead.name.split(" ")[0];
  const rows: [string, string, string?][] = [
    ["Name", lead.name],
    ["Email", lead.email, `mailto:${lead.email}`],
    ["Company", lead.company || "Not informed"],
  ];
  const chips = (lead.topics.length ? lead.topics : ["Not specified"])
    .map(
      (t) => `
      <td style="padding:0 8px 8px 0">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:${c.amber};padding:7px 12px;font-family:${sans};font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${c.page}">${esc(t)}</td>
        </tr></table>
      </td>`
    )
    .join("");
  const replySubject = encodeURIComponent("BB Agency – your contact");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;800&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<title>New deal</title>
</head>
<body style="margin:0;padding:0;background:${c.page}">
  <!-- prévia que aparece na lista de e-mails -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(lead.name)}${lead.company ? ` (${esc(lead.company)})` : ""}: ${esc(lead.message.slice(0, 90))}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.page}">
    <tr><td align="center" style="padding:28px 12px">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${c.card};border:1px solid ${c.line}">

        <!-- topo -->
        <tr><td style="padding:20px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td><img src="${SITE_URL}/img/logo-mark.png" width="44" alt="BB Agency" style="display:block;border:0;height:auto"></td>
            <td align="right" style="font-family:${sans};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${c.amber}">New contact</td>
          </tr></table>
        </td></tr>

        <!-- faixa com o degradê do site -->
        <tr><td style="line-height:0">
          <img src="${SITE_URL}/img/email-banner.jpg" width="600" alt="BB Agency" style="display:block;width:100%;max-width:600px;height:auto;border:0">
        </td></tr>

        <!-- título -->
        <tr><td style="padding:30px 28px 4px">
          <div style="font-family:${serif};font-size:50px;line-height:48px;font-style:italic;text-transform:uppercase;letter-spacing:-1.5px;color:${c.text}">Start a <span style="color:${c.amber}">deal.</span></div>
          <div style="margin-top:12px;font-family:${sans};font-size:16px;line-height:22px;font-weight:800;color:#c9d0e6">${esc(firstName)} wants to talk with BB Agency.</div>
        </td></tr>

        <!-- temas -->
        <tr><td style="padding:20px 28px 4px">
          <div style="margin-bottom:10px;font-family:${sans};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${c.muted}">What it's about</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${chips}</tr></table>
        </td></tr>

        <!-- dados -->
        <tr><td style="padding:12px 28px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.box};border:1px solid ${c.line}">
            ${rows
              .map(
                ([k, v, href], i) => `
            <tr>
              <td style="padding:14px 18px;${i ? `border-top:1px solid ${c.line};` : ""}font-family:${sans};font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${c.muted};width:110px">${k}</td>
              <td style="padding:14px 18px;${i ? `border-top:1px solid ${c.line};` : ""}font-family:${sans};font-size:15px;font-weight:800;color:${c.text}">${
                href ? `<a href="${esc(href)}" style="color:${c.amber};text-decoration:none">${esc(v)}</a>` : esc(v)
              }</td>
            </tr>`
              )
              .join("")}
          </table>
        </td></tr>

        <!-- mensagem -->
        <tr><td style="padding:24px 28px 0">
          <div style="font-family:${sans};font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:${c.amber}">&mdash;&nbsp; Message</div>
          <div style="margin-top:10px;padding:18px;background:${c.box};border-left:3px solid ${c.amber};font-family:${sans};font-size:15px;line-height:23px;color:${c.text};white-space:pre-wrap">${esc(lead.message)}</div>
        </td></tr>

        <!-- ação -->
        <tr><td style="padding:26px 28px 24px">
          <a href="mailto:${esc(lead.email)}?subject=${replySubject}" style="display:inline-block;background:${c.amber};color:${c.page};font-family:${sans};font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:15px 28px">Reply to ${esc(firstName)} &nearr;</a>
        </td></tr>

        <!-- rodapé -->
        <tr><td style="padding:18px 28px 24px;border-top:1px solid ${c.line};font-family:${sans};font-size:12px;line-height:18px;color:${c.muted}">
          Replying to this email goes straight to ${esc(lead.email)}.<br>
          <a href="${SITE_URL}" style="color:${c.amber};text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}</a>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

export function contactEmailText(lead: ContactLead) {
  return [
    "NEW CONTACT – BB AGENCY SITE",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "Not informed"}`,
    `Topics: ${lead.topics.join(", ") || "Not specified"}`,
    "",
    "Message:",
    lead.message,
  ].join("\n");
}
