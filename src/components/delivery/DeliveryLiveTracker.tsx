import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  ShieldCheck,
  Star,
  MessageCircle,
  PhoneCall,
  Sparkles,
  FastForward,
  RotateCcw,
  Clock,
  Receipt,
} from "lucide-react";
import type { ActiveDeliveryOrder, DeliveryOrderStatus } from "./delivery.types";
import { playRiderTacticalSound } from "../../services/riderDispatchService";

interface DeliveryLiveTrackerProps {
  order: ActiveDeliveryOrder;
  onUpdateStatus: (nextStatus: DeliveryOrderStatus, nextProgress: number) => void;
}

const STATUS_STEPS: {
  key: DeliveryOrderStatus;
  label: string;
  subtitle: string;
  progress: number;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    key: "CONFIRMED",
    label: "Confirmado",
    subtitle: "O restaurante recebeu seu pedido e validou o Pix.",
    progress: 18,
    icon: CheckCircle2,
  },
  {
    key: "PREPARING",
    label: "No Preparo",
    subtitle: "Chef preparando seu prato na bancada térmica.",
    progress: 48,
    icon: ChefHat,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "A Caminho",
    subtitle: "Entregador deslocando pelas trilhas de areia até você.",
    progress: 82,
    icon: Bike,
  },
  {
    key: "DELIVERED",
    label: "Entregue",
    subtitle: "Código de segurança validado na portaria da pousada.",
    progress: 100,
    icon: MapPin,
  },
];

