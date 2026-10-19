import React, { useState } from "react";
import { BubbleNavigation } from "./BubbleNavigation";
import { DEFAULT_BUBBLE_NAV_ITEMS, CARAIVA_ECOSYSTEM_NAV_ITEMS } from "./navigation.config";
import type { BubbleNavItem } from "./navigation.types";
import { Sparkles, Sliders, MoveHorizontal, Smartphone, Check, ArrowLeft } from "lucide-react";

export const BubbleNavigationShowcase: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [preset, setPreset] = useState<"standard" | "caraiva">("standard");
  const items = preset === "standard" ? DEFAULT_BUBBLE_NAV_ITEMS : CARAIVA_ECOSYSTEM_NAV_ITEMS;
  const [activeId, setActiveId] = useState<string>(items[0].id);

  // Controles Interativos de Teste
  const [enableDrag, setEnableDrag] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showTitleHeader, setShowTitleHeader] = useState(true);
  const [stiffness, setStiffness] = useState(320);
  const [damping, setDamping] = useState(28);
  const [mass, setMass] = useState(0.8);
  const [lastAction, setLastAction] = useState<string>("Pronto para interação");

  const currentItem = items.find((i) => i.id === activeId) || items[0];

  const handleTabChange = (id: string, item: BubbleNavItem) => {
    setActiveId(id);
    setLastAction(`Aba alterada para "${item.label}" (${id}) via clique ou snap de arraste`);
  };

  return (
    <div className="min-h-screen bg-[#07090A] text-[#FFF4ED] flex flex-col justify-between p-4 sm:p-8 font-sans select-none relative overflow-x-hidden">
      {/* Background glow sutil baseado na cor ativa */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: currentItem.color }}
      />

      {/* Header Superior */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4 z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] animate-pulse" />
              <h1 className="text-sm font-black tracking-widest uppercase text-white">
                Sliding Bubble Navigation
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Motion for React 19 • Pointer Events • Física de Mola
            </p>
          </div>
        </div>

        {/* Seletor de Preset */}
        <div className="flex bg-[#141719] p-1 rounded-xl border border-white/10 text-[10px]">
          <button
            onClick={() => {
              setPreset("standard");
              setActiveId("home");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              preset === "standard"
                ? "bg-[#84CC16] text-[#07090A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Padrão
          </button>
          <button
            onClick={() => {
              setPreset("caraiva");
              setActiveId("inicio");
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition ${
              preset === "caraiva"
                ? "bg-[#F6C945] text-[#07090A]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Caraíva
          </button>
        </div>
      </header>

      {/* Conteúdo Central Simulando a Página Ativa */}
      <main className="max-w-xl mx-auto w-full my-auto py-8 space-y-6 z-10">
        <div
          className="rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl transition-all duration-300 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(20, 23, 25, 0.9) 0%, rgba(10, 13, 15, 0.95) 100%)",
            borderColor: `${currentItem.color}40`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300"
                style={{ backgroundColor: `${currentItem.color}25`, color: currentItem.color }}
              >
                {React.createElement(currentItem.icon, { size: 22, className: "stroke-[2.5]" })}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tela Selecionada
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {currentItem.label}
                </h2>
              </div>
            </div>

            <span
              className="text-xs font-mono font-bold px-3 py-1 rounded-full border transition-colors duration-300"
              style={{
                borderColor: `${currentItem.color}50`,
                backgroundColor: `${currentItem.color}15`,
                color: currentItem.color,
              }}
            >
              ID: {currentItem.id}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            A bolha circular e o halo luminoso acompanham a posição do cursor tanto por clique direto quanto por{" "}
            <strong>arraste com o dedo no celular ou mouse no desktop</strong>, com snap elástico calculado por distância euclidiana.
          </p>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#F6C945] shrink-0" />
            <span className="truncate">{lastAction}</span>
          </div>
        </div>

        {/* Painel de Ajustes de Física e Comportamento */}
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-[#F6C945]" />
            <span>Laboratório de Física da Bolha</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Stiffness (Rigidez)</span>
                <span className="font-mono text-white">{stiffness}</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="10"
                value={stiffness}
                onChange={(e) => setStiffness(Number(e.target.value))}
                className="w-full accent-[#84CC16]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Damping (Amortecimento)</span>
                <span className="font-mono text-white">{damping}</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                className="w-full accent-[#06B6D4]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Mass (Massa)</span>
                <span className="font-mono text-white">{mass}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={mass}
                onChange={(e) => setMass(Number(e.target.value))}
                className="w-full accent-[#EC4899]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <button
              onClick={() => setEnableDrag(!enableDrag)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                enableDrag
                  ? "bg-[#84CC16]/15 border-[#84CC16]/40 text-[#84CC16]"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>Arraste: {enableDrag ? "Ativado" : "Desativado"}</span>
            </button>

            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                showLabels
                  ? "bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#06B6D4]"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Labels: {showLabels ? "Visíveis" : "Ocultas"}</span>
            </button>

            <button
              onClick={() => setShowTitleHeader(!showTitleHeader)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                showTitleHeader
                  ? "bg-[#EC4899]/15 border-[#EC4899]/40 text-[#EC4899]"
                  : "bg-white/5 border-white/10 text-slate-500"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Título Superior: {showTitleHeader ? "Visível" : "Oculto"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Componente Flutuante de Navegação */}
      <footer className="max-w-xl mx-auto w-full pt-4 pb-2 z-20">
        <BubbleNavigation
          items={items}
          activeId={activeId}
          onChange={handleTabChange}
          enableDrag={enableDrag}
          showLabels={showLabels}
          showTitleHeader={showTitleHeader}
          springConfig={{ stiffness, damping, mass }}
        />
      </footer>
    </div>
  );
};

export default BubbleNavigationShowcase;
