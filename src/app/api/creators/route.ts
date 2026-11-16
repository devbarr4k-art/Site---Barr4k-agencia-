import { fallbackCreators, loadCreators } from "@/lib/creators";

// A CDN da Vercel guarda a resposta por 10 min (e serve a antiga enquanto busca a nova),
// então a planilha é lida no máximo algumas vezes por hora.
export async function GET() {
  let creators = fallbackCreators;
  let source = "snapshot";
  try {
    creators = await loadCreators();
    source = "sheet";
  } catch (e) {
    console.error("[creators] usando cópia salva:", e);
  }
  return Response.json(
    { creators, source },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400" } }
  );
}
