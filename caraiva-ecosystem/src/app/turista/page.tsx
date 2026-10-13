"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ArrowUpRight, 
  BedDouble, 
  Compass, 
  MapPin, 
  Nfc, 
  Sailboat, 
  ShoppingBag, 
  Sparkles, 
  Ticket 
} from "lucide-react";
import { useTagContext } from "@/components/useTagContext";
import { useStore } from "@/lib/store";
import type { Hit } from "@/lib/ai";

const SUGGESTIONS = [
  "Água e gelo na minha pousada",
  "Passeio tranquilo com crianças",
  "Moqueca de peixe fresca",
  "Protetor solar e farmácia",
  "Quarto vago para hoje",
];

function TouristHub() {
  const searchParams = useSearchParams();
  const tag = useTagContext(searchParams.get("tag"));
  const { orders, bookings } = useStore();
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ answer: string; hits: Hit[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    setQ(text);
    setLoading(true);
    try {
      const r = await fetch("/api/concierge", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }) 
      });
      const data = await r.json();
      setRes(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  const activeCount = orders.filter((o) => o.status !== "entregue" && o.status !== "recusado").length + bookings.length;

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      {/* Detecção da Plaquinha NFC com Ripple Glow */}
      {tag ? (
        <div className="relative overflow-hidden rounded-2xl border border-mata-400/40 bg-gradient-to-r from-mata-900/40 via-noite-800 to-noite-900 p-4 shadow-lg animate-rise">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-mata-400/20 text-mata-400">
              <Nfc size={18} />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-mata-400">Placa NFC Reconhecida</p>
              <p className="text-sm font-semibold text-areia-50">{tag.deliveryAddress}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-areia-300">
            Seus pedidos e entregas serão levados diretamente para este local na vila.
          </p>
        </div>
      ) : (
        <Link 
          href="/tag/flor-q04" 
          className="chip border-white/10 hover:border-coral-400/50 hover:bg-white/5 transition flex items-center justify-between w-full py-2.5 px-3.5"
        >
          <span className="flex items-center gap-2 text-xs">
            <Nfc size={14} className="text-coral-400" /> Simular toque na Plaquinha NFC da pousada
          </span>
          <span className="text-[10px] text-areia-300 font-mono">Testar →</span>
        </Link>
      )}

      {/* Título de Boas-Vindas */}
      <div className="mt-6">
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-areia-50">
          Bom dia em Caraíva.<br />
          <span className="text-areia-300 font-light">O que você precisa agora?</span>
        </h1>
      </div>

      {/* Campo do Concierge IA com Agent Elements */}
      <form 
        className="card mt-6 flex items-center gap-2 p-2 border-white/15 bg-white/[0.04] focus-within:border-coral-400 focus-within:ring-1 focus-within:ring-coral-400 transition" 
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) ask(q); }}
      >
        <Sparkles size={20} className="ml-2.5 shrink-0 text-coral-400" />
        <input 
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-areia-300/50 text-areia-50" 
          placeholder="Pergunte ao Concierge de Caraíva..." 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
        />
        <button 
          type="submit"
          className="btn-primary min-h-[40px] px-4 text-xs font-bold rounded-xl" 
          disabled={loading || !q.trim()}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Pílulas de Sugestão Rápida */}
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button 
            key={s} 
            className="chip hover:bg-white/10 hover:text-areia-50 text-[11px] py-1 px-3 transition" 
            onClick={() => ask(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Resultados do Concierge com Cards Ricos Inline */}
      {res && (
        <section className="mt-6 animate-rise space-y-3">
          <div className="card p-3.5 bg-mata-900/20 border-mata-400/30 text-xs text-areia-100 flex items-start gap-2">
            <Sparkles size={16} className="text-coral-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{res.answer}</p>
          </div>

          <div className="space-y-2">
            {res.hits.map((h) => (
              <Link 
                key={h.id} 
                href={h.href} 
                className="card p-3.5 flex items-center justify-between hover:border-coral-400/50 hover:bg-white/[0.05] transition group"
              >
                <div>
                  <p className="font-semibold text-sm text-areia-100 group-hover:text-coral-400 transition">{h.title}</p>
                  <p className="text-xs text-areia-300">{h.subtitle} · <span className="text-mata-400">{h.reason}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-areia-50">{h.price}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-coral-400 font-medium">
                    Acessar <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bento Grid Principal: 3 Verticais da Vila (UI/UX Pro Max) */}
      <section className="mt-8 grid grid-cols-3 gap-3">
        <Link 
          href="/turista/delivery" 
          className="card p-4 text-center hover:border-coral-400/60 hover:-translate-y-0.5 transition group bg-gradient-to-b from-coral-500/10 to-transparent"
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral-400/20 text-coral-400 group-hover:scale-110 transition">
            <ShoppingBag size={22} />
          </div>
          <span className="mt-3 block text-sm font-bold text-areia-50">Na Areia</span>
          <span className="text-[11px] text-areia-300 block mt-0.5">Delivery da Vila</span>
        </Link>

        <Link 
          href="/turista/pousadas" 
          className="card p-4 text-center hover:border-mata-400/60 hover:-translate-y-0.5 transition group bg-gradient-to-b from-mata-500/10 to-transparent"
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mata-400/20 text-mata-400 group-hover:scale-110 transition">
            <BedDouble size={22} />
          </div>
          <span className="mt-3 block text-sm font-bold text-areia-50">Onde Dormir</span>
          <span className="text-[11px] text-areia-300 block mt-0.5">Mini-PMS Booking</span>
        </Link>

        <Link 
          href="/turista/passeios" 
          className="card p-4 text-center hover:border-rio-400/60 hover:-translate-y-0.5 transition group bg-gradient-to-b from-rio-500/10 to-transparent"
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rio-400/20 text-rio-400 group-hover:scale-110 transition">
            <Sailboat size={22} />
          </div>
          <span className="mt-3 block text-sm font-bold text-areia-50">Passeios</span>
          <span className="text-[11px] text-areia-300 block mt-0.5">Buggy & Barco</span>
        </Link>
      </section>

      {/* Carteira e Acompanhamento de Pedidos */}
      <Link 
        href="/turista/carteira" 
        className="card mt-4 flex items-center justify-between p-4 hover:border-white/20 transition"
      >
        <span className="flex items-center gap-2.5 text-sm font-medium text-areia-100">
          <Ticket size={18} className="text-coral-400" /> 
          Meus pedidos em rota e vouchers de passeio
        </span>
        <span className="chip border-coral-400/30 text-coral-400 font-bold px-2.5 py-0.5">
          {activeCount}
        </span>
      </Link>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense>
      <TouristHub />
    </Suspense>
  );
}
