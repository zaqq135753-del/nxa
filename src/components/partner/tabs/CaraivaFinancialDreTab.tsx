import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Receipt,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Percent,
  Coins
} from 'lucide-react';
import { formatCurrency, type OrderNiche } from '../../../services/villageUnifiedOrdersService';

interface CaraivaFinancialDreTabProps {
  niche: OrderNiche;
  totalGross: number;
  totalPix: number;
  tablesCount: number;
  occupiedCount: number;
  onCopyShiftReport: () => void;
  copiedReport: boolean;
}

export const CaraivaFinancialDreTab: React.FC<CaraivaFinancialDreTabProps> = ({
  totalGross,
  totalPix,
  tablesCount,
  occupiedCount,
  onCopyShiftReport,
  copiedReport,
}) => {
  // Slider interativo de CMV (Custo de Mercadoria Vendida)
  const [cmvPercent, setCmvPercent] = useState(32);
  const [activeHourlyIndex, setActiveHourlyIndex] = useState<number | null>(null);

  // Cálculos financeiros do DRE em tempo real
  const pixPercentage = totalGross > 0 ? Math.round((totalPix / totalGross) * 100) : 80;
  const cardPercentage = 100 - pixPercentage;

  // Taxas reais do gateway (Pix 0.89%, Cartão 2.89%)
  const pixFees = totalPix * 0.0089;
  const cardGross = Math.max(0, totalGross - totalPix);
  const cardFees = cardGross * 0.0289;
  const gatewayFees = pixFees + cardFees;

  // Custo de mercadoria estimado pelo slider
  const cmvAmount = totalGross * (cmvPercent / 100);

  // Gorjeta da equipe (10% sobre o consumo)
  const tipAmount = totalGross * 0.1;

  // Lucro líquido real no bolso do proprietário
  const netProfit = Math.max(0, totalGross - gatewayFees - cmvAmount - tipAmount);
  const netMargin = totalGross > 0 ? Math.round((netProfit / totalGross) * 100) : 0;

  // Economia brutal contra as comissões de 27% do iFood
  const ifoodCommissionCost = totalGross * 0.27;
  const savedVsIfood = Math.max(0, ifoodCommissionCost - gatewayFees);

  // Curva de faturamento hora a hora ao longo do turno
  const hourlyData = [
    { hour: '11h', label: '11:00', amount: 320, orders: 3, hot: false },
    { hour: '12h', label: '12:00', amount: 940, orders: 7, hot: true },
    { hour: '13h', label: '13:00', amount: 1480, orders: 11, hot: true },
    { hour: '14h', label: '14:00', amount: 820, orders: 6, hot: false },
    { hour: '16h', label: '16:00', amount: 650, orders: 5, hot: false },
    { hour: '18h', label: '18:00', amount: 1220, orders: 9, hot: true },
    { hour: '19h', label: '19:00', amount: 1980, orders: 14, hot: true },
    { hour: '20h', label: '20:00', amount: 2450, orders: 18, hot: true },
    { hour: '21h', label: '21:00', amount: 1840, orders: 13, hot: true },
    { hour: '22h', label: '22:00', amount: 760, orders: 6, hot: false },
  ];

  const maxHourAmount = Math.max(...hourlyData.map((d) => d.amount));

  return (
    <div className="space-y-6">
      {/* 1. Header Financeiro & Ação de Fechamento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD15C]/15 border border-[#FFD15C]/35 text-[#FFD15C] text-[11px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligência Financeira & Split Pix NFC D+0</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>DRE OPERACIONAL & CAIXA DO TURNO</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4EEDB2]/20 border border-[#4EEDB2]/30 text-[#4EEDB2] font-mono font-bold">
              MARGEM {netMargin}%
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Apuração matemática transparente descontando taxas de transação em tempo real e comissionamento sem bitributação.
          </p>
        </div>

        <button
          onClick={onCopyShiftReport}
          className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_10px_25px_rgba(255,255,255,0.15)] transition shrink-0"
        >
          {copiedReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copiedReport ? 'Fechamento Copiado!' : 'Copiar Fechamento p/ WhatsApp'}</span>
        </button>
      </div>

      {/* 2. Três Indicadores Visuais em Cards 3D Táteis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Faturamento Bruto do Turno */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Receita Bruta Total</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#4EEDB2]/10 border border-[#4EEDB2]/20 text-[#4EEDB2] text-[10px] font-bold">
              D+0 NA CONTA
            </span>
          </div>
          <div>
            <strong className="text-3xl font-black text-white font-mono tracking-tight">
              {formatCurrency(totalGross)}
            </strong>
            <p className="text-[11px] text-slate-400 mt-1">
              {pixPercentage}% via Pix NFC • {cardPercentage}% Cartão
            </p>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden flex">
            <div className="h-full bg-[#4EEDB2]" style={{ width: `${pixPercentage}%` }} />
            <div className="h-full bg-[#38BDF8]" style={{ width: `${cardPercentage}%` }} />
          </div>
        </motion.div>

        {/* Card 2: Economia Preservada vs iFood */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-emerald-500/20 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Economia vs Apps Tradicionais (27%)</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <strong className="text-3xl font-black text-[#4EEDB2] font-mono tracking-tight">
              +{formatCurrency(savedVsIfood)}
            </strong>
            <p className="text-[11px] text-slate-400 mt-1">
              Preservados no caixa hoje com a tecnologia NFC direta
            </p>
          </div>
          <div className="text-[10px] text-slate-500">
            Comissão média de R$ 0,89/pedido vs R$ 27,00/cada R$ 100 em marketplaces
          </div>
        </motion.div>

        {/* Card 3: Lucro Líquido Real no Bolso */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-[#FFD15C]/25 shadow-[0_20px_45px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">(=) Lucro Líquido Real</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD15C]/15 border border-[#FFD15C]/30 text-[#FFD15C] text-[10px] font-bold">
              SOBROU LIVRE
            </span>
          </div>
          <div>
            <strong className="text-3xl font-black text-[#FFD15C] font-mono tracking-tight">
              {formatCurrency(netProfit)}
            </strong>
            <p className="text-[11px] text-slate-400 mt-1">
              Após descontar insumos, taxas bancárias e gorjetas
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>Ocupação do salão:</span>
            <strong className="text-white">{occupiedCount} de {tablesCount} mesas</strong>
          </div>
        </motion.div>
      </div>

      {/* 3. Gráfico Interativo de Faturamento Curva Horária (Desenho Interativo) */}
      <div className="p-6 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4EEDB2]" />
              <span>Curva de Demanda & Faturamento por Horário</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Passe o mouse ou toque nas barras para ver os picos de pedidos do turno.
            </p>
          </div>
          {activeHourlyIndex !== null && (
            <div className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-mono font-bold flex items-center gap-2">
              <span>{hourlyData[activeHourlyIndex].label}</span>
              <span className="text-[#4EEDB2]">{formatCurrency(hourlyData[activeHourlyIndex].amount)}</span>
              <span className="text-slate-400">({hourlyData[activeHourlyIndex].orders} pedidos)</span>
            </div>
          )}
        </div>

        {/* Gráfico de Barras Táteis Proporcionais */}
        <div className="h-32 flex items-end justify-between gap-2.5 pt-4 border-b border-white/[0.06] pb-2">
          {hourlyData.map((bar, i) => {
            const heightPercent = Math.round((bar.amount / maxHourAmount) * 100);
            const isHovered = activeHourlyIndex === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setActiveHourlyIndex(i)}
                onMouseLeave={() => setActiveHourlyIndex(null)}
                className="flex-1 flex flex-col items-center justify-end h-full gap-2 cursor-pointer group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className={`w-full rounded-t-xl transition-all duration-200 relative ${
                    isHovered
                      ? 'bg-gradient-to-t from-[#4EEDB2] to-[#38BDF8] shadow-[0_0_20px_rgba(78,237,178,0.5)]'
                      : bar.hot
                      ? 'bg-gradient-to-t from-emerald-600 to-[#4EEDB2]'
                      : 'bg-slate-700/60 hover:bg-slate-500'
                  }`}
                />
                <span className={`text-[10px] font-mono ${isHovered ? 'text-white font-bold' : 'text-slate-500'}`}>
                  {bar.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Grade Dupla: Simulador de Split Pix NFC em Cascata + Donut Holográfico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulador de Split Pix NFC em Cascata (O Grande Diferencial TapTable) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#4EEDB2]/20 border border-[#4EEDB2]/30 flex items-center justify-center text-[#4EEDB2]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Split de Pix NFC em Cascata Automática
                </h3>
                <span className="text-[10px] text-slate-500">Liquidação simultânea sem bitributação</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4EEDB2]/15 text-[#4EEDB2]">
              D+0 INSTANTÂNEO
            </span>
          </div>

          {/* Diagrama Visual em Cascata */}
          <div className="p-4 rounded-2xl bg-[#080B0E] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📲</span>
                <div>
                  <span className="text-xs font-bold text-white block">Aproximação NFC do Cliente</span>
                  <span className="text-[10px] text-slate-400">Conta Mesa 04 • Valor R$ 150,00</span>
                </div>
              </div>
              <strong className="text-base font-black text-white font-mono">R$ 150,00</strong>
            </div>

            <div className="pl-6 space-y-2 border-l-2 border-dashed border-[#4EEDB2]/30 ml-4">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0E1613] border border-[#4EEDB2]/20">
                <span className="text-slate-300 font-medium">→ 89,1% Conta Bancária do Comércio</span>
                <strong className="text-[#4EEDB2] font-mono">R$ 133,65</strong>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#141208] border border-[#FFD15C]/20">
                <span className="text-slate-300 font-medium">→ 10,0% Carteira Pix dos Garçons (Equipe)</span>
                <strong className="text-[#FFD15C] font-mono">R$ 15,00</strong>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#0A0D10] border border-white/[0.05]">
                <span className="text-slate-400">→ 0,9% Taxa de Gateway Pix Direct</span>
                <span className="text-slate-400 font-mono">R$ 1,35</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            ✨ <strong className="text-white">Zero retenção:</strong> O dinheiro não dorme na maquininha por 30 dias. A comissão do garçom é transferida na hora, motivando a equipe e eliminando custos tributários sobre os 10%.
          </p>
        </div>

        {/* Donut Holográfico de Formas de Pagamento */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Mix de Meios de Pagamento
            </h3>
            <span className="text-[10px] text-slate-500">Mês vigente</span>
          </div>

          <div className="flex items-center justify-center relative py-4">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
              {/* Círculo Base */}
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#1C242C" strokeWidth="4" />
              {/* Arco Pix NFC (82%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#4EEDB2"
                strokeWidth="4"
                strokeDasharray="82, 100"
                strokeDashoffset="0"
              />
              {/* Arco Cartão Crédito (13%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="4"
                strokeDasharray="13, 100"
                strokeDashoffset="-82"
              />
              {/* Arco Cartão Débito (5%) */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#FFD15C"
                strokeWidth="4"
                strokeDasharray="5, 100"
                strokeDashoffset="-95"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-white font-mono">82%</span>
              <span className="text-[10px] text-[#4EEDB2] font-bold">PIX NFC D+0</span>
            </div>
          </div>

          {/* Legenda das Cores */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4EEDB2]" /> Pix NFC TapTable (0,89%)
              </span>
              <strong className="text-white font-mono">82%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" /> Cartão de Crédito (2,89%)
              </span>
              <strong className="text-white font-mono">13%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD15C]" /> Débito / Balcão (1,39%)
              </span>
              <strong className="text-white font-mono">5%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Calculadora Visual do DRE (+ - =) com Slider de CMV */}
      <div className="p-6 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#FFD15C]" />
              <span>Demonstrativo de Resultado do Exercício (`+` `-` `=`)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Ajuste o Custo de Mercadorias (CMV) para simular o resultado líquido real do seu cardápio.
            </p>
          </div>

          {/* Slider Interativo de CMV */}
          <div className="flex items-center gap-3 bg-[#080B0E] p-2 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-400 font-medium">CMV Simulado:</span>
            <input
              type="range"
              min="20"
              max="45"
              value={cmvPercent}
              onChange={(e) => setCmvPercent(Number(e.target.value))}
              className="w-24 accent-[#FFD15C] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#FFD15C] font-mono">{cmvPercent}%</span>
          </div>
        </div>

        {/* Linhas da Equação DRE em Cartões Táteis */}
        <div className="space-y-2 text-xs">
          <div className="p-4 rounded-2xl bg-[#080B0E] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-200 font-bold flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              (+) Receita Bruta Faturada
            </span>
            <strong className="text-base font-black text-white font-mono">{formatCurrency(totalGross)}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080B0E] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">(-) Taxas de Gateway & Maquininha (Média 1,18%)</span>
            <span className="text-slate-300 font-mono font-semibold">-{formatCurrency(gatewayFees)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080B0E] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              (-) Custo dos Insumos / Mercadoria ({cmvPercent}% CMV)
            </span>
            <span className="text-slate-300 font-mono font-semibold">-{formatCurrency(cmvAmount)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080B0E] border border-white/[0.06] flex items-center justify-between">
            <span className="text-slate-400">
              (-) Taxa de Serviço 10% Salão & Cozinha (100% repassada)
            </span>
            <span className="text-slate-300 font-mono font-semibold">-{formatCurrency(tipAmount)}</span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1A14] to-[#0A131B] border border-[#4EEDB2]/30 flex items-center justify-between shadow-[0_10px_30px_rgba(78,237,178,0.15)]">
            <div>
              <span className="text-sm font-black text-white block">(=) Lucro Líquido Real no Bolso</span>
              <p className="text-[11px] text-[#4EEDB2] font-semibold mt-0.5">
                Margem líquida de {netMargin}% sobre a receita
              </p>
            </div>
            <strong className="text-2xl font-black text-[#4EEDB2] font-mono tracking-tight">
              {formatCurrency(netProfit)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
