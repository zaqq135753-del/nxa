import { NextResponse } from "next/server";
import { parseIcs } from "@/lib/ical";

const MAX_REQUEST_BYTES = 4_096;
const MAX_ICS_BYTES = 500_000;
const ALLOWED_DOMAINS = ["airbnb.com", "airbnb.co.uk", "booking.com", "vrbo.com"];

function isAllowedHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return ALLOWED_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

async function readLimitedBody(response: Response, limit: number) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new Error("ICS_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(body);
}

export async function POST(req: Request) {
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "A solicitação excede o limite permitido." }, { status: 413 });
  }

  let payload: unknown;
  try {
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) {
      return NextResponse.json({ error: "A solicitação excede o limite permitido." }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Envie uma solicitação JSON válida." }, { status: 400 });
  }

  const value = (payload as { url?: unknown } | null)?.url;
  if (typeof value !== "string" || value.length > 2_048) {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  if (
    parsed.protocol !== "https:" ||
    !isAllowedHost(parsed.hostname) ||
    parsed.username ||
    parsed.password ||
    (parsed.port && parsed.port !== "443")
  ) {
    return NextResponse.json(
      { error: "Use o link iCal oficial do Airbnb, Booking ou Vrbo (https)." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(parsed, {
      headers: { "user-agent": "CaraivaDigital-PMS/1.0", accept: "text/calendar,text/plain;q=0.9" },
      redirect: "manual",
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });
    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json({ error: "O canal redirecionou o calendário. Copie o link iCal oficial atualizado." }, { status: 400 });
    }
    if (!response.ok) {
      return NextResponse.json({ error: `Canal respondeu ${response.status}` }, { status: 502 });
    }

    const declaredBodyLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredBodyLength > MAX_ICS_BYTES) {
      return NextResponse.json({ error: "O calendário excede o limite de 500 KB." }, { status: 413 });
    }

    const ics = await readLimitedBody(response, MAX_ICS_BYTES);
    return NextResponse.json({ blocks: parseIcs(ics) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "ICS_TOO_LARGE") {
      return NextResponse.json({ error: "O calendário excede o limite de 500 KB." }, { status: 413 });
    }
    return NextResponse.json({ error: "Não foi possível acessar o calendário agora." }, { status: 502 });
  }
}
