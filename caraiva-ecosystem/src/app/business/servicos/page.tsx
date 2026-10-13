"use client";
import { useState } from "react";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  Phone, 
  Plus, 
  Check, 
  AlertCircle, 
  QrCode, 
  TrendingUp, 
  Waves,
  HeartHandshake,
  DollarSign
} from "lucide-react";
import { services, byId, establishments, brl, type WellnessService } from "@/lib/data";
import { useStore } from "@/lib/store";
import { computeSplit } from "@/lib/pricing";
import { FinancialHub } from "@/components/FinancialHub";
import { PlaqueStrategyHub } from "@/components/PlaqueStrategyHub";

export default function ServicosBusinessPage() {
  const estId = "spa-caraiva";
  const est = byId(establishments, estId) || establishments[0];
  const { bookings, addBooking, checkIn } = useStore();
  const [tab, setTab] = useState<"agenda" | "servicos" | "financeiro" | "placa">("agenda");
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  // Filtra agendamentos deste estabelecimento
  const spaBookings = bookings.filter((b) => {
    if (b.kind !== "servico") return false;
    const serv = byId(services, b.refId);
    return serv?.establishmentId === estId;
  });

  // Ação de demonstração para apresentar ao cliente
  const handleSimulateBooking = () => {
    const serv = services[0]; // Massagem Relaxante
    const split = computeSplit(serv.price, "pro"); // taxa de serviço pro 5%
    const clients = [
      { name: "Juliana Mendes", pousada: "Pousada Flor de Caraíva (Bangalô 4)", time: "17:00" },
      { name: "Rodrigo Vasconcelos", pousada: "Pousada da Barra (Quarto 2)", time: "18:30" },
      { name: "Fernanda Lima", pousada: "Espaço Beira-Rio (Tenda 1)", time: "15:30" },
    ];
    const pick = clients[Math.floor(Math.random() * clients.length)];

    addBooking({
      kind: "servico",
      refId: serv.id,
      title: `${serv.name} (${pick.time})`,
      guest: `${pick.name} · ${pick.pousada}`,
      start: pick.time,
      split,
    });

    setSimulatedNotice(`Demonstração de agendamento: ${pick.name} às ${pick.time}. Nenhum Pix foi pago.`);
    setTimeout(() => setSimulatedNotice(null), 6000);
  };

  return (
    <div className="min-h-screen bg-noite-950 pb-20 text-areia-100">
      {/* Top Banner de Demonstração / Gestão */}
      <div className="border-b border-mata-500/20 bg-mata-950/40 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mata-500/20 text-mata-300 ring-1 ring-mata-500/30">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-areia-50">{est.name}</h1>
                <span className="rounded-full bg-mata-500/20 px-2 py-0.5 text-[10px] font-semibold text-mata-300">
                  Bem-Estar & Terapias
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Agenda Aberta
                </span>
              </div>
              <p className="text-xs text-areia-300">
                Massagens na Pousada · Yoga Matinal · Aulas de Kitesurf na Barra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateBooking}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-mata-600 to-mata-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-mata-900/40 transition hover:from-mata-500 hover:to-mata-400 active:scale-95"
            >
              <Plus size={16} /> Simular Reserva (+ Sinal Pix 50%)
            </button>
          </div>
        </div>
      </div>

      {simulatedNotice && (
        <div className="bg-mata-500/20 border-b border-mata-500/40 px-4 py-2.5 text-center text-xs font-medium text-mata-200 animate-in fade-in slide-in-from-top-2">
          ✨ {simulatedNotice}
        </div>
      )}

      {/* Tabs de Navegação */}
      <div className="sticky top-10 z-40 border-b border-white/5 bg-noite-900/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 px-4 py-2 overflow-x-auto scrollbar-none touch-pan-x">
          {[
            { id: "agenda", label: "Agenda & Atendimentos", icon: Calendar, badge: spaBookings.length },
            { id: "servicos", label: "Catálogo & Vagas", icon: Sparkles },
            { id: "financeiro", label: "Extrato Pix", icon: DollarSign },
            { id: "placa", label: "Placas NFC nos Bangalôs", icon: QrCode },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id as any)}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
                tab === id
                  ? "bg-mata-500/20 text-mata-200 ring-1 ring-mata-500/30"
                  : "text-areia-300 hover:bg-white/5 hover:text-areia-100"
              }`}
            >
              <Icon size={15} />
              {label}
              {typeof badge === "number" && badge > 0 && (
                <span className="rounded-full bg-mata-500 px-1.5 py-0.5 text-[10px] font-bold text-noite-950">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-6xl px-4 pt-6">
        {/* TAB 1: AGENDA DE HOJE */}
        {tab === "agenda" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Atendimentos Marcados</span>
                <p className="mt-1 text-2xl font-bold text-areia-50">{spaBookings.length + 3}</p>
                <span className="text-[10px] text-emerald-400 font-medium">Agendamento de demonstração</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Taxa Anti-No-Show</span>
                <p className="mt-1 text-2xl font-bold text-mata-300">0% Faltas</p>
                <span className="text-[10px] text-areia-400">Sinal 50% Pix retém vaga</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Origem dos Clientes</span>
                <p className="mt-1 text-2xl font-bold text-coral-400">85%</p>
                <span className="text-[10px] text-areia-400">Scans de placas nos quartos</span>
              </div>
              <div className="rounded-2xl border border-white/5 bg-noite-900/50 p-4">
                <span className="text-[11px] font-medium text-areia-400">Avaliação do Terapeuta</span>
                <p className="mt-1 text-2xl font-bold text-amber-400">5.0 ★</p>
                <span className="text-[10px] text-areia-400">42 avaliações no app</span>
              </div>
            </div>

            {/* Lista Cronológica de Atendimentos */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-areia-50">Linha do Tempo de Atendimentos (Hoje)</h2>
                  <p className="text-xs text-areia-400">Atendimentos no local da pousada ou no espaço fixo</p>
                </div>
                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-areia-300">
                  Data: Hoje · Maré Baixa 11:20
                </span>
              </div>

              <div className="space-y-3">
                {/* Atendimento Confirmado Modelo 1 */}
                <div className="relative overflow-hidden rounded-2xl border border-mata-500/30 bg-gradient-to-r from-mata-950/40 to-noite-900/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-mata-500/20 text-mata-200 ring-1 ring-mata-500/40">
                        <span className="text-[11px] font-bold">14:00</span>
                        <span className="text-[9px] text-mata-400">60 min</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-areia-100">Massagem Relaxante Pés na Areia</h3>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Sinal ilustrativo · sem pagamento
                          </span>
                        </div>
                        <p className="text-xs text-areia-300 mt-0.5 flex items-center gap-1.5">
                          <User size={13} className="text-areia-400" /> Lucas Siqueira · Pousada Flor de Caraíva (Bangalô 4)
                        </p>
                        <p className="text-[11px] text-areia-400 mt-1 flex items-center gap-1.5">
                          <MapPin size={12} className="text-coral-400" /> Terapeuta: Luiza Santos · Irá com maca portátil à pousada
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://wa.me/5573999999999?text=Ol%C3%A1%20Lucas,%20aqui%20%C3%A9%20a%20Luiza%20do%20Espa%C3%A7o%20Bem-Estar%20Cara%C3%ADva.%20Estou%20confirmando%20sua%20massagem%20das%2014h."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Phone size={14} /> WhatsApp
                      </a>
                      <button
                        onClick={() => alert("Atendimento iniciado! O restante (R$ 90,00) será faturado após a sessão.")}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-mata-600 px-4 py-2 text-xs font-semibold text-white hover:bg-mata-500 active:scale-95"
                      >
                        <Check size={14} /> Iniciar Sessão
                      </button>
                    </div>
                  </div>
                </div>

                {/* Atendimento Confirmado Modelo 2 */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-noite-900/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-white/5 text-areia-300">
                        <span className="text-[11px] font-bold">15:30</span>
                        <span className="text-[9px] text-areia-400">120 min</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-areia-100">Aula Particular de Kitesurf / Wing Foil</h3>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Sinal ilustrativo · sem pagamento
                          </span>
                        </div>
                        <p className="text-xs text-areia-300 mt-0.5 flex items-center gap-1.5">
                          <User size={13} className="text-areia-400" /> Gabriela Duarte · Pousada da Barra
                        </p>
                        <p className="text-[11px] text-areia-400 mt-1 flex items-center gap-1.5">
                          <Waves size={12} className="text-rio-400" /> Ponto de Encontro: Ponta da Barra (Vento 18 nós Leste) · Instrutor Mateus
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://wa.me/5573999999999"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10"
                      >
                        <Phone size={14} /> WhatsApp
                      </a>
                      <button
                        onClick={() => alert("Check-in de equipamento registrado!")}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-areia-200 hover:bg-white/10"
                      >
                        <Check size={14} /> Equipamento Pronto
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agendamentos Dinâmicos gerados no store */}
                {spaBookings.map((b) => (
                  <div key={b.id} className="relative overflow-hidden rounded-2xl border border-mata-500/40 bg-mata-950/30 p-4 animate-in fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-mata-500/20 text-mata-200 ring-1 ring-mata-500/40">
                          <span className="text-[11px] font-bold">{b.start || "Hoje"}</span>
                          <span className="text-[9px] text-mata-400">Reserva</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-areia-100">{b.title}</h3>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              {b.checkedIn ? "Atendido (demo)" : "Pagamento não realizado"}
                            </span>
                          </div>
                          <p className="text-xs text-areia-300 mt-0.5 flex items-center gap-1.5">
                            <User size={13} className="text-areia-400" /> {b.guest}
                          </p>
                          <p className="text-[11px] text-areia-400 mt-1">
                            Líquido Terapeuta: <strong className="text-emerald-400">{brl(b.split.merchant)}</strong> · Caraíva.digital: {brl(b.split.platform)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!b.checkedIn ? (
                          <button
                            onClick={() => checkIn(b.id)}
                            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-mata-600 px-4 py-2 text-xs font-semibold text-white hover:bg-mata-500"
                          >
                            <Check size={14} /> Concluir Atendimento
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle2 size={16} /> Finalizado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATÁLOGO & VAGAS */}
        {tab === "servicos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-areia-50">Serviços Oferecidos no Caraíva Digital</h2>
                <p className="text-xs text-areia-400">Gerencie preços, duração e libere horários de atendimento para turistas</p>
              </div>
              <span className="rounded-full bg-mata-500/10 px-3 py-1 text-xs font-semibold text-mata-300">
                {services.length} serviços cadastrados
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {services.map((s) => (
                <div key={s.id} className="overflow-hidden rounded-2xl border border-white/5 bg-noite-900/60 transition hover:border-mata-500/30">
                  <div className="relative h-44 w-full">
                    <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-noite-950 via-noite-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="rounded-md bg-noite-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-mata-300 backdrop-blur">
                          {s.category.toUpperCase()} · {s.durationMin} MIN
                        </span>
                        <h3 className="text-base font-bold text-areia-50 mt-1">{s.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-areia-400 line-through">Balcão</span>
                        <p className="text-lg font-black text-emerald-400">{brl(s.price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <p className="text-xs text-areia-300 leading-relaxed">{s.description}</p>

                    <div className="rounded-xl bg-white/5 p-3 text-xs space-y-1.5">
                      <div className="flex justify-between text-areia-300">
                        <span>Profissional Responsável:</span>
                        <strong className="text-areia-100">{s.therapist}</strong>
                      </div>
                      <div className="flex justify-between text-areia-300">
                        <span>Local:</span>
                        <strong className="text-areia-100">{s.location}</strong>
                      </div>
                      <div className="flex justify-between text-areia-300">
                        <span>Sinal de Reserva (Pix):</span>
                        <strong className="text-mata-300">{brl(s.depositRequired)} (50%)</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-areia-400">Horários Disponíveis Hoje:</span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {s.slotsToday.map((slot) => (
                          <span key={slot} className="rounded-lg border border-mata-500/30 bg-mata-500/10 px-2.5 py-1 text-xs font-semibold text-mata-200">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FINANCEIRO */}
        {tab === "financeiro" && (
          <FinancialHub establishmentId={estId} />
        )}

        {/* TAB 4: PLACAS NFC / QR */}
        {tab === "placa" && (
          <PlaqueStrategyHub establishmentId={estId} />
        )}
      </main>
    </div>
  );
}
