// Motor iCal (RFC 5545) — a "API" que Booking e Airbnb aceitam.
// Importa bloqueios dos links .ics dos canais e exporta as reservas do Caraíva Digital.

export interface Block {
  uid: string;
  start: string; // YYYY-MM-DD (inclusive)
  end: string; // YYYY-MM-DD (exclusive = dia do checkout)
  summary: string;
  source: "airbnb" | "booking" | "caraiva" | "manual" | "outro";
}

const toISO = (v: string) => `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;

function detectSource(text: string): Block["source"] {
  const t = text.toLowerCase();
  if (t.includes("airbnb")) return "airbnb";
  if (t.includes("booking")) return "booking";
  if (t.includes("caraiva")) return "caraiva";
  return "outro";
}

export function parseIcs(ics: string): Block[] {
  // Desdobra linhas continuadas (RFC 5545 §3.1)
  const lines = ics.replace(/\r\n[ \t]/g, "").split(/\r?\n/);
  const blocks: Block[] = [];
  let cur: Partial<Block> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") cur = {};
    else if (line === "END:VEVENT" && cur) {
      if (cur.start && cur.end) blocks.push({ uid: cur.uid ?? crypto.randomUUID(), summary: cur.summary ?? "Bloqueado", source: detectSource(`${cur.uid} ${cur.summary}`), start: cur.start, end: cur.end });
      cur = null;
    } else if (cur) {
      const [rawKey, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const key = rawKey.split(";")[0];
      if (key === "DTSTART") cur.start = toISO(value);
      if (key === "DTEND") cur.end = toISO(value);
      if (key === "UID") cur.uid = value;
      if (key === "SUMMARY") cur.summary = value;
    }
  }
  return blocks;
}

export function buildIcs(roomName: string, blocks: Block[]): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ev = blocks.map((b) => [
    "BEGIN:VEVENT",
    `UID:${b.uid}@caraivadigital`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${b.start.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${b.end.replace(/-/g, "")}`,
    `SUMMARY:Caraiva Digital - ${b.summary}`,
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Caraiva Digital//PMS//PT-BR", `X-WR-CALNAME:${roomName}`, ...ev, "END:VCALENDAR"].join("\r\n");
}

/** Dia está ocupado se start <= dia < end. */
export const isBlocked = (day: string, blocks: Block[]) => blocks.find((b) => b.start <= day && day < b.end);

/** Conflito de overbooking entre um novo intervalo e os bloqueios existentes. */
export const overlaps = (start: string, end: string, blocks: Block[]) => blocks.some((b) => start < b.end && b.start < end);
