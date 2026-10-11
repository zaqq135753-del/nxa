import React, { useState, useMemo, useEffect } from 'react';
import {
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  MessageCircle,
  QrCode,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';
import { getTableBill, type TableBillData } from '../../../services/tableBillService';
import { openBusinessWhatsApp } from '../../../services/analytics';

interface CaraivaTableBillViewProps {
  businessId: string;
  businessName: string;
  tableNumber?: string;
  whatsappNumber?: string;
  onOpenMenu?: () => void;
  onOpenOnboarding?: () => void;
  onClose?: () => void;
}

export const CaraivaTableBillView: React.FC<CaraivaTableBillViewProps> = ({
  businessId,
  businessName,
  tableNumber = 'Mesa 07',
  whatsappNumber = '5573999990000',
  onOpenMenu,
  onOpenOnboarding,
}) => {
  const [bill, setBill] = useState<TableBillData>(() => getTableBill(businessId, tableNumber));

  useEffect(() => {
    setBill(getTableBill(businessId, tableNumber));
  }, [businessId, tableNumber]);

  const [includeServiceFee, setIncludeServiceFee] = useState(true);
  const [includeCouvert, setIncludeCouvert] = useState(true);
  const [splitCount, setSplitCount] = useState(bill.peopleCount || 2);
  const [copiedPix, setCopiedPix] = useState(false);
  const [isPixQrOpen, setIsPixQrOpen] = useState(false);
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({
    'rd-1': true,
    'rd-2': true,
    'rd-3': true,
  });

  // Cálculos financeiros auditados e transparentes
  const itemsSubtotal = useMemo(() => {
    return bill.rounds.reduce((acc, round) => {
      return (
        acc +
        round.items.reduce((rAcc, item) => {
          return rAcc + item.totalPrice;
        }, 0)
      );
    }, 0);
  }, [bill]);

  const couvertTotal = includeCouvert ? bill.couvertPerPerson * splitCount : 0;
  const serviceFeeTotal = includeServiceFee ? itemsSubtotal * (bill.serviceFeePercent / 100) : 0;
  const grandTotal = itemsSubtotal + couvertTotal + serviceFeeTotal;
  const perPersonAmount = grandTotal / Math.max(1, splitCount);

  const toggleRound = (roundId: string) => {
    setExpandedRounds((prev) => ({ ...prev, [roundId]: !prev[roundId] }));
  };

  const handleCopyPix = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(bill.pixKey);
        setCopiedPix(true);
        setTimeout(() => setCopiedPix(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleCallWaiter = (action: 'conta' | 'maquininha' | 'atendimento') => {
    const actionText =
      action === 'conta'
        ? `Olá! Estamos na *${bill.tableNumber}* (${bill.locationArea}) e gostaríamos de fechar a conta. Total: *R$ ${grandTotal.toFixed(2)}* (via PIX/Cartão).`
        : action === 'maquininha'
        ? `Olá! Na *${bill.tableNumber}*, por favor, poderiam trazer a maquininha de cartão? Total da mesa: *R$ ${grandTotal.toFixed(2)}*.`
        : `Olá! Precisamos de auxílio do garçom na *${bill.tableNumber}*, por favor!`;

    openBusinessWhatsApp(
      { id: businessId, name: businessName, whatsappNumber },
      'table_bill_action',
      actionText
    );
  };

  return (
    <div className="space-y-4 select-none pb-4">
      {/* 1. Header Oficial da Mesa & Comanda */}
      <div
        className="p-4 rounded-3xl border shadow-lg flex flex-col gap-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--cv-paper), var(--cv-soft))',
          borderColor: 'var(--cv-line)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--cv-ink)' }}>
                  {bill.tableNumber}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Consumo Aberto
                </span>
                {onOpenOnboarding && (
                  <button
                    type="button"
                    onClick={onOpenOnboarding}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 transition-all cursor-pointer"
                    title="Aproximar celular para identificação"
                  >
                    Identificar Mesa (NFC)
                  </button>
                )}
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--cv-muted)' }}>
                {businessName} • {bill.locationArea}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--cv-muted)' }}>
              Abertura
            </span>
            <p className="text-xs font-bold flex items-center gap-1 justify-end" style={{ color: 'var(--cv-ink)' }}>
              <Clock className="w-3 h-3 text-amber-500" />
              {bill.openedAt}
            </p>
          </div>
        </div>

        <div className="pt-2.5 border-t border-[var(--cv-line)] flex items-center justify-between text-xs" style={{ color: 'var(--cv-muted)' }}>
          <span>
            Atendido por: <strong style={{ color: 'var(--cv-ink)' }}>{bill.serverName}</strong>
          </span>
          <span>{bill.rounds.reduce((acc, r) => acc + r.items.length, 0)} itens lançados</span>
        </div>
      </div>

      {/* 2. Extrato Detalhado de Consumo por Rodadas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--cv-ink)' }}>
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
            <span>Itens Consumidos na Mesa</span>
          </h4>
          <span className="text-[11px]" style={{ color: 'var(--cv-muted)' }}>
            Atualizado em tempo real
          </span>
        </div>

        {bill.rounds.map((round) => {
          const isExpanded = expandedRounds[round.id] ?? true;
          return (
            <div
              key={round.id}
              className="rounded-2xl border overflow-hidden shadow-xs"
              style={{
                background: 'var(--cv-paper)',
                borderColor: 'var(--cv-line)',
              }}
            >
              {/* Cabeçalho da Rodada */}
              <button
                type="button"
                onClick={() => toggleRound(round.id)}
                className="w-full p-3 flex items-center justify-between text-left cursor-pointer transition-colors"
                style={{ background: 'var(--cv-soft)' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                    {round.time}
                  </span>
                  <span className="text-xs font-bold" style={{ color: 'var(--cv-ink)' }}>
                    {round.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--cv-muted)' }}>
                  <span>{round.items.length} itens</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {/* Itens da Rodada */}
              {isExpanded && (
                <div className="divide-y divide-[var(--cv-line)]">
                  {round.items.map((item) => (
                    <div key={item.id} className="p-3 flex items-start gap-3">
                      {item.image && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--cv-line)] bg-slate-900">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold leading-snug" style={{ color: 'var(--cv-ink)' }}>
                              {item.quantity}x {item.name}
                            </h5>
                            {item.notes && (
                              <p className="text-[11px] mt-0.5" style={{ color: 'var(--cv-muted)' }}>
                                ✎ {item.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold" style={{ color: 'var(--cv-ink)' }}>
                              R$ {item.totalPrice.toFixed(2)}
                            </span>
                            <p className="text-[10px]" style={{ color: 'var(--cv-muted)' }}>
                              R$ {item.unitPrice.toFixed(2)} un.
                            </p>
                          </div>
                        </div>

                        {/* Status do Item */}
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {item.status === 'delivered' ? (
                            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Entregue na mesa
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-1">
                              <ChefHat className="w-3 h-3 text-amber-500 animate-spin" />
                              Preparando na cozinha
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Divisor de Conta Interativo */}
      <div
        className="p-4 rounded-3xl border shadow-sm space-y-3"
        style={{
          background: 'var(--cv-paper)',
          borderColor: 'var(--cv-line)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--cv-ink)' }}>
              Dividir Conta Entre Pessoas
            </h4>
          </div>
          <span className="text-xs font-black text-amber-600">
            R$ {perPersonAmount.toFixed(2)} <small className="text-[10px] font-normal">/ pessoa</small>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setSplitCount(num)}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer"
              style={
                splitCount === num
                  ? {
                      background: 'var(--cv-river)',
                      color: '#FFFFFF',
                      borderColor: 'var(--cv-river)',
                      boxShadow: '0 2px 8px rgba(15,163,165,0.3)',
                    }
                  : {
                      background: 'var(--cv-soft)',
                      color: 'var(--cv-muted)',
                      borderColor: 'var(--cv-line)',
                    }
              }
            >
              {num} {num === 1 ? 'pes.' : 'pes.'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Resumo Financeiro & Configuração de Taxas (Auditável) */}
      <div
        className="p-4 rounded-3xl border shadow-md space-y-2.5"
        style={{
          background: 'var(--cv-paper)',
          borderColor: 'var(--cv-line)',
        }}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--cv-ink)' }}>
          Resumo Financeiro da Mesa
        </h4>

        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--cv-muted)' }}>
          <span>Subtotal dos itens ({bill.rounds.reduce((acc, r) => acc + r.items.length, 0)} itens)</span>
          <span className="font-semibold" style={{ color: 'var(--cv-ink)' }}>
            R$ {itemsSubtotal.toFixed(2)}
          </span>
        </div>

        {bill.couvertPerPerson > 0 && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--cv-muted)' }}>
              <span>Couvert Artístico (R$ {bill.couvertPerPerson.toFixed(2)} x {splitCount})</span>
              <button
                type="button"
                onClick={() => setIncludeCouvert((v) => !v)}
                className="text-[10px] underline text-amber-500 cursor-pointer"
              >
                {includeCouvert ? 'remover' : 'incluir'}
              </button>
            </div>
            <span className="font-semibold" style={{ color: includeCouvert ? 'var(--cv-ink)' : 'var(--cv-muted)' }}>
              {includeCouvert ? `R$ ${couvertTotal.toFixed(2)}` : 'R$ 0,00'}
            </span>
          </div>
        )}

        {/* Toggle Transparente de Serviço 10% */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span style={{ color: 'var(--cv-muted)' }}>Taxa de Atendimento ({bill.serviceFeePercent}%)</span>
            <button
              type="button"
              onClick={() => setIncludeServiceFee((v) => !v)}
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border cursor-pointer transition-all"
              style={{
                background: includeServiceFee ? 'rgba(15,163,165,0.1)' : 'var(--cv-soft)',
                borderColor: includeServiceFee ? 'var(--cv-river)' : 'var(--cv-line)',
                color: includeServiceFee ? 'var(--cv-river)' : 'var(--cv-muted)',
              }}
              title="A taxa de serviço é opcional conforme a legislação"
            >
              {includeServiceFee ? 'Opcional (Ativa)' : 'Desativada'}
            </button>
          </div>
          <span className="font-semibold" style={{ color: includeServiceFee ? 'var(--cv-ink)' : 'var(--cv-muted)' }}>
            {includeServiceFee ? `R$ ${serviceFeeTotal.toFixed(2)}` : 'R$ 0,00'}
          </span>
        </div>

        {/* Total Geral em Destaque */}
        <div
          className="pt-3 mt-2 border-t border-[var(--cv-line)] flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--cv-muted)' }}>
              Total Geral da Conta
            </span>
            <p className="text-xl sm:text-2xl font-black text-amber-500 leading-tight">
              R$ {grandTotal.toFixed(2)}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--cv-muted)' }}>
              Por Pessoa ({splitCount}x)
            </span>
            <p className="text-sm font-bold text-teal-600 leading-tight">
              R$ {perPersonAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Bloco de Pagamento PIX Instantâneo */}
      <div
        className="p-4 rounded-3xl border shadow-sm space-y-3"
        style={{
          background: 'linear-gradient(135deg, rgba(15,163,165,0.06), rgba(245,158,11,0.06))',
          borderColor: 'var(--cv-line)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight" style={{ color: 'var(--cv-ink)' }}>
                Pagamento Rápido via PIX
              </h4>
              <p className="text-[10px]" style={{ color: 'var(--cv-muted)' }}>
                {bill.pixReceiver}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPixQrOpen((v) => !v)}
            className="p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
            style={{
              background: 'var(--cv-paper)',
              borderColor: 'var(--cv-line)',
              color: 'var(--cv-ink)',
            }}
          >
            <QrCode className="w-3.5 h-3.5 text-teal-600" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Chave PIX com 1-Clique Copiar */}
        <div
          className="p-2.5 rounded-2xl border flex items-center justify-between gap-2"
          style={{
            background: 'var(--cv-paper)',
            borderColor: 'var(--cv-line)',
          }}
        >
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider block" style={{ color: 'var(--cv-muted)' }}>
              Chave PIX Oficial
            </span>
            <p className="text-xs font-mono font-bold truncate" style={{ color: 'var(--cv-ink)' }}>
              {bill.pixKey}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyPix}
            className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
            style={{
              background: copiedPix ? '#10B981' : 'var(--cv-river)',
              color: '#FFFFFF',
            }}
          >
            {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
          </button>
        </div>

        {/* Modal Simulado de QR Code */}
        {isPixQrOpen && (
          <div className="p-4 rounded-2xl bg-white text-slate-900 text-center space-y-2 border border-slate-200 animate-in fade-in">
            <p className="text-xs font-bold text-slate-700">Aponte a câmera do seu banco para pagar:</p>
            <div className="w-36 h-36 mx-auto bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">Valor total: R$ {grandTotal.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* 6. Ações Rápidas de Fechamento & Atendimento */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleCallWaiter('maquininha')}
          className="p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
          style={{
            background: 'var(--cv-paper)',
            borderColor: 'var(--cv-line)',
            color: 'var(--cv-ink)',
          }}
        >
          <CreditCardIcon className="w-4 h-4 text-sky-500" />
          <span>Pedir Maquininha</span>
        </button>

        <button
          type="button"
          onClick={() => handleCallWaiter('conta')}
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 transition active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-slate-950" />
          <span>Fechar via WhatsApp</span>
        </button>
      </div>

      {onOpenMenu && (
        <button
          type="button"
          onClick={onOpenMenu}
          className="w-full py-2.5 rounded-2xl border text-xs font-bold text-center transition active:scale-95 cursor-pointer"
          style={{
            background: 'var(--cv-soft)',
            borderColor: 'var(--cv-line)',
            color: 'var(--cv-muted)',
          }}
        >
          + Fazer Novo Pedido no Cardápio
        </button>
      )}
    </div>
  );
};

// Ícone auxiliar de cartão
function CreditCardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export default CaraivaTableBillView;
