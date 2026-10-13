import { NextResponse } from "next/server";
import { concierge } from "@/lib/ai";

const MAX_BODY_BYTES = 8_192;
const WINDOW_MS = 60_000;
const REQUESTS_PER_WINDOW = 30;
const recentRequests = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(req: Request) {
  // Vercel supplies x-real-ip at the edge. Local runs share one development bucket.
  return req.headers.get("x-real-ip")?.slice(0, 64) || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const existing = recentRequests.get(key);
  if (!existing || existing.resetAt <= now) {
    if (recentRequests.size >= 500) {
      for (const [ip, entry] of recentRequests) if (entry.resetAt <= now) recentRequests.delete(ip);
      if (recentRequests.size >= 500) recentRequests.delete(recentRequests.keys().next().value!);
    }
    recentRequests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  existing.count += 1;
  return existing.count > REQUESTS_PER_WINDOW;
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "A pergunta excede o limite permitido." }, { status: 413 });
  }

  let payload: unknown;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "A pergunta excede o limite permitido." }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Envie uma pergunta válida." }, { status: 400 });
  }

  const value = (payload as { query?: unknown } | null)?.query;
  if (typeof value !== "string") {
    return NextResponse.json({ error: "A pergunta precisa ser um texto." }, { status: 400 });
  }
  const query = value.trim().slice(0, 300);
  if (!query) return NextResponse.json({ answer: "", hits: [] });
  if (isRateLimited(rateLimitKey(req))) {
    return NextResponse.json({ error: "Muitas perguntas em pouco tempo. Tente novamente em um minuto." }, { status: 429 });
  }

  const hits = concierge(query);
  let answer = hits.length
    ? `Achei ${hits.length} opção(ões) disponíveis agora. A melhor: ${hits[0].title} — ${hits[0].reason.toLowerCase()}.`
    : "Não encontrei nada disponível com isso agora. Tente 'água', 'peixe', 'passeio tranquilo' ou 'quarto para hoje'.";

  const key = process.env.GEMINI_API_KEY;
  if (key && hits.length) {
    try {
      const prompt = `Você é o concierge de Caraíva (BA). Responda em até 2 frases, tom acolhedor, em português. Use SOMENTE estas opções reais, sem inventar preços ou vagas:\n${JSON.stringify(hits)}\nPergunta do turista: ${query}`;
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(8_000),
        cache: "no-store",
      });
      if (response.ok) {
        const result: unknown = await response.json();
        const candidate = (result as { candidates?: { content?: { parts?: { text?: unknown }[] } }[] })
          ?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof candidate === "string" && candidate.trim()) answer = candidate.slice(0, 600);
      }
    } catch {
      // Resposta local permanece disponível quando o serviço de IA falha ou excede o tempo.
    }
  }
  return NextResponse.json({ answer, hits }, { headers: { "Cache-Control": "no-store" } });
}