export const DeliveryLiveTracker: React.FC<DeliveryLiveTrackerProps> = ({
  order,
  onUpdateStatus,
}) => {
  const [chatMessageSent, setChatMessageSent] = useState<string | null>(null);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const activeStep = STATUS_STEPS[currentStepIndex] ?? STATUS_STEPS[0];

  const handleAdvanceStep = () => {
    const nextIdx = (currentStepIndex + 1) % STATUS_STEPS.length;
    const next = STATUS_STEPS[nextIdx];
    playRiderTacticalSound(next.key === "DELIVERED" ? "cash_register" : "geofence_ping");
    onUpdateStatus(next.key, next.progress);
  };

  const handleQuickMessage = (msg: string) => {
    setChatMessageSent(msg);
    setTimeout(() => setChatMessageSent(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Live Status Banner */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#141719] shadow-xl">
        {/* Tactical Sand Route Map Simulation */}
        <div className="relative h-56 w-full overflow-hidden bg-[#0B1014]">
          {/* Subtle Coastal Grid & River Curve */}
          <svg
            viewBox="0 0 600 240"
            className="h-full w-full object-cover opacity-90"
            aria-label="Mapa em tempo real da entrega em Caraíva"
          >
            <defs>
              <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="routeActive" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EA1D2C" />
                <stop offset="100%" stopColor="#F6C945" />
              </linearGradient>
            </defs>

            {/* Rio Caraíva Waterbody */}
            <path
              d="M -20 35 Q 180 90, 340 40 T 620 85 L 620 0 L -20 0 Z"
              fill="url(#riverGrad)"
            />

            {/* Dashed Sand Trail Background */}
            <path
              d="M 85 165 C 210 165, 250 95, 360 115 C 440 130, 470 95, 515 90"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />

            {/* Animated Active Route */}
            <motion.path
              d="M 85 165 C 210 165, 250 95, 360 115 C 440 130, 470 95, 515 90"
              fill="none"
              stroke="url(#routeActive)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0.15 }}
              animate={{ pathLength: order.courier.progressPct / 100 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />

            {/* Origin Node (Merchant) */}
            <g transform="translate(85, 165)">
              <circle r="14" fill="#EA1D2C" fillOpacity="0.25" />
              <circle r="7" fill="#EA1D2C" stroke="#FFF4ED" strokeWidth="2" />
            </g>

            {/* Destination Node (Pousada/Cliente) */}
            <g transform="translate(515, 90)">
              <circle r="16" fill="#22C55E" fillOpacity="0.22" />
              <circle r="8" fill="#22C55E" stroke="#FFF4ED" strokeWidth="2" />
            </g>
          </svg>

          {/* Floating Courier Marker on Map */}
          <motion.div
            className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2"
            animate={{
              left: `${Math.min(82, Math.max(12, order.courier.progressPct * 0.78 + 8))}%`,
              top: order.courier.progressPct > 50 ? "42%" : "60%",
            }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-[#F6C945]/60 bg-[#090B0C]/90 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <Bike className="h-3.5 w-3.5 text-[#F6C945]" />
              <span>{order.courier.name.split("•")[0].trim()}</span>
            </div>
          </motion.div>

          {/* Top Left Order Badge */}
          <div className="absolute top-3.5 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <span className="text-[#F6C945]">#{order.orderId}</span>
            <span className="text-white/40">•</span>
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Previsão {order.zone.estimatedMinutes}</span>
          </div>

          {/* Interactive Step Simulator Button */}
          <button
            type="button"
            onClick={handleAdvanceStep}
            className="
              absolute top-3.5 right-4 flex items-center gap-1.5 rounded-full
              border border-[#F6C945]/40 bg-[#090B0C]/85 px-3 py-1.5
              text-[11px] font-bold text-[#F6C945] backdrop-blur-md
              transition hover:bg-[#F6C945] hover:text-black
            "
          >
            {order.status === "DELIVERED" ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar Simulação
              </>
            ) : (
              <>
                <FastForward className="h-3.5 w-3.5" />
                Simular Próxima Etapa
              </>
            )}
          </button>

          {/* Bottom Map Labels */}
          <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between text-[11px] text-white/75">
            <span className="rounded-lg bg-black/65 px-2.5 py-1 backdrop-blur-sm">
              Origem: <strong className="text-white">{order.merchantName}</strong>
            </span>
            <span className="rounded-lg bg-black/65 px-2.5 py-1 backdrop-blur-sm">
              Destino: <strong className="text-emerald-400">{order.pousadaOrAddress}</strong>
            </span>
          </div>
        </div>

        {/* 4-Stage iFood Progress Timeline */}
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#EA1D2C] uppercase">
                Status em Tempo Real
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {activeStep.label} — {activeStep.subtitle}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => {
                    playRiderTacticalSound(
                      step.key === "DELIVERED" ? "cash_register" : "geofence_ping"
                    );
                    onUpdateStatus(step.key, step.progress);
                  }}
                  className={`flex flex-col items-start rounded-2xl border p-3 text-left transition ${
                    isCurrent
                      ? "border-[#EA1D2C] bg-[#EA1D2C]/10"
                      : isCompleted
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-white/5 bg-[#090B0C]/60 opacity-50"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <Icon
                      className={`h-4 w-4 ${
                        isCurrent
                          ? "text-[#EA1D2C]"
                          : isCompleted
                          ? "text-emerald-400"
                          : "text-white/40"
                      }`}
                    />
                    <span className="text-[10px] font-bold text-white/40">
                      0{index + 1}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">{step.label}</span>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCurrent
                          ? "w-full bg-[#EA1D2C]"
                          : isCompleted
                          ? "w-full bg-emerald-400"
                          : "w-0"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security PIN + Courier Telemetry Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* iFood 4-Digit Confirmation Code Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-[#F6C945]/30 bg-gradient-to-br from-[#141719] to-[#090B0C] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6C945]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#F6C945] uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Código de Entrega iFood Caraíva
              </span>
              <h4 className="mt-2 text-sm font-bold text-white">
                Informe este código ao entregador
              </h4>
              <p className="mt-0.5 text-xs text-white/60">
                Garante que seu pedido lacrado seja entregue em mãos na sua pousada.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#090B0C] px-4 py-3">
            <span className="text-xs font-semibold text-white/60">PIN de 4 dígitos:</span>
            <div className="flex gap-2">
              {order.confirmationPin.split("").map((digit, i) => (
                <span
                  key={i}
                  className="flex h-10 w-9 items-center justify-center rounded-xl border border-[#F6C945]/50 bg-[#F6C945]/10 font-mono text-lg font-black text-[#F6C945]"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Courier Telemetry Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#141719] p-5">
          <div className="flex items-center gap-3.5">
            <img
              src={order.courier.avatar}
              alt={order.courier.name}
              className="h-14 w-14 rounded-2xl border border-[#F6C945]/50 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-white">
                  {order.courier.name}
                </span>
                <span className="flex items-center gap-0.5 rounded-md bg-[#F6C945]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#F6C945]">
                  <Star className="h-3 w-3 fill-[#F6C945]" />
                  {order.courier.rating}
                </span>
              </div>
              <p className="text-xs text-emerald-400">{order.courier.modal}</p>
              <p className="truncate text-[11px] text-white/50">
                Ref: {order.referencePoint}
              </p>
            </div>
          </div>

          {chatMessageSent ? (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
              ✓ Mensagem enviada ao entregador: &ldquo;{chatMessageSent}&rdquo;
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickMessage("Estou aguardando na portaria da pousada!")
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#F6C945]/40"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#F6C945]" />
                &ldquo;Estou na portaria&rdquo;
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickMessage("Pode deixar na recepção da pousada, obrigado!")
                }
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs font-semibold text-white transition hover:border-emerald-400/40"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                Avisar Recepção
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Receipt Summary */}
      <div className="rounded-3xl border border-white/10 bg-[#141719] p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={order.merchantLogo}
              alt={order.merchantName}
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{order.merchantName}</h4>
              <p className="text-[11px] text-white/50">
                Pedido #{order.orderId} • {order.createdAt}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
            <Receipt className="h-4 w-4" />
            R$ {order.total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {order.items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between text-xs text-white/80"
            >
              <span>
                <strong className="text-white">{item.quantity}x</strong>{" "}
                {item.menuItem.name}
              </span>
              <span className="font-semibold">
                R$ {item.lineTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-[11px] text-white/60">
          <Sparkles className="h-3.5 w-3.5 text-[#F6C945]" />
          Integrado ao KDS TapTable & Frota Nativa de Caraíva em tempo real.
        </div>
      </div>
    </div>
  );
};
