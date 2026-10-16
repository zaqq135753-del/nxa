import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  Sparkles,
  Flame,
  Plus,
  Check,
  Rotate3d,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";

export interface Floating3DDish {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
  category: string;
  temperature: "quente" | "gelado" | "fresco";
  ingredients: { name: string; x: string; y: string }[];
  customOptions: string[];
  solarVibe: string;
}

export const SHOWCASE_3D_DISHES: Floating3DDish[] = [
  {
    id: "3d-moqueca",
    name: "Moqueca Baiana Mista Borbulhante",
    subtitle: "Na Panela de Barro Tradicional",
    price: 145,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    category: "Prato Principal",
    temperature: "quente",
    ingredients: [
      { name: "Camarão Rosa Grelhado", x: "32%", y: "42%" },
      { name: "Dendê da Terra da Bahia", x: "65%", y: "35%" },
      { name: "Pescado Fresco de Caraíva", x: "50%", y: "65%" },
    ],
    customOptions: ["Sem Coentro", "Pimenta à Parte", "Extra Pirão", "Dendê Leve"],
    solarVibe: "Perfeita no almoço após banho de mar na Barra",
  },
  {
    id: "3d-pastel",
    name: "Pastel de Arraia Artesanal",
    subtitle: "Massa Estaladiça & Vinagrete de Caju",
    price: 38,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    category: "Entrada Ícone",
    temperature: "quente",
    ingredients: [
      { name: "Arraia Desfiada Úmida", x: "45%", y: "45%" },
      { name: "Massa Crocante Dourada", x: "68%", y: "30%" },
      { name: "Vinagrete de Caju Fresco", x: "28%", y: "65%" },
    ],
    customOptions: ["Pimenta da Casa", "Sem Cebola", "Limão Extra"],
    solarVibe: "O clássico imperdível para ver o pôr do sol no Rio",
  },
  {
    id: "3d-polvo",
    name: "Polvo Braseado na Lenha",
    subtitle: "Batatas ao Murro & Alho Confit",
    price: 128,
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    category: "Frutos do Mar",
    temperature: "quente",
    ingredients: [
      { name: "Tentáculos Macios Grelhados", x: "50%", y: "40%" },
      { name: "Batata Dourada Amassada", x: "30%", y: "60%" },
      { name: "Azeite de Ervas Nativas", x: "70%", y: "55%" },
    ],
    customOptions: ["Alho Suave", "Sem Páprica", "Ponto Macio"],
    solarVibe: "Jantar sob a luz de velas e brisa fresca da noite",
  },
  {
    id: "3d-caipirinha",
    name: "Caipirinha de Mel de Cacau",
    subtitle: "No Copo Baiano com Borda Gelada",
    price: 36,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    category: "Drink Autoral",
    temperature: "gelado",
    ingredients: [
      { name: "Polpa Carnuda de Cacau", x: "40%", y: "45%" },
      { name: "Mel de Cacau Selvagem", x: "60%", y: "35%" },
      { name: "Gengibre Ralado na Hora", x: "50%", y: "70%" },
    ],
    customOptions: ["Com Vodka", "Com Cachaça Envelhecida", "Sem Gengibre", "Extra Gelo"],
    solarVibe: "Refresco supremo para os pés na areia molhada",
  },
];

interface Caraiva3DFloatingDishShowcaseProps {
  onAddDishToCart?: (dishName: string, price: number, selectedOptions: string[]) => void;
  customDish?: Floating3DDish;
}

