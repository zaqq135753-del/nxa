"use client";
import { useState, useEffect } from "react";
import { 
  Bike, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Volume2, 
  Smartphone, 
  Send, 
  Waves, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowRight,
  TrendingUp,
  Package
} from "lucide-react";
import { brl, ZONES, establishments, byId } from "@/lib/data";
import { useStore, beep, type Order } from "@/lib/store";

interface ActiveDelivery {
  id: string;
  orderId: string;
  merchantName: string;
  merchantAddress: string;
  customerAddress: string;
  cargoDesc: string;
  feeCents: number; // taxa que vai pro entregador
  status: "disponivel" | "coletando" | "em_rota" | "concluido";
  acceptedAt?: number;
}

export default function EntregadorAppPage() {
  const { orders, updateOrder } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vehicle, setVehicle] = useState<"carrinho" | "fatbike" | "charrete">("carrinho");

  // Entregas ativas do dia
  const [activeRuns, setActiveRuns] = useState<ActiveDelivery[]>([
    {
      id: "run-101",
      orderId: "#482",
      merchantName: "Depósito Gelo & Bebidas",
      merchantAddress: "Rua do Beira-Rio, próx. ao Píer",
      customerAddress: "Pousada Flor de Caraíva · Bangalô Coqueiro",
      cargoDesc: "2 fardos de água mineral + 1 saco de gelo 5kg (~18kg)",
      feeCents: 1500, // R$ 15,00
      status: "disponivel",
    },
  ]);

  // Estatísticas acumuladas da demo
  const [todayDeliveries, setTodayDeliveries] = useState(6);
  const [todayPixCents, setTodayPixCents] = useState(9000); // R$ 90,00

  // Se houver pedidos novos no store geral, sugere corrida
  useEffect(() => {
    const unassigned = orders.filter((o) => o.status === "novo" || o.status === "preparando");
    if (unassigned.length > 0 && isOnline) {
      const top = unassigned[0];
      const merchant = byId(establishments, top.establishmentId);
      const exists = activeRuns.some((r) => r.orderId === top.id);
      if (!exists) {
        if (soundEnabled) beep();
        setActiveRuns((prev) => [
          {
            id: `run-${Math.floor(100 + Math.random() * 899)}`,
            orderId: top.id,
            merchantName: merchant?.name || "Comércio Caraíva",
            merchantAddress: "Centro da Vila / Areia",
            customerAddress: top.address,
            cargoDesc: top.items.map((i) => `${i.qty}x ${i.name}`).join(", "),
            feeCents: top.split.courier || 1500,
            status: "disponivel",
          },
          ...prev,
        ]);
      }
    }
  }, [orders, isOnline, soundEnabled]);

  // Ações de fluxo de corrida
  const handleAcceptRun = (runId: string) => {
    if (soundEnabled) beep();
    setActiveRuns((prev) =>
      prev.map((r) => (r.id === runId ? { ...r, status: "coletando", acceptedAt: Date.now() } : r))
    );
  };

  const handleCollected = (runId: string, orderId: string) => {
    setActiveRuns((prev) =>
      prev.map((r) => (r.id === runId ? { ...r, status: "em_rota" } : r))
    );
    updateOrder(orderId, { status: "em_rota" });
  };

  const handleDelivered = (runId: string, orderId: string, fee: number) => {
    setActiveRuns((prev) =>
      prev.map((r) => (r.id === runId ? { ...r, status: "concluido" } : r))
    );
    updateOrder(orderId, { status: "entregue" });
    setTodayDeliveries((c) => c + 1);
    setTodayPixCents((c) => c + fee);
  };

  // Simular chamada de corrida instantânea para testar na frente do cliente
  const handleSimulateDispatch = () => {
    beep();
    const newRun: ActiveDelivery = {
      id: `run-${Math.floor(200 + Math.random() * 700)}`,
      orderId: `#${Math.floor(500 + Math.random() * 499)}`,
      merchantName: "Mercadinho da Barra",
      merchantAddress: "Beco da Igrejinha s/n",
      customerAddress: "Casa de Aluguel Beira-Mar (Rua da Praia)",
      cargoDesc: "1 engradado cerveja + carvão 4kg",
      feeCents: 1500,
      status: "disponivel",
    };
    setActiveRuns((prev) => [newRun, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 pb-safe text-slate-100 font-sans overflow-x-hidden">
      {/* Top Header Mobile-First Outdoor Friendly */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
              <Bike size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-wide">ENTREGADOR CARAÍVA</h1>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-black text-amber-300">
                  AREIA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Tonho do Carrinho · ID #C-04</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                isOnline
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-slate-950 animate-ping" : "bg-slate-500"}`} />
              {isOnline ? "ONLINE NA AREIA" : "EM PAUSA"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-lg px-4 pt-4 space-y-4">
        {/* Banner de Maré & Alerta da Vila */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-500/30 bg-sky-950/40 p-3.5 text-xs text-sky-200">
          <Waves size={18} className="shrink-0 text-sky-400 mt-0.5" />
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <strong className="text-sky-100 font-bold">Condição da Areia Hoje</strong>
              <span className="text-[10px] text-sky-300">Maré baixa: 11:20</span>
            </div>
            <p className="text-[11px] text-sky-200/80 leading-relaxed">
              Areia da beira-rio firme para carrinhos até às 14h. Após isso, subida de maré exige rota do interior pelo Beco do Forró.
            </p>
          </div>
        </div>

        {/* Card de Faturamento Pix do Dia */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Saldo Pix Recebido Hoje</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <TrendingUp size={13} /> Repasse Instantâneo
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-black text-white tracking-tight">{brl(todayPixCents)}</p>
              <span className="text-[11px] text-slate-400 font-medium">
                {todayDeliveries} corridas concluídas hoje
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Veículo Ativo</span>
              <div className="mt-1 flex gap-1">
                {(["carrinho", "fatbike", "charrete"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVehicle(v)}
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase transition ${
                      vehicle === v
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {v === "carrinho" ? "Carrinho" : v === "fatbike" ? "Fat Bike" : "Charrete"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Demonstração (Para mostrar ao cliente) */}
        <div className="flex gap-2">
          <button
            onClick={handleSimulateDispatch}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/30 active:scale-95 transition"
          >
            <Sparkles size={15} /> Simular Chamada de Corrida (+ Som)
          </button>
          <button
            onClick={() => {
              beep();
              setSoundEnabled(!soundEnabled);
            }}
            className={`min-h-[44px] px-3 rounded-xl border flex items-center justify-center text-xs font-semibold ${
              soundEnabled ? "border-slate-700 bg-slate-800 text-white" : "border-slate-800 bg-slate-900 text-slate-500"
            }`}
          >
            <Volume2 size={16} />
          </button>
        </div>

        {/* Feed de Corridas Ativas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Despacho de Pedidos ({activeRuns.filter((r) => r.status !== "concluido").length})
            </h2>
            <span className="text-[11px] text-slate-500">Demonstração local · sem sincronização</span>
          </div>

          {activeRuns
            .filter((r) => r.status !== "concluido")
            .map((run) => (
              <div
                key={run.id}
                className={`overflow-hidden rounded-2xl border transition shadow-xl ${
                  run.status === "disponivel"
                    ? "border-amber-500/60 bg-gradient-to-b from-amber-950/40 to-slate-900 ring-2 ring-amber-500/30 animate-in fade-in"
                    : run.status === "coletando"
                    ? "border-sky-500/60 bg-slate-900"
                    : "border-emerald-500/60 bg-slate-900"
                }`}
              >
                {/* Header do Card */}
                <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-white">{run.orderId}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        run.status === "disponivel"
                          ? "bg-amber-500 text-slate-950 animate-pulse"
                          : run.status === "coletando"
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {run.status === "disponivel"
                        ? "🚨 NOVA CORRIDA"
                        : run.status === "coletando"
                        ? "IR BUSCAR NO LOCAL"
                        : "LEVAR AO CLIENTE"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Seu Ganho Pix:</span>
                    <p className="text-base font-black text-emerald-400">{brl(run.feeCents)}</p>
                  </div>
                </div>

                {/* Conteúdo da Rota na Vila */}
                <div className="p-4 space-y-3 text-xs">
                  {/* Ponto 1: Coleta */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                      1
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pegar na Loja:</span>
                      <p className="font-bold text-white text-sm">{run.merchantName}</p>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-amber-400" /> {run.merchantAddress}
                      </p>
                    </div>
                  </div>

                  {/* Carga */}
                  <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60 flex items-center gap-2 text-slate-300">
                    <Package size={15} className="shrink-0 text-slate-400" />
                    <span className="text-[11px]">{run.cargoDesc}</span>
                  </div>

                  {/* Ponto 2: Entrega */}
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      2
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Entregar no Destino:</span>
                      <p className="font-bold text-white text-sm">{run.customerAddress}</p>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Navigation size={11} className="text-emerald-400" /> Areia firme · Beco das Mangueiras
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação Gigantes (Min 52px Touch Target) */}
                <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
                  {run.status === "disponivel" && (
                    <button
                      onClick={() => handleAcceptRun(run.id)}
                      className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95 transition"
                    >
                      <Check size={18} /> Aceitar Corrida Agora ({brl(run.feeCents)})
                    </button>
                  )}

                  {run.status === "coletando" && (
                    <button
                      onClick={() => handleCollected(run.id, run.orderId)}
                      className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-sky-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/30 hover:bg-sky-400 active:scale-95 transition"
                    >
                      <Package size={18} /> Confirmar: Pacote Coletado
                    </button>
                  )}

                  {run.status === "em_rota" && (
                    <button
                      onClick={() => handleDelivered(run.id, run.orderId, run.feeCents)}
                      className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/40 active:scale-95 transition"
                    >
                      <CheckCircle2 size={18} /> Finalizar: Entregue na Pousada!
                    </button>
                  )}
                </div>
              </div>
            ))}

          {activeRuns.filter((r) => r.status !== "concluido").length === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
              <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
              <h3 className="text-sm font-bold text-white">Nenhuma corrida pendente no momento</h3>
              <p className="text-xs text-slate-400 mt-1">
                Esta tela demonstra as corridas. O envio de pedidos do domínio público ao painel do entregador será ativado junto da integração de produção.
              </p>
            </div>
          )}
        </div>

        {/* Histórico Recente de Entregas do Turno */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Entregas Concluídas Hoje
          </h3>
          <div className="space-y-2">
            {[
              { id: "#479", time: "12:15", route: "Cozinha do Rio → Pousada Thale", fee: 1500 },
              { id: "#477", time: "11:40", route: "Farmácia Caraíva → Casa Beira-Mar", fee: 1500 },
              { id: "#475", time: "10:30", route: "Depósito Gelo → Bar da Praia", fee: 1500 },
            ].map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{h.id}</span>
                    <span className="text-[10px] text-slate-500">{h.time}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{h.route}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">{brl(h.fee)}</span>
                  <span className="block text-[9px] text-slate-500">Pix imediato</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
