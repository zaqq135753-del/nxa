import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Wifi,
  Clock,
  Send,
  Camera,
  CheckCircle2,
  BellRing,
  Compass,
  Bot,
  Zap,
  PlusCircle
} from 'lucide-react';
import { formatCurrency, type OrderNiche } from '../../services/villageUnifiedOrdersService';

interface CaraivaSpatialSuite3DProps {
  niche: OrderNiche;
  businessName: string;
  totalGross: number;
  totalPix: number;
  activeWaiterCallsCount: number;
  onSimulateOrder: () => void;
  onOpenTable: (tableNum: string) => void;
}

export const CaraivaSpatialSuite3D: React.FC<CaraivaSpatialSuite3DProps> = ({
  niche,
  businessName,
  totalGross,
  totalPix,
  activeWaiterCallsCount,
  onSimulateOrder,
  onOpenTable,
}) => {
  // Estados do Simulador NFC Interativo
  const [isNfcTapping, setIsNfcTapping] = useState(false);
  const [nfcSuccessFeedback, setNfcSuccessFeedback] = useState<string | null>(null);
  const [simulatedSplitsCount, setSimulatedSplitsCount] = useState(3);
  const [selectedSpatialTable, setSelectedSpatialTable] = useState('02');
  const [activeStoryPosted, setActiveStoryPosted] = useState(false);
  const [kdsOrders, setKdsOrders] = useState([
    {
      id: 'kds-1',
      title: 'Moqueca de Robalo na Telha',
      price: 145,
      destination: 'Mesa 02 (Placa NFC)',
      slaMinutes: 4,
      slaSeconds: 15,
      status: 'preparando' as 'preparando' | 'pronto',
      notes: 'Sem coentro • Extra pirão',
      station: 'Cozinha Quente',
    },
    {
      id: 'kds-2',
      title: '2x Gin Tônica de Frutas da Terra',
      price: 76,
      destination: 'Mesa 05 (Placa NFC)',
      slaMinutes: 1,
      slaSeconds: 40,
      status: 'pronto' as 'preparando' | 'pronto',
      notes: 'Gelo de coco artesanal',
      station: 'Bar & Coquetéis',
    },
    {
      id: 'kds-3',
      title: 'Pastel de Arraia do Pará (6un)',
      price: 52,
      destination: 'Mesa 01 (Balcão)',
      slaMinutes: 7,
      slaSeconds: 20,
      status: 'preparando' as 'preparando' | 'pronto',
      notes: 'Molho de pimenta nativa à parte',
      station: 'Cozinha Quente',
    },
  ]);

  // Efeito Parallax 3D com o Mouse
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -6,
      y: (x / (rect.width / 2)) * 6,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Animação Contínua da Onda de Maré em Canvas para Náutica/Ambiente
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    let animId: number;

    const renderWave = () => {
      step += 0.035;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradiente de maré esmeralda escuro
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(78, 237, 178, 0.12)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
      gradient.addColorStop(1, 'rgba(78, 237, 178, 0.12)');

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          Math.sin(x * 0.02 + step) * 12 +
          Math.sin(x * 0.04 - step * 0.5) * 6 +
          canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Linha de crista luminosa
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(78, 237, 178, 0.6)';
      ctx.stroke();

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Simulação de Aproximação de Celular na Placa NFC
  const handleTriggerNfcTap = () => {
    if (isNfcTapping) return;
    setIsNfcTapping(true);
    setNfcSuccessFeedback(null);

    setTimeout(() => {
      setIsNfcTapping(false);
      setSimulatedSplitsCount((prev) => prev + 1);
      setNfcSuccessFeedback('Leitura NFC NTAG215 Confirmada! Pix Split R$ 95,00 liquidado instantaneamente.');
      setTimeout(() => setNfcSuccessFeedback(null), 5000);
    }, 1800);
  };

  // Avançar Pedido no KDS 3D
  const handleDispatchKds = (id: string) => {
    setKdsOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'pronto' } : o))
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl p-6 sm:p-8 overflow-hidden bg-[#05080A] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-slate-100 transition-transform duration-300 ease-out"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x * 0.4}deg) rotateY(${tilt.y * 0.4}deg)`,
      }}
    >
      {/* 1. Iluminação Ambiente de Galeria & Grid Espacial */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Glow Esmeralda Superior */}
        <div className="absolute -top-32 left-1/4 w-[600px] h-[350px] bg-[#4EEDB2]/10 rounded-full blur-[140px]" />
        {/* Glow Dourado Pôr do Sol à Direita */}
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[350px] bg-[#FFD15C]/10 rounded-full blur-[140px]" />
        {/* Grid de Perspectiva Espacial */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(600px) rotateX(25deg)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* 2. Top Header Holográfico com Badge VisionOS */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4EEDB2]/15 border border-[#4EEDB2]/35 text-[#4EEDB2] text-[11px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_20px_rgba(78,237,178,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Apple VisionOS & Big Tech Architecture • Spatial 3D Suite</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>CARAÍVA BUSINESS OS</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EEDB2] via-[#38BDF8] to-[#FFD15C]">
              • SPATIAL 3D
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Cockpit tátil de alta fidelidade: profundidade física 2.5D, telemetria em anéis holográficos, despacho KDS em tempo real e radar de placas NFC inteligentes.
          </p>
        </div>

        {/* Status Ao Vivo com Indicador Pulsante e Ação Rápida */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {activeWaiterCallsCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <BellRing className="w-3.5 h-3.5" />
              <span>{activeWaiterCallsCount} Chamado(s) Garçom</span>
            </div>
          )}
          <div className="px-3.5 py-1.5 rounded-xl bg-[#0C1014] border border-white/10 flex items-center gap-2 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4EEDB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4EEDB2]"></span>
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              {niche === 'gastronomia'
                ? 'TapTable Salão 3D'
                : niche === 'hospedagem'
                ? 'Mini PMS Suítes'
                : niche === 'passeios_barcos'
                ? 'Píer Náutico 3D'
                : 'Ateliê & Scan-Go'}
            </span>
          </div>
          <button
            onClick={onSimulateOrder}
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Lançar Pedido</span>
          </button>
        </div>
      </div>

      {/* 3. Grade Principal em 3 Colunas Espaciais Táteis (Estilo Apple VisionOS) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* ================================================================= */}
        {/* COLUNA 1: KDS & DESPACHO 3D COM SLA EM ANEL NEON (4 COLS)          */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4EEDB2]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                KDS & Despacho 3D
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#4EEDB2]/15 border border-[#4EEDB2]/30 text-[#4EEDB2] text-[10px] font-bold">
              SLA MÉDIO: 04:15
            </span>
          </div>

          {/* Lista de Tickets Táteis */}
          <div className="space-y-3">
            {kdsOrders.map((order) => {
              const isReady = order.status === 'pronto';
              return (
                <motion.div
                  key={order.id}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden backdrop-blur-xl ${
                    isReady
                      ? 'bg-[#0E1614]/90 border-[#4EEDB2]/40 shadow-[0_10px_30px_rgba(78,237,178,0.15)]'
                      : 'bg-[#0C1014]/90 border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  {/* Relevo de Borda Superior Iluminada */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Ícone 3D em Bolha com Efeito Clay */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1C242C] to-[#0A0D10] border border-white/15 flex items-center justify-center text-lg shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.6)]">
                        {order.title.includes('Moqueca') ? '🍲' : order.title.includes('Gin') ? '🍸' : '🥟'}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white leading-snug">{order.title}</h4>
                        </div>
                        <p className="text-[11px] font-semibold text-[#4EEDB2] mt-0.5">
                          {formatCurrency(order.price)} • Pix Pago via NFC
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Wifi className="w-3 h-3 text-[#38BDF8]" />
                          <span>{order.destination}</span>
                        </p>
                        {order.notes && (
                          <p className="text-[10px] text-[#FFD15C] mt-1 bg-[#FFD15C]/10 px-2 py-0.5 rounded-md inline-block">
                            Obs: {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timer de SLA em Anel Circular Neon */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="px-2 py-1 rounded-lg bg-[#000]/70 border border-[#4EEDB2]/40 text-[#4EEDB2] text-[11px] font-mono font-bold tracking-tight shadow-[0_0_12px_rgba(78,237,178,0.25)] flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>0{order.slaMinutes}:{order.slaSeconds}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase mt-1 font-semibold">{order.station}</span>
                    </div>
                  </div>

                  {/* Ação de Despacho Tátil */}
                  <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {isReady ? '✓ Pronto p/ garçom levar' : 'Em cocção acelerada'}
                    </span>
                    <button
                      onClick={() => handleDispatchKds(order.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition flex items-center gap-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] ${
                        isReady
                          ? 'bg-[#4EEDB2] text-slate-950 hover:bg-[#3ddba3]'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{isReady ? 'Servido na Mesa' : 'Despachar 3D'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* COLUNA 2: RADAR DO SALÃO ISOMÉTRICO 3D & CARAÍVA BRAIN IA (4 COLS) */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFD15C]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Salão 3D Isométrico & TapTable
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-[10px] font-semibold">
              Perspectiva Isométrica
            </span>
          </div>

          {/* Salão Isométrico em Relevo Tátil */}
          <div className="p-4 rounded-2xl bg-[#0C1014]/90 border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/[0.06]">
              <span>Planta de Mesas Inteligentes NFC</span>
              <span className="text-emerald-400 font-medium">Toque p/ Abrir Mesa</span>
            </div>

            {/* Grid Isométrico de Mesas Táteis */}
            <div
              className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#070A0D] border border-white/[0.06]"
              style={{
                perspective: '800px',
              }}
            >
              {[
                { num: '01', status: 'pago_nfc', val: 'R$ 180', label: 'Pago Pix', users: 2, glow: '#4EEDB2' },
                { num: '02', status: 'consumindo', val: 'R$ 290', label: 'Consumindo', users: 4, glow: '#38BDF8' },
                { num: '03', status: 'chamando_garcom', val: 'R$ 145', label: 'Chamou!', users: 3, glow: '#FFD15C', alert: true },
                { num: '04', status: 'livre', val: 'R$ 0', label: 'Livre', users: 0, glow: '#334155' },
                { num: '05', status: 'consumindo', val: 'R$ 410', label: 'Consumindo', users: 5, glow: '#38BDF8' },
                { num: '06', status: 'pago_nfc', val: 'R$ 95', label: 'Split Feito', users: 2, glow: '#4EEDB2' },
              ].map((table) => {
                const isSelected = selectedSpatialTable === table.num;
                return (
                  <motion.div
                    key={table.num}
                    onClick={() => {
                      setSelectedSpatialTable(table.num);
                      onOpenTable(table.num);
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'border-white bg-[#151D24] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : table.alert
                        ? 'border-[#FFD15C]/60 bg-[#1A1408] shadow-[0_0_15px_rgba(255,209,92,0.3)] animate-pulse'
                        : 'border-white/[0.08] bg-[#0E1217]'
                    }`}
                    style={{
                      transform: 'rotateX(8deg)',
                    }}
                  >
                    {/* Borda Iluminada de Relevo */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: table.glow }}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-white">Mesa {table.num}</span>
                        {table.alert ? (
                          <BellRing className="w-3.5 h-3.5 text-[#FFD15C] animate-bounce" />
                        ) : (
                          <span className="text-[9px] text-slate-500">{table.users}p</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-200 mt-1">{table.val}</p>
                    </div>

                    <span
                      className="text-[9px] font-semibold py-0.5 rounded px-1"
                      style={{ color: table.glow, backgroundColor: `${table.glow}15` }}
                    >
                      {table.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Caraíva Brain IA — Assistente Executivo Preditivo */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0F161E] to-[#0A0D11] border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#4EEDB2]/20 border border-[#4EEDB2]/30 flex items-center justify-center text-xs text-[#4EEDB2]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-white">Caraíva Brain IA • Telemetria Preditiva</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-[#FFD15C]">Pico previsto para 19:40:</strong> Baixa-mar das 18h no Rio Caraíva fará turistas retornarem das praias em direção aos restaurantes. Mesa 03 aguarda atendimento há 2 min.
              </p>
            </div>

            {/* Live Story & Momento na Vila */}
            <div className="p-3 rounded-2xl bg-[#090C0F] border border-white/[0.07] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Momento na Vila</span>
                  <span className="text-[10px] text-slate-400">Aparece para turistas na praia</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveStoryPosted(true);
                  setTimeout(() => setActiveStoryPosted(false), 3000);
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 cursor-pointer transition shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"
              >
                {activeStoryPosted ? '✓ Publicado!' : '+ Publicar Story'}
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* COLUNA 3: PLACA NFC TÁTIL 3D & TELEMETRIA DE ANÉIS (4 COLS)       */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Hardware & Radar NFC
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-bold">
              NTAG215 ATIVO
            </span>
          </div>

          {/* Anéis de Atividade Holográficos (Estilo Apple Watch / VisionOS) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0C1014]/90 border border-white/10 text-center relative overflow-hidden">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#4EEDB2]"
                    strokeDasharray="85, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-white">524</span>
              </div>
              <span className="text-[11px] font-bold text-white block mt-1.5">Leituras NFC Hoje</span>
              <span className="text-[10px] text-[#4EEDB2]">+41% vs ontem</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0C1014]/90 border border-white/10 text-center relative overflow-hidden">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8]"
                    strokeDasharray="63, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-white">63</span>
              </div>
              <span className="text-[11px] font-bold text-white block mt-1.5">Rotas a Pé Guiadas</span>
              <span className="text-[10px] text-[#38BDF8]">Turistas a caminho</span>
            </div>
          </div>

          {/* PLACA FÍSICA NFC 3D INTERATIVA (PIANO BLACK COM GRAVAÇÃO DOURADA) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 rounded-3xl bg-gradient-to-b from-[#181D24] to-[#0A0D10] border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.15)] relative overflow-hidden space-y-4"
          >
            {/* Efeito de Reflexo de Vidro Esmaltado */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />

            {/* Topo da Placa com Chip NTAG */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFD15C]">
                <Wifi className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">
                  NFC SMART PLAQUE
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FFD15C]/15 border border-[#FFD15C]/35 text-[#FFD15C] text-[10px] font-bold">
                MESA 01 • TAPTABLE
              </span>
            </div>

            {/* Render 3D da Placa de Mesa em Acrílico Piano Black */}
            <div className="relative py-4 px-5 rounded-2xl bg-[#030507] border border-[#FFD15C]/40 text-center shadow-[inset_0_0_25px_rgba(0,0,0,0.9),0_10px_25px_rgba(255,209,92,0.15)] overflow-hidden">
              {/* Onda de Aproximação NFC (Quando Ativa) */}
              {isNfcTapping && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border-4 border-[#4EEDB2] animate-ping opacity-75" />
                  <div className="w-40 h-40 rounded-full border-2 border-[#4EEDB2]/40 animate-ping opacity-50" />
                </div>
              )}

              <p className="text-[10px] font-bold tracking-widest uppercase text-[#FFD15C]/80">
                ECOSSISTEMA OFICIAL CARAÍVA
              </p>
              <h3 className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4ED] via-[#FFD15C] to-[#F6C945] mt-0.5">
                {businessName.toUpperCase()}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                chip: ntag215 • encoste o celular p/ cardápio e conta
              </p>

              {/* Botão de Simulação de Toque NFC */}
              <button
                onClick={handleTriggerNfcTap}
                disabled={isNfcTapping}
                className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFD15C] to-[#F6C945] text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(246,201,69,0.35)]"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>
                  {isNfcTapping
                    ? 'Lendo iPhone / Android...'
                    : 'Simular Aproximação Celular NFC'}
                </span>
              </button>
            </div>

            {/* Feedback de Pagamento / Split Instantâneo */}
            {nfcSuccessFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#4EEDB2]/15 border border-[#4EEDB2]/40 text-xs font-bold text-[#4EEDB2] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{nfcSuccessFeedback}</span>
              </motion.div>
            )}

            {/* Resumo de Split Pix D+0 no Bolso */}
            <div className="p-3.5 rounded-2xl bg-[#070A0D] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Split Pix D+0 da Casa
                </span>
                <p className="text-base font-extrabold text-white">
                  {formatCurrency(totalPix > 0 ? totalPix : totalGross * 0.95)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Taxa Pix 0,89%
                </span>
                <span className="text-[10px] text-slate-400">
                  {simulatedSplitsCount} pagantes na comanda
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. Canvas da Onda de Maré Animada na Base */}
      <div className="relative mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#4EEDB2]">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">
              Radar Náutico & Dinâmica de Maré Viva
            </h4>
            <p className="text-[11px] text-slate-400">
              Maré Baixa às 11:45 (0.3m) • Águas cristalinas e travessia a pé liberada para Ponta do Corumbau.
            </p>
          </div>
        </div>

        {/* Canvas da Onda */}
        <div className="w-full sm:w-64 h-12 rounded-xl overflow-hidden bg-[#0A0E13] border border-white/10 relative">
          <canvas ref={waveCanvasRef} width={256} height={48} className="w-full h-full block" />
        </div>
      </div>
    </div>
  );
};
