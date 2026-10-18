import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Users,
  Crown,
  Heart,
  Send,
  MessageCircle,
  TrendingUp,
  Search,
  CheckCircle2,
  UtensilsCrossed,
  MapPin
} from 'lucide-react';
import { formatCurrency, type OrderNiche } from '../../../services/villageUnifiedOrdersService';

export interface CustomerProfile {
  name: string;
  phone: string;
  whatsappFormatted: string;
  totalSpent: number;
  ordersCount: number;
  lastVisit: string;
  favoriteDish: string;
  preferredTable: string;
  segment: 'vip' | 'frequente' | 'novo' | 'em_risco';
  avatarEmoji: string;
}

interface CaraivaCrmLoyaltyTabProps {
  niche?: OrderNiche;
  customers: CustomerProfile[];
}

export const CaraivaCrmLoyaltyTab: React.FC<CaraivaCrmLoyaltyTabProps> = ({
  customers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'todos' | 'vip' | 'frequente' | 'novo' | 'em_risco'>('todos');
  const [activeCampaignTemplate, setActiveCampaignTemplate] = useState<'luau' | 'chef' | 'fidelidade'>('luau');
  const [campaignCopied, setCampaignCopied] = useState<string | null>(null);

  // Filtro de clientes
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.favoriteDish.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'todos' || c.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

  const totalSpentAll = customers.reduce((acc, curr) => acc + curr.totalSpent, 0);
  const averageTicket = customers.length > 0 ? totalSpentAll / customers.length : 0;
  const vipCount = customers.filter((c) => c.segment === 'vip').length;

  const getCampaignMessage = (customerName: string) => {
    if (activeCampaignTemplate === 'luau') {
      return `Olá ${customerName}! Tudo bem? 🌅 Hoje teremos um pôr do sol especial no Rio Caraíva com música ao vivo e reservamos uma mesa para você. Apresentando este WhatsApp, seu primeiro coquetel da casa é cortesia! Esperamos por você!`;
    }
    if (activeCampaignTemplate === 'chef') {
      return `Oi ${customerName}! Nosso chef preparou um lote fresco de Moqueca com peixe da canoa de hoje. Como você já é cliente da casa, sua mesa tem prioridade de reserva sem fila de espera. Quer que guarde para você?`;
    }
    return `Olá ${customerName}! Passando para agradecer pela sua última visita! 🌴 Preparamos um presente de 10% de cortesia no seu próximo almoço ou jantar ao aproximar o celular da nossa placa NFC na mesa. Até breve!`;
  };

  const handleCopyCampaign = (customer: CustomerProfile) => {
    const text = getCampaignMessage(customer.name);
    navigator.clipboard.writeText(text);
    setCampaignCopied(customer.phone);
    setTimeout(() => setCampaignCopied(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header do CRM & Inteligência de Retenção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/35 text-[#38BDF8] text-[11px] font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CRM & Inteligência de Retenção NFC</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>BASE DE CLIENTES & FIDELIZAÇÃO</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] font-mono font-bold">
              {customers.length} CLIENTES
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Clientes capturados automaticamente no ato do pagamento via Placa NFC ou pedidos pelo Guia Caraíva.
          </p>
        </div>

        {/* Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, prato ou tel..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#0D1217] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#38BDF8]/40"
          />
        </div>
      </div>

      {/* 2. Quatro Indicadores Visuais de CRM em Cards 3D Táteis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">LTV Acumulado</span>
            <strong className="text-2xl font-black text-white font-mono block">
              {formatCurrency(totalSpentAll)}
            </strong>
            <p className="text-[10px] text-slate-500">Gasto total gerado na casa</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#4EEDB2]/10 border border-[#4EEDB2]/25 flex items-center justify-center text-[#4EEDB2]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Ticket Médio</span>
            <strong className="text-2xl font-black text-[#FFD15C] font-mono block">
              {formatCurrency(averageTicket)}
            </strong>
            <p className="text-[10px] text-slate-500">Média por visita no salão</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFD15C]/10 border border-[#FFD15C]/25 flex items-center justify-center text-[#FFD15C]">
            <Crown className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Clientes VIP Ouro</span>
            <strong className="text-2xl font-black text-[#38BDF8] font-mono block">
              {vipCount} clientes
            </strong>
            <p className="text-[10px] text-slate-500">Consumo acima de R$ 300</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center text-[#38BDF8]">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="p-5 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Taxa de Retorno</span>
            <strong className="text-2xl font-black text-[#4EEDB2] font-mono block">
              68.4%
            </strong>
            <p className="text-[10px] text-slate-500">Retornam na mesma semana</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#4EEDB2]/10 border border-[#4EEDB2]/25 flex items-center justify-center text-[#4EEDB2]">
            <Heart className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* 3. Disparador de Campanhas Contextuais WhatsApp com IA */}
      <div className="p-6 rounded-3xl bg-[#0D1217] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#38BDF8]" />
              <span>Campanhas Diretas de WhatsApp (1 Toque)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Dispare convites e benefícios para reativar clientes que já visitaram o estabelecimento.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#080B0E] border border-white/10">
            {[
              { id: 'luau', label: '🌅 Luau & Pôr do Sol' },
              { id: 'chef', label: '🍲 Prato do Chef' },
              { id: 'fidelidade', label: '🎁 10% Retorno NFC' },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setActiveCampaignTemplate(tmpl.id as 'luau' | 'chef' | 'fidelidade')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeCampaignTemplate === tmpl.id
                    ? 'bg-white text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pré-visualização da Mensagem */}
        <div className="p-3.5 rounded-2xl bg-[#080B0E] border border-white/[0.06] text-xs text-slate-300 italic flex items-center justify-between gap-4">
          <div className="truncate">
            <strong className="text-white not-italic font-semibold">Exemplo da mensagem: </strong>
            "{getCampaignMessage('Nome do Cliente')}"
          </div>
          <span className="text-[10px] text-[#38BDF8] font-bold shrink-0 not-italic">
            Personalizado por Cliente
          </span>
        </div>
      </div>

      {/* 4. Matriz de Segmentos (Filtros Táteis) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'todos', label: 'Todos os Clientes' },
          { id: 'vip', label: '👑 VIP & Turistas de Luxo' },
          { id: 'frequente', label: '🌴 Nativos & Fiéis' },
          { id: 'novo', label: '🌊 Novos Turistas Hoje' },
          { id: 'em_risco', label: '💤 Em Risco / Saudades' },
        ].map((seg) => (
          <button
            key={seg.id}
            onClick={() => setSelectedSegment(seg.id as 'todos' | 'vip' | 'frequente' | 'novo' | 'em_risco')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedSegment === seg.id
                ? 'bg-white text-slate-950 border-white'
                : 'bg-[#0D1217] text-slate-400 hover:text-white border-white/10'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* 5. Grade de Cards 3D Táteis de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((customer) => {
          const isVip = customer.segment === 'vip';
          const isFrequent = customer.segment === 'frequente';
          const isCopied = campaignCopied === customer.phone;

          return (
            <motion.div
              key={customer.phone}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`p-5 rounded-3xl border transition-all duration-200 relative overflow-hidden backdrop-blur-xl flex flex-col justify-between space-y-4 ${
                isVip
                  ? 'bg-gradient-to-br from-[#121922] to-[#0A0E13] border-[#38BDF8]/40 shadow-[0_20px_45px_rgba(56,189,248,0.15)]'
                  : isFrequent
                  ? 'bg-gradient-to-br from-[#131B15] to-[#0A0F0C] border-[#4EEDB2]/40 shadow-[0_20px_45px_rgba(78,237,178,0.12)]'
                  : 'bg-[#0D1217] border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
              }`}
            >
              {/* Borda Iluminada de Topo */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isVip ? 'bg-[#38BDF8]' : isFrequent ? 'bg-[#4EEDB2]' : 'bg-white/20'
                }`}
              />

              <div className="space-y-3">
                {/* Avatar e Dados Básicos */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1C2530] to-[#0D1217] border border-white/15 flex items-center justify-center text-2xl shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.6)]">
                      {customer.avatarEmoji}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white leading-tight">{customer.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{customer.phone}</p>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Última visita: {customer.lastVisit}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isVip
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                        : isFrequent
                        ? 'bg-[#4EEDB2]/20 text-[#4EEDB2] border border-[#4EEDB2]/30'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {isVip ? 'VIP OURO' : isFrequent ? 'FREQUENTE' : 'VISITANTE'}
                  </span>
                </div>

                {/* Preferências Detectadas pela IA */}
                <div className="p-3 rounded-2xl bg-[#080B0E] border border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" /> Prato Favorito:
                    </span>
                    <strong className="text-white truncate max-w-[150px]">{customer.favoriteDish}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" /> Mesa Preferida:
                    </span>
                    <strong className="text-slate-200">{customer.preferredTable}</strong>
                  </div>

                  <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Total Consumido ({customer.ordersCount}x)</span>
                    <strong className="text-sm font-black text-[#4EEDB2] font-mono">
                      {formatCurrency(customer.totalSpent)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Direta no WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleCopyCampaign(customer)}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />}
                  <span>{isCopied ? 'Texto Copiado!' : 'Copiar Texto IA'}</span>
                </button>

                <a
                  href={`https://wa.me/${customer.whatsappFormatted}?text=${encodeURIComponent(
                    getCampaignMessage(customer.name)
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar WhatsApp</span>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
