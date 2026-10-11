import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Radio,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  Receipt,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';

interface CaraivaTableOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: { clientName: string; tableNumber: string; businessName: string }) => void;
  onConfirmed?: (assignedTable: string) => void;
  defaultTableNumber?: string;
  defaultBusinessName?: string;
  initialTableNumber?: string;
  businessName?: string;
}

export const CaraivaTableOnboardingModal: React.FC<CaraivaTableOnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onConfirmed,
  defaultTableNumber = 'Mesa 07',
  defaultBusinessName = 'Boteco do Pará',
  initialTableNumber,
  businessName,
}) => {
  const effectiveTableNumber = initialTableNumber || defaultTableNumber;
  const effectiveBusinessName = businessName || defaultBusinessName;

  const [step, setStep] = useState<'tap' | 'market_showcase' | 'identify'>('tap');
  const [isTapping, setIsTapping] = useState(false);
  const [hasTapped, setHasTapped] = useState(false);
  const [clientName, setClientName] = useState('');

  // Reseta estado quando abre
  useEffect(() => {
    if (isOpen) {
      setStep('tap');
      setIsTapping(false);
      setHasTapped(false);
    }
  }, [isOpen]);

  const handleSimulateNfcTap = () => {
    setIsTapping(true);
    // Simula a aproximação e reconhecimento magnético NFC da mesa
    setTimeout(() => {
      setHasTapped(true);
      setTimeout(() => {
        setStep('market_showcase');
      }, 900);
    }, 1200);
  };

  const handleFinish = () => {
    const finalName = clientName.trim() || 'Visitante Caraíva';
    if (onComplete) {
      onComplete({
        clientName: finalName,
        tableNumber: effectiveTableNumber,
        businessName: effectiveBusinessName,
      });
    }
    if (onConfirmed) {
      onConfirmed(effectiveTableNumber);
    }
    onClose();
  };

  if (!isOpen) return null;

  const showcaseSlides = [
    {
      icon: UtensilsCrossed,
      tag: 'Cardápio Vivo',
      title: 'Cardápio Digital & Fotos Reais',
      desc: 'Sem esperar o garçom trazer cardápios de papel ou cardápios amassados. Fotos em alta resolução e pratos frescos do dia.',
      color: 'from-amber-400 to-amber-600',
    },
    {
      icon: Receipt,
      tag: 'Conta Clara',
      title: 'Extrato Transparente em Tempo Real',
      desc: 'Veja exatamente cada água, caipirinha e prato que foi lançado na mesa. Sem surpresas ou erros na hora de pagar.',
      color: 'from-teal-400 to-teal-600',
    },
    {
      icon: Users,
      tag: 'Sem Calculadora',
      title: 'Divisão de Conta e PIX em 1 Toque',
      desc: 'Divida facilmente por 2, 3 ou 5 amigos. Copie a chave PIX oficial do estabelecimento ou peça a maquininha sem estresse.',
      color: 'from-cyan-400 to-sky-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0c141a] text-slate-100 rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between z-10 bg-[#0c141a]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-[0.2em] font-extrabold uppercase text-[#F6C76A]">
              ✦ Caraíva Digital • Mesa Inteligente
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area com Transições Framer Motion */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* ETAPA 1: O TOQUE MÁGICO 3D (APROXIME O CELULAR DA MESA) */}
            {step === 'tap' && (
              <motion.div
                key="step-tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center text-center space-y-6 my-auto"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-500/10 border border-teal-500/25 px-3 py-1 rounded-full">
                    Aproximação NFC / QR Code
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2 text-white tracking-tight">
                    Aproxime seu celular da mesa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                    Identificação instantânea sem digitar senhas ou baixar aplicativos.
                  </p>
                </div>

                {/* VISUAL 3D COM FRAMER MOTION: CELULAR APROXIMANDO DO TOTEM DA MESA */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Totem de Madeira da Mesa com Onda Eletromagnética NFC */}
                  <div className="relative w-44 h-44 rounded-full bg-gradient-to-br from-[#1b3a37] via-[#0f282a] to-[#09171a] border-2 border-teal-400/40 shadow-2xl flex items-center justify-center">
                    {/* Anéis de Sonar/NFC */}
                    <motion.div
                      animate={{
                        scale: [1, 1.45, 1.8],
                        opacity: [0.7, 0.3, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.2,
                        ease: 'easeOut',
                      }}
                      className="absolute inset-0 rounded-full border border-teal-400 pointer-events-none"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1.6],
                        opacity: [0.8, 0.4, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.2,
                        delay: 0.6,
                        ease: 'easeOut',
                      }}
                      className="absolute inset-0 rounded-full border border-amber-400 pointer-events-none"
                    />

                    {/* Logo/Badge da Mesa */}
                    <div className="text-center p-3 z-10">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 mx-auto flex items-center justify-center shadow-md mb-1.5">
                        <Radio className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider block">
                        {defaultTableNumber}
                      </span>
                      <span className="text-[9px] text-teal-200/80 font-medium block">
                        {defaultBusinessName}
                      </span>
                    </div>
                  </div>

                  {/* Smartphone 3D Flutuando e Aproximando com Física de Mola */}
                  <motion.div
                    animate={
                      isTapping
                        ? {
                            y: [ -80, 0, -5 ],
                            rotateX: [ 25, 0, 5 ],
                            rotateY: [ -15, 0, 0 ],
                            scale: [ 1, 1.1, 1.05 ],
                          }
                        : {
                            y: [ -60, -45, -60 ],
                            rotateX: 20,
                            rotateY: -10,
                            scale: 1,
                          }
                    }
                    transition={
                      isTapping
                        ? { duration: 1.1, ease: 'easeInOut' }
                        : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
                    }
                    style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                    className="absolute -top-4 w-28 h-48 bg-slate-900 border-2 border-white/60 rounded-2xl shadow-2xl p-1.5 flex flex-col justify-between cursor-pointer"
                    onClick={handleSimulateNfcTap}
                  >
                    {/* Notch do celular */}
                    <div className="w-8 h-2 bg-white/40 rounded-full mx-auto" />

                    {/* Tela do celular simulando detecção */}
                    <div className="flex-1 bg-gradient-to-b from-teal-900/60 to-slate-950 rounded-xl my-1 p-2 flex flex-col items-center justify-center text-center">
                      <Smartphone className="w-6 h-6 text-amber-400 mb-1" />
                      <span className="text-[8px] font-bold text-teal-200">
                        {hasTapped ? 'Conectado!' : 'Aproximando...'}
                      </span>
                    </div>

                    <div className="w-6 h-1 bg-white/20 rounded-full mx-auto" />
                  </motion.div>

                  {/* Feedback de Sucesso do Toque */}
                  {hasTapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/20 backdrop-blur-xs rounded-full flex items-center justify-center z-20"
                    >
                      <div className="p-3 bg-emerald-500 text-slate-950 rounded-full shadow-2xl flex items-center gap-1.5 font-black text-xs">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Mesa Reconhecida!</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Botão de Ação para Disparar Aproximação */}
                <div className="w-full space-y-2">
                  <button
                    type="button"
                    onClick={handleSimulateNfcTap}
                    disabled={isTapping}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>{isTapping ? 'Identificando Mesa...' : 'Aproximar Celular (Tocar na Mesa)'}</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Dica: No restaurante real, basta encostar no adesivo de madeira na mesa.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: APRESENTAÇÃO CINEMATOGRÁFICA DO MERCADO & BENEFÍCIOS */}
            {step === 'market_showcase' && (
              <motion.div
                key="step-showcase"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
                className="space-y-5 my-auto"
              >
                <div className="text-center">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mesa {defaultTableNumber} Conectada</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Como funciona em Caraíva
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Três vantagens exclusivas enquanto você relaxa na areia:
                  </p>
                </div>

                {/* Cards de Apresentação */}
                <div className="space-y-3">
                  {showcaseSlides.map((slide, idx) => {
                    const Icon = slide.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-400/30 transition-all flex items-start gap-3.5"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${slide.color} text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-teal-400">
                              {slide.tag}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">
                            {slide.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {slide.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Próximo Passo */}
                <button
                  type="button"
                  onClick={() => setStep('identify')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Continuar para a Mesa</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </motion.div>
            )}

            {/* ETAPA 3: IDENTIFICAÇÃO DO CLIENTE & ACESSO IMEDIATO */}
            {step === 'identify' && (
              <motion.div
                key="step-identify"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-5 my-auto"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-teal-400 text-slate-950 mx-auto flex items-center justify-center font-black shadow-lg mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Tudo pronto na {defaultTableNumber}!
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                    Informe seu nome para que o atendimento da vila chame você na mesa com carinho:
                  </p>
                </div>

                {/* Formulário de Identificação Simples */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Seu Nome ou Apelido
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Ana, Rodrigo, Casal Roots..."
                      maxLength={40}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-teal-400" />
                    <span>Seus dados ficam protegidos neste aparelho e vinculados à mesa.</span>
                  </div>
                </div>

                {/* Botões Finais */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Entrar na Mesa & Ver Conta / Cardápio</span>
                    <ChevronRight className="w-4 h-4 text-slate-950" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Continuar como Visitante Anônimo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CaraivaTableOnboardingModal;
