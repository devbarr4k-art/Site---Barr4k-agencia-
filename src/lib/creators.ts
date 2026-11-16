// Lista de creators: lida da planilha pública do Google (aba "Creators").
// O site mostra a planilha ao vivo; se ela falhar, usa a cópia em creators-snapshot.json.
import snapshot from "./creators-snapshot.json";

export type Creator = { name: string; twitch?: string; kick?: string; youtube?: string; instagram?: string };

export const SHEET_ID = "1NxQjusKuAPqO8r2ryOV7k76RyN8UZcYl2t6oMCxrU70";
export const SHEET_GID = "203520932";
export const fallbackCreators = snapshot as Creator[];

/** CSV simples com aspas */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const KINDS: [keyof Omit<Creator, "name">, string][] = [
  ["twitch", "twitch.tv"],
  ["kick", "kick.com"],
  ["youtube", "youtube.com"],
  ["instagram", "instagram.com"],
];

/** Colunas B-D trazem links soltos (às vezes trocados ou com "|"), então classifica pelo domínio */
export function rowsToCreators(rows: string[][]): Creator[] {
  const out: Creator[] = [];
  for (const r of rows.slice(1)) {
    const name = (r[0] || "").trim();
    if (!name) continue;
    const c: Creator = { name };
    for (const v of r.slice(1, 4)) {
      for (const u of (v || "").split("|").map((s) => s.trim())) {
        if (!/^https?:\/\//.test(u)) continue;
        const k = KINDS.find(([, d]) => u.includes(d));
        if (k && !c[k[0]]) c[k[0]] = u;
      }
    }
    out.push(c);
  }
  return out;
}

export async function loadCreators(): Promise<Creator[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error(`sheet ${r.status}`);
  const list = rowsToCreators(parseCsv(await r.text()));
  if (list.length < 5) throw new Error("sheet vazia");
  return list;
}