export const Caraiva3DFloatingDishShowcase: React.FC<Caraiva3DFloatingDishShowcaseProps> = ({
  onAddDishToCart,
  customDish,
}) => {
  const allDishes = customDish ? [customDish, ...SHOWCASE_3D_DISHES] : SHOWCASE_3D_DISHES;
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [selectedCustoms, setSelectedCustoms] = useState<string[]>([]);
  const [showPins, setShowPins] = useState(true);
  const [justAdded, setJustAdded] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentDish = allDishes[activeDishIndex] || allDishes[0];

  // Motion physics para o mouse tilt 3D
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-18deg", "18deg"]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const shadowOffsetX = useTransform(smoothX, [-0.5, 0.5], [24, -24]);
  const shadowOffsetY = useTransform(smoothY, [-0.5, 0.5], [16, 38]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const toggleCustomOption = (opt: string) => {
    setSelectedCustoms((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleNextDish = () => {
    setActiveDishIndex((prev) => (prev + 1) % SHOWCASE_3D_DISHES.length);
    setSelectedCustoms([]);
    setSpinDeg(0);
  };

  const handlePrevDish = () => {
    setActiveDishIndex((prev) => (prev - 1 + SHOWCASE_3D_DISHES.length) % SHOWCASE_3D_DISHES.length);
    setSelectedCustoms([]);
    setSpinDeg(0);
  };

  const handleOrderInstant = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([20, 30, 20]);
      } catch {}
    }
    setJustAdded(true);
    onAddDishToCart?.(currentDish.name, currentDish.price, selectedCustoms);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const spinDish = () => {
    setSpinDeg((prev) => prev + 90);
  };

  // Simulação de vapor quente ou frescor congelado
  const steamPuffs = useMemo(() => [1, 2, 3, 4], []);

  return (
    <div className="relative w-full rounded-3xl bg-[#090B0C] border border-[#F6C945]/30 p-4 sm:p-6 shadow-2xl overflow-hidden select-none">
      {/* GLOW DE FUNDO ATMOSFÉRICO */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#F6C945]/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-orange-600/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* CABEÇALHO DA EXPERIÊNCIA 3D */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#141719] border border-[#F6C945]/40 flex items-center justify-center text-[#F6C945] shadow-md">
            <Sparkles size={16} className="animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[#F6C945] block">
              EXPERIÊNCIA IMERSIVA 3D
            </span>
            <h3 className="text-base font-extrabold text-[#FFF4ED] leading-tight">
              Prato Vivo na Areia
            </h3>
          </div>
        </div>

        {/* CONTROLES DE NAVEGAÇÃO E INSPEÇÃO */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowPins((v) => !v)}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
              showPins
                ? "bg-[#F6C945] text-[#090B0C] border-[#F6C945]"
                : "bg-[#141719] text-[#FFF4ED]/70 border-white/10 hover:text-[#FFF4ED]"
            }`}
            title="Mostrar/Ocultar ingredientes em 3D"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Pins</span>
          </button>

          <button
            type="button"
            onClick={spinDish}
            className="p-2 rounded-xl bg-[#141719] text-[#F6C945] border border-white/10 hover:border-[#F6C945]/40 transition active:scale-95"
            title="Girar prato 90°"
          >
            <Rotate3d size={16} />
          </button>

          <div className="flex items-center gap-1 pl-1">
            <button
              type="button"
              onClick={handlePrevDish}
              className="w-8 h-8 rounded-xl bg-[#141719] border border-white/10 text-[#FFF4ED] hover:bg-white/10 flex items-center justify-center transition active:scale-90"
              aria-label="Prato anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextDish}
              className="w-8 h-8 rounded-xl bg-[#141719] border border-white/10 text-[#FFF4ED] hover:bg-white/10 flex items-center justify-center transition active:scale-90"
              aria-label="Próximo prato"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* PALCO 3D COM FÍSICA DE PROFUNDIDADE (STAGE CANVAS) */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative w-full h-72 sm:h-84 flex items-center justify-center cursor-grab active:cursor-grabbing perspective-1000 my-2"
        style={{ perspective: 1200 }}
      >
        {/* SOMBRA DINÂMICA DESLOCADA NO CHÃO DA MESA */}
        <motion.div
          style={{
            x: shadowOffsetX,
            y: shadowOffsetY,
          }}
          className="absolute w-56 sm:w-68 h-16 sm:h-20 rounded-full bg-black/65 blur-2xl pointer-events-none transform -translate-y-4"
        />

        {/* PRATO FLUTUANTE 3D (CAMADA PRINCIPAL SUSPENSA) */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateZ: spinDeg,
            y: [0, -8, 0],
          }}
          transition={{
            rotateZ: { type: "spring", stiffness: 120, damping: 15 },
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-56 h-56 sm:w-68 sm:h-68 rounded-full flex items-center justify-center pointer-events-auto"
        >
          {/* REFLEXO SOLAR DOURADO ESPECULAR */}
          <motion.div
            style={{
              background: `radial-gradient(circle 180px at ${glareX} ${glareY}, rgba(246, 201, 69, 0.45), transparent 75%)`,
            }}
            className="absolute inset-0 rounded-full pointer-events-none z-30"
          />

          {/* FOTO RECORTADA DO PRATO COM BORDA DE CERÂMICA RÚSTICA */}
          <div
            className="w-full h-full rounded-full overflow-hidden p-2.5 bg-gradient-to-tr from-[#141719] via-[#241f17] to-[#3a301a] border-4 border-[#F6C945]/40 shadow-2xl relative"
            style={{
              transform: "translateZ(38px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
            }}
          >
            <img
              src={currentDish.image}
              alt={currentDish.name}
              className="w-full h-full object-cover rounded-full pointer-events-none"
            />
          </div>

          {/* SIMULAÇÃO DE VAPOR QUENTE SUBINDO DA COMIDA */}
          {currentDish.temperature === "quente" && (
            <div className="absolute inset-0 pointer-events-none overflow-visible z-40">
              {steamPuffs.map((puff) => (
                <motion.div
                  key={puff}
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{
                    opacity: [0, 0.45, 0],
                    y: [-10, -70 - puff * 10],
                    x: [0, (puff % 2 === 0 ? 15 : -15)],
                    scale: [0.6, 1.4, 2],
                  }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    delay: puff * 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-1/3 -translate-x-1/2 w-12 h-12 rounded-full bg-white/20 blur-xl"
                />
              ))}
            </div>
          )}

          {/* PINS 3D FLUTUANTES COM INGREDIENTES */}
          <AnimatePresence>
            {showPins &&
              currentDish.ingredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  style={{
                    left: ing.x,
                    top: ing.y,
                    transform: "translateZ(65px)",
                  }}
                  className="absolute z-50 pointer-events-none"
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#090B0C]/90 border border-[#F6C945] text-[#FFF4ED] text-[10px] font-black shadow-xl backdrop-blur-md whitespace-nowrap animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6C945]" />
                    <span>{ing.name}</span>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* DETALHES, CUSTOMIZAÇÃO EXPRESSA E BOTÃO DE 1-TOQUE */}
      <div className="relative z-10 space-y-3.5 pt-2 border-t border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#F6C945]/20 text-[#F6C945] text-[10px] font-black border border-[#F6C945]/30">
                {currentDish.category}
              </span>
              <span className="text-xs text-[#FFF4ED]/60 flex items-center gap-1">
                <Flame size={12} className="text-orange-400" />
                {currentDish.temperature === "quente" ? "Servido Fervendo no Barro" : "Copo Super Gelado"}
              </span>
            </div>
            <h4 className="text-lg font-black text-[#FFF4ED] mt-1">{currentDish.name}</h4>
            <p className="text-xs text-[#FFF4ED]/70 italic mt-0.5">{currentDish.subtitle}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#FFF4ED]/50 block uppercase tracking-wider">Valor</span>
            <span className="text-xl font-black text-[#F6C945]">R$ {currentDish.price}</span>
          </div>
        </div>

        {/* Dica Solar Nativa */}
        <div className="p-2.5 rounded-xl bg-[#141719] border border-white/5 flex items-center gap-2 text-xs text-[#FFF4ED]/80">
          <Info size={14} className="text-[#F6C945] shrink-0" />
          <span>{currentDish.solarVibe}</span>
        </div>

        {/* CUSTOMIZAÇÃO RÁPIDA (CHIPS INTERATIVOS) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#FFF4ED]/75 block">
            Ajustes Rápidos para a Cozinha:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentDish.customOptions.map((opt) => {
              const active = selectedCustoms.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggleCustomOption(opt)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition border ${
                    active
                      ? "bg-[#F6C945] text-[#090B0C] border-[#F6C945] font-black shadow-md"
                      : "bg-[#141719] text-[#FFF4ED]/70 border-white/10 hover:border-white/20"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTÃO ABSURDO DE PEDIDO EXPRESSO */}
        <button
          type="button"
          onClick={handleOrderInstant}
          className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
            justAdded
              ? "bg-emerald-500 text-white shadow-emerald-500/30"
              : "bg-gradient-to-r from-[#F6C945] via-amber-400 to-[#e5b738] hover:from-[#e5b738] hover:to-amber-500 text-[#090B0C] shadow-[#F6C945]/30"
          }`}
        >
          {justAdded ? (
            <>
              <Check size={18} />
              <span>Prato Adicionado à Comanda na Areia!</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>Pedir {currentDish.name.split(" ")[0]} Agora · R$ {currentDish.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
