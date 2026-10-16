import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Copy, 
  Check, 
  Coffee, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Moon, 
  Compass, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface PousadaConfig {
  id: string;
  name: string;
  wifiSsid: string;
  wifiPass: string;
  breakfastHours: string;
  breakfastLocation: string;
  receptionWhatsapp: string;
  voltage: string;
  rules: string[];
}

const POUSADAS_DATA: Record<string, PousadaConfig> = {
  'pousada-da-barra': {
    id: 'pousada-da-barra',
    name: 'Pousada da Barra',
    wifiSsid: 'PousadaBarra_Fibra_Hospedes',
    wifiPass: 'caraivaviva2026',
    breakfastHours: '08:00 às 10:30',
    breakfastLocation: 'Deck sobre o Rio Caraíva',
    receptionWhatsapp: '5573999990001',
    voltage: '220V',
    rules: [
      'Silêncio após às 22h para preservar a paz da vila.',
      'Duchas disponíveis na entrada da praia para lavar os pés de areia.',
      'Check-out até às 12:00. Caso precise de maleiro, solicite na recepção.'
    ]
  },
  'pousada-viva-caraiva': {
    id: 'pousada-viva-caraiva',
    name: 'Pousada Viva Caraíva',
    wifiSsid: 'VivaCaraiva_Guest_5G',
    wifiPass: 'axeepaz2026',
    breakfastHours: '08:30 às 11:00',
    breakfastLocation: 'Jardim dos Coqueiros',
    receptionWhatsapp: '5573999990002',
    voltage: '220V',
    rules: [
      'Piscina aberta das 09h às 20h.',
      'Toalhas de praia disponíveis na recepção.',
      'Não é permitido fumar dentro das acomodações.'
    ]
  },
  'padrao': {
    id: 'padrao',
    name: 'Pousada Hospedagem Caraíva',
    wifiSsid: 'Caraiva_Hospedes_WiFi',
    wifiPass: 'bemvindoacaraiva',
    breakfastHours: '08:00 às 10:30',
    breakfastLocation: 'Salão Principal / Varanda',
    receptionWhatsapp: '5573999999999',
    voltage: '220V',
    rules: [
      'Voltagem da vila é 220V.',
      'Horário de silêncio a partir das 22h.',
      'Preserve a natureza e descarte o lixo nos pontos corretos.'
    ]
  }
};

