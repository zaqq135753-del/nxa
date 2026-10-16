import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CaraivaSensoryCard } from "./CaraivaSensoryCard";
import { CaraivaHapticButton } from "./CaraivaHapticButton";
import { CaraivaLivingOrb, type OrbState } from "./CaraivaLivingOrb";
import { CaraivaLiquidTabs, type NavTabId } from "./CaraivaLiquidTabs";
import { CaraivaTideScrubber } from "./CaraivaTideScrubber";
import { Sparkles, Moon, Sun } from "lucide-react";

export const CaraivaExperienceShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTabId>("inicio");
  const [orbState, setOrbState] = useState<OrbState>("standard");
  const [nightMode, setNightMode] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const cycleOrbState = () => {
    const states: OrbState[] = ["standard", "live", "thinking", "pin", "nfc"];
    const nextIdx = (states.indexOf(orbState) + 1) % states.length;
    setOrbState(states[nextIdx]);
    showToast(`Caraíva Orb: Estado ${states[nextIdx].toUpperCase()}`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 pb-32 ${
        nightMode
          ? "bg-[#090B0C] text-[#FFF4ED]"
          : "bg-[#F7F3E9] text-[#141719]"
      }`}
    >
      {/* Toast Notificação */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="px-4 py-2 rounded-full bg-[#141719]/95 border border-[#F6C945]/40 text-[#F6C945] text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header do Showroom */}
      <header className="sticky top-0 z-40 px-6 py-4 backdrop-blur-xl bg-[#090B0C]/80 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CaraivaLivingOrb
            state={orbState}
            size={40}
            onClick={cycleOrbState}
          />
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-[#FFF4ED]">
              CARAÍVA DIGITAL
            </h1>
            <span className="text-[10px] text-[#F6C945] font-semibold tracking-wider">
              SHOWROOM EXPERIENCIAL VIVA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Seletor Rápido de Estados do Orb */}
          <div className="hidden sm:flex items-center gap-1 bg-[#141719] p-1 rounded-xl border border-white/10 text-[10px]">
            {(["standard", "live", "thinking", "pin", "nfc"] as OrbState[]).map((st) => (
              <button
                key={st}
                onClick={() => setOrbState(st)}
                className={`px-2 py-1 rounded-lg uppercase font-bold transition ${
                  orbState === st
                    ? "bg-[#F6C945] text-[#090B0C]"
                    : "text-[#FFF4ED]/60 hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNightMode(!nightMode)}
            className="p-2.5 rounded-xl bg-[#141719] border border-white/10 text-[#F6C945] transition hover:scale-105"
            title="Alternar Modo Noite / Dia"
          >
            {nightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Conteúdo Principal com Transição Líquida */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-10">
        {/* Banner Explicativo */}
        <section className="p-5 rounded-3xl bg-[#141719] border border-[#F6C945]/20 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-[#F6C945]">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-xs font-black uppercase tracking-wider">
              Arquitetura de Sensações & Interações Inovadoras
            </h2>
          </div>
          <p className="text-xs text-[#FFF4ED]/80 leading-relaxed">
            Experimente abaixo as inovações que desenhamos para o turista: inclinação 3D dos cards com brilho especular de areia, resposta tátil nos botões, tábua de marés interativa e os 5 estados dinâmicos do Caraíva Orb.
          </p>
        </section>

        {/* 1. Tábua de Marés Viva */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F6C945]">
              1. Tábua de Marés Interativa (24h Scrubbing)
            </h2>
            <span className="text-[11px] text-[#FFF4ED]/50">
              Arraste a linha do tempo abaixo
            </span>
          </div>

          <div className="flex justify-center">
            <CaraivaTideScrubber />
          </div>
        </section>

        {/* 2. Cards Sensoriais 3D com Reflexo de Areia */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F6C945]">
              2. Cards 3D com Brilho Especular & Profundidade
            </h2>
            <span className="text-[11px] text-[#FFF4ED]/50">
              Passe o mouse ou incline com o dedo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
            <CaraivaSensoryCard
              title="Boteco do Pará"
              category="Gastronomia Nativa"
              tagline="O clássico pastel de arraia com cerveja gelada na beira do rio, vendo as canoas passarem."
              imageUrl="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              rating={4.9}
              walkingMinutes={3}
              tideTip="Melhor mesa às 17h para o pôr do sol"
              isOpenNow={true}
              onExplore={() => showToast("Abrindo Boteco do Pará...")}
            />

            <CaraivaSensoryCard
              title="Pousada Vila do Rio"
              category="Hospedagem & Charme"
              tagline="Bangalôs de madeira nobre entre o mangue e o mar, com café da manhã servido no deck."
              imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
              rating={5.0}
              walkingMinutes={6}
              tideTip="Travessia de canoa privativa incluída"
              isOpenNow={true}
              onExplore={() => showToast("Abrindo Pousada Vila do Rio...")}
            />
          </div>
        </section>

        {/* 3. Botões Táteis com Física de Pressão e Haptics */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#F6C945]">
            3. Botões Físicos com Feedback Háptico
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 p-6 rounded-3xl bg-[#141719] border border-white/5">
            <CaraivaHapticButton
              variant="primary"
              onClick={() => showToast("Toque da Madeira com Vibração!")}
            >
              Explorar Caraíva
            </CaraivaHapticButton>

            <CaraivaHapticButton
              variant="secondary"
              tidePulse="optimal"
              onClick={() => showToast("Maré Baixa: Partiu Corumbau!")}
            >
              Piscinas do Satu (Maré Ótima)
            </CaraivaHapticButton>

            <CaraivaHapticButton
              variant="glass"
              tidePulse="rising"
              onClick={() => showToast("Aviso: Maré Subindo em 40min")}
            >
              Alerta de Maré
            </CaraivaHapticButton>

            <CaraivaHapticButton
              variant="outline"
              onClick={cycleOrbState}
            >
              Mudar Estado do Orb
            </CaraivaHapticButton>
          </div>
        </section>

        {/* 4. Os 5 Estados Oficiais do Caraíva Orb */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#F6C945]">
              4. Os 5 Estados Vivos do Caraíva Orb
            </h2>
            <span className="text-[11px] text-[#FFF4ED]/50">
              Toque em qualquer orb
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-6 rounded-3xl bg-[#141719] border border-white/5 justify-items-center">
            <CaraivaLivingOrb
              state="standard"
              size={56}
              showStatusLabel
              onClick={() => {
                setOrbState("standard");
                showToast("Orb: Modo Padrão");
              }}
            />
            <CaraivaLivingOrb
              state="live"
              size={56}
              showStatusLabel
              onClick={() => {
                setOrbState("live");
                showToast("Orb: Modo Ao Vivo");
              }}
            />
            <CaraivaLivingOrb
              state="thinking"
              size={56}
              showStatusLabel
              onClick={() => {
                setOrbState("thinking");
                showToast("Orb: Modo Concierge Pensando");
              }}
            />
            <CaraivaLivingOrb
              state="pin"
              size={56}
              showStatusLabel
              onClick={() => {
                setOrbState("pin");
                showToast("Orb: Modo Fixação no Mapa");
              }}
            />
            <CaraivaLivingOrb
              state="nfc"
              size={56}
              showStatusLabel
              onClick={() => {
                setOrbState("nfc");
                showToast("Orb: Modo Leitura NFC/QR");
              }}
            />
          </div>
        </section>
      </main>

      {/* 5. Barra de Navegação com Abas Líquidas no Rodapé */}
      <CaraivaLiquidTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          showToast(`Navegando para: ${tab.toUpperCase()}`);
        }}
        orbState={orbState}
        onOrbClick={cycleOrbState}
      />
    </div>
  );
};

export default CaraivaExperienceShowcase;