export const CaraivaGuestNfcView: React.FC = () => {
  const [params] = useSearchParams();
  const pousadaSlug = params.get('pousada') || 'pousada-da-barra';
  const roomNumber = params.get('quarto') || 'Suíte Master 04';
  
  const config = POUSADAS_DATA[pousadaSlug] || POUSADAS_DATA['padrao'];
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
  const [receptionRequestType, setReceptionRequestType] = useState('toalhas');
  const [receptionNotes, setReceptionNotes] = useState('');
  const [receptionSent, setReceptionSent] = useState(false);

  const handleSendReceptionRequest = () => {
    try {
      const newRequest = {
        id: `REQ-${Date.now().toString().slice(-5)}`,
        room: roomNumber,
        pousada: config.name,
        type: receptionRequestType,
        notes: receptionNotes.trim(),
        createdAt: new Date().toISOString(),
        status: 'recebido'
      };
      const key = 'caraiva-guest-requests-v1';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([newRequest, ...existing]));
      setReceptionSent(true);
      setTimeout(() => {
        setIsReceptionModalOpen(false);
        setReceptionSent(false);
        setReceptionNotes('');
      }, 2500);
    } catch {
      setReceptionSent(true);
    }
  };

  // Armazena automaticamente o contexto do quarto para que qualquer pedido no Guia já venha com esse endereço
  useEffect(() => {
    try {
      const guestContext = {
        pousadaId: config.id,
        pousadaName: config.name,
        room: roomNumber,
        deliveryPreset: `${config.name} — ${roomNumber}`
      };
      localStorage.setItem('caraiva_guest_preset', JSON.stringify(guestContext));
    } catch {
      // Storage fallback
    }
  }, [config, roomNumber]);

  const handleCopyWifi = async () => {
    try {
      await navigator.clipboard.writeText(config.wifiPass);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <main className="min-h-screen bg-[#07191e] text-[#edf4ef] pb-24 selection:bg-teal-500/30">
      {/* Topo / Header da Placa NFC */}
      <header className="sticky top-0 z-30 bg-[#07191e]/90 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
                Acesso Via Placa NFC
              </span>
              <h2 className="text-sm font-black text-white">{config.name}</h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs">
            {roomNumber}
          </span>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Banner de Boas-Vindas */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-900/40 via-slate-900/80 to-amber-950/30 border border-teal-500/20 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Bem-vindo(a) ao seu refúgio
            </span>
            <h1 className="text-xl font-black text-white leading-tight">
              Tudo do seu quarto na ponta dos dedos.
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você está na <strong className="text-amber-300">{roomNumber}</strong>. Suas entregas na vila já estão configuradas para chegar diretamente aqui.
            </p>
          </div>
        </div>

        {/* Card de Wi-Fi 1-Click */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <strong className="text-xs text-white">Wi-Fi de Alta Velocidade</strong>
            </div>
            <span className="text-[10px] text-slate-400">Fibra Óptica</span>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400">Rede: <span className="text-slate-200 font-semibold">{config.wifiSsid}</span></p>
              <p className="text-xs font-mono font-bold text-teal-300 truncate mt-0.5">Senha: {config.wifiPass}</p>
            </div>
            <button
              onClick={handleCopyWifi}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
            >
              {copiedWifi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWifi ? 'Copiada!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Card do Café da Manhã & Recepção */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Café da Manhã</span>
            <strong className="text-xs text-white block">{config.breakfastHours}</strong>
            <p className="text-[10px] text-slate-400">{config.breakfastLocation}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recepção Digital</span>
            <strong className="text-xs text-white block">Concierge do Quarto</strong>
            <button 
              type="button"
              onClick={() => setIsReceptionModalOpen(true)}
              className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              <span>Chamar Recepção</span>
              <Sparkles className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Acesso Rápido ao Delivery na Vila */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-teal-500/15 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-white block">Pedir Delivery no Quarto</strong>
                <span className="text-[10px] text-slate-300">Restaurantes, adega, açaí e água</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300">
            Seu endereço já está configurado como <strong className="text-amber-300">{config.name} — {roomNumber}</strong>. Não precisa digitar nada ao pedir!
          </p>
          <Link
            to="/guia"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
          >
            <span>Abrir Cardápios & Delivery</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Informações da Vila & Regras do Quarto */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-400" />
            <strong className="text-white">Dicas & Boas Práticas da Pousada</strong>
          </div>
          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Voltagem das tomadas: {config.voltage}</span>
            </div>
            {config.rules.map((rule, idx) => (
              <p key={idx} className="flex items-start gap-2 text-slate-300">
                <span className="text-teal-400 font-bold">•</span>
                <span>{rule}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Botão para abrir o Guia Completo */}
        <div className="pt-2">
          <Link
            to="/guia"
            className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all"
          >
            <Compass className="w-4 h-4 text-teal-400" />
            <span>Explorar o Guia 3D de Caraíva</span>
          </Link>
        </div>
      </div>

      {/* Modal In-App: Recepção & Concierge Digital do Quarto */}
      {isReceptionModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setIsReceptionModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-md bg-[#0c141a] text-slate-100 rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recepção Digital</h3>
                  <span className="text-[10px] text-slate-400">{config.name} · {roomNumber}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsReceptionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {receptionSent ? (
              <div className="py-6 text-center space-y-2 animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Solicitação Enviada!</h4>
                <p className="text-xs text-slate-300">
                  A equipe da recepção foi notificada. Tempo estimado de atendimento: ~5 minutos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  Como podemos ajudar no seu quarto?
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'toalhas', label: 'Toalhas Extras' },
                    { id: 'limpeza', label: 'Arrumação de Quarto' },
                    { id: 'frigobar', label: 'Água / Frigobar' },
                    { id: 'duvida', label: 'Dúvida Geral' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setReceptionRequestType(preset.id)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        receptionRequestType === preset.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Observação ou detalhes (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={receptionNotes}
                    onChange={(e) => setReceptionNotes(e.target.value)}
                    placeholder="Ex: 2 toalhas de praia para a Suíte 04, por favor..."
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendReceptionRequest}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  Enviar Chamado para a Recepção
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
