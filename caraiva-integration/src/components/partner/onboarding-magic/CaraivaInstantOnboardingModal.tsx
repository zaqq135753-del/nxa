import React, { useState } from "react";
import {
  Sparkles,
  Utensils,
  MapPin,
  DollarSign,
  Phone,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Flame,
  CreditCard,
} from "lucide-react";

export interface InstantBusinessData {
  name: string;
  category: "restaurantes" | "bares" | "cafes" | "hospedagens" | "noite" | "passeios";
  locationRef: string;
  highlightDishName: string;
  highlightDishDesc: string;
  highlightDishPrice: number;
  highlightDishImage: string;
  whatsapp: string;
  pixKey: string;
}

interface CaraivaInstantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBuilding: (data: InstantBusinessData) => void;
  initialInviteCode?: string;
}

const CATEGORY_OPTIONS = [
  {
    id: "restaurantes",
    label: "Gastronomia",
    emoji: "🍽️",
    color: "#F59E0B",
    bgClass: "from-amber-500/20 to-amber-900/10 border-amber-500/40",
    desc: "Moquecas, frutos do mar, bistrôs e sabor baiano",
  },
  {
    id: "bares",
    label: "Bar & Drinks",
    emoji: "🍹",
    color: "#EF4444",
    bgClass: "from-red-500/20 to-red-900/10 border-red-500/40",
    desc: "Coquetelaria de praia, cervejas artesanais e petiscos",
  },
  {
    id: "hospedagens",
    label: "Pousada & Suítes",
    emoji: "🏨",
    color: "#8B5CF6",
    bgClass: "from-purple-500/20 to-purple-900/10 border-purple-500/40",
    desc: "Charme rústico, pés na areia e café da manhã",
  },
  {
    id: "noite",
    label: "Forró & Luau",
    emoji: "♫",
    color: "#EC4899",
    bgClass: "from-pink-500/20 to-pink-900/10 border-pink-500/40",
    desc: "Tradição do arrasta-pé, música ao vivo e noite mágica",
  },
  {
    id: "passeios",
    label: "Passeios & Experiências",
    emoji: "🚤",
    color: "#06B6D4",
    bgClass: "from-cyan-500/20 to-cyan-900/10 border-cyan-500/40",
    desc: "Descida de boia, Corumbau, Satu e passeios de barco",
  },
  {
    id: "cafes",
    label: "Café & Doceria",
    emoji: "☕",
    color: "#10B981",
    bgClass: "from-emerald-500/20 to-emerald-900/10 border-emerald-500/40",
    desc: "Pães de fermentação natural, café especial e açaí",
  },
] as const;

const CARAIVA_LOCATIONS = [
  "Beira-Rio (Orla dos Barcos)",
  "Beco da Lua",
  "Rua do Meio",
  "Largo da Matriz (Igrejinha)",
  "Praia da Barra (Encontro do Rio)",
  "Praia Principal de Caraíva",
  "Caminho do Xandó",
];

const PRESET_DISH_IMAGES = [
  {
    label: "Polvo Grelhado na Brasa",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Moqueca Baiana Fumegante",
    url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Drink Cacau & Maracujá",
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Pastéis de Siri com Pimenta",
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
  },
];

export const CaraivaInstantOnboardingModal: React.FC<CaraivaInstantOnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartBuilding,
  initialInviteCode = "CARAIVA-2026-VIP",
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<InstantBusinessData>({
    name: "",
    category: "restaurantes",
    locationRef: "Beira-Rio (Orla dos Barcos)",
    highlightDishName: "",
    highlightDishDesc: "",
    highlightDishPrice: 85,
    highlightDishImage: PRESET_DISH_IMAGES[0].url,
    whatsapp: "",
    pixKey: "",
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      if (!formData.highlightDishName.trim()) {
        formData.highlightDishName = "Prato Especial da Casa";
      }
      setStep(3);
    } else if (step === 3) {
      onStartBuilding(formData);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((step - 1) as 1 | 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#141719] border border-[#F6C945]/30 shadow-2xl text-[#FFF4ED] flex flex-col">
        {/* Barra de Progresso do Onboarding */}
        <div className="sticky top-0 z-30 bg-[#141719]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F6C945] text-[#090B0C] flex items-center justify-center font-black text-sm">
              C
            </div>
            <div>
              <span className="text-xs font-bold text-[#F6C945] uppercase tracking-wider block">
                Onboarding em 3 Passos
              </span>
              <span className="text-xs text-[#FFF4ED]/60 font-medium">
                Passo {step} de 3 — {step === 1 ? "Identidade da Casa" : step === 2 ? "Prato Estrela" : "Conexão & TapTable"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador de Bolinhas */}
            <div className="flex gap-1.5 mr-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    s === step
                      ? "bg-[#F6C945] w-6"
                      : s < step
                      ? "bg-[#10B981]"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico por Passo */}
        <div className="p-6 space-y-6 flex-1">
          {/* PASSO 1: Nome & Categoria */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-[#FFF4ED] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#F6C945]" />
                  Como Caraíva conhece seu lugar?
                </h3>
                <p className="text-xs text-[#FFF4ED]/60 mt-1">
                  Digite o nome que ficará na placa de madeira entalhada e no mapa da vila.
                </p>
              </div>

              {/* Input Nome do Negócio */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                  Nome do Estabelecimento *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Boteco do Pará, Bistrô Beira-Rio, Pousada da Nelma..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-base text-[#FFF4ED] placeholder-white/30 transition-colors"
                  autoFocus
                />
              </div>

              {/* Seleção de Categoria */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-2">
                  Qual é a Alma do seu Negócio?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id as any })}
                        className={`p-3 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? `bg-gradient-to-br ${cat.bgClass} border-2 shadow-lg`
                            : "bg-[#090B0C]/60 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-2xl">{cat.emoji}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F6C945]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#FFF4ED]">{cat.label}</div>
                          <div className="text-[10px] text-white/50 leading-tight mt-0.5 line-clamp-1">{cat.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Localização em Caraíva */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                  Ponto de Referência na Vila
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#F6C945]" />
                  <select
                    value={formData.locationRef}
                    onChange={(e) => setFormData({ ...formData, locationRef: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-xs text-[#FFF4ED] transition-colors appearance-none"
                  >
                    {CARAIVA_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#141719] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: Prato ou Diferencial Estrela */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-[#FFF4ED] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#F6C945]" />
                  Seu Prato ou Diferencial Estrela
                </h3>
                <p className="text-xs text-[#FFF4ED]/60 mt-1">
                  Aquele item que todo turista precisa provar. Criaremos a prévia em 3D flutuante dele na hora!
                </p>
              </div>

              {/* Nome do Prato */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                  Nome da Especialidade *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Polvo Grelhado na Brasa com Purê de Mandioca"
                  value={formData.highlightDishName}
                  onChange={(e) => setFormData({ ...formData, highlightDishName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-base text-[#FFF4ED] placeholder-white/30 transition-colors"
                  autoFocus
                />
              </div>

              {/* Descrição & Preço */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                    Descrição Sensorial (Ingredientes marcantes)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Pescado fresco, azeite de dendê da terra, coentro e limão cravo"
                    value={formData.highlightDishDesc}
                    onChange={(e) => setFormData({ ...formData, highlightDishDesc: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-xs text-[#FFF4ED] placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                    Preço Sugerido (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-[#F6C945]" />
                    <input
                      type="number"
                      value={formData.highlightDishPrice}
                      onChange={(e) => setFormData({ ...formData, highlightDishPrice: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-sm text-[#FFF4ED]"
                    />
                  </div>
                </div>
              </div>

              {/* Escolha Rápida de Foto de Referência para Efeito 3D */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-2">
                  Foto de Referência para Animação 3D do Prato
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PRESET_DISH_IMAGES.map((preset, idx) => {
                    const isSelected = formData.highlightDishImage === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, highlightDishImage: preset.url })}
                        className={`relative rounded-xl overflow-hidden aspect-square cursor-pointer border-2 transition-all ${
                          isSelected ? "border-[#F6C945] shadow-lg shadow-[#F6C945]/30 scale-[1.03]" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black via-black/60 to-transparent text-[9px] font-medium text-white truncate text-center">
                          {preset.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: Conexão, WhatsApp & TapTable */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-[#FFF4ED] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#F6C945]" />
                  Conexão de Vendas & TapTable
                </h3>
                <p className="text-xs text-[#FFF4ED]/60 mt-1">
                  Onde você receberá os avisos de pedidos, reservas de mesas e pagamentos dos clientes.
                </p>
              </div>

              {/* WhatsApp de Pedidos */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                  WhatsApp para Notificação de Pedidos & Reservas *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#25D366]" />
                  <input
                    type="tel"
                    placeholder="Ex: (73) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#25D366] focus:outline-none text-base text-[#FFF4ED] placeholder-white/30"
                    autoFocus
                  />
                </div>
              </div>

              {/* Chave Pix para Recebimento */}
              <div>
                <label className="text-xs font-semibold text-[#F6C945] uppercase tracking-wider block mb-1.5">
                  Chave Pix para Comanda TapTable (Opcional agora)
                </label>
                <input
                  type="text"
                  placeholder="CNPJ, E-mail, Celular ou Chave Aleatória"
                  value={formData.pixKey}
                  onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-[#090B0C] border border-white/15 focus:border-[#F6C945] focus:outline-none text-xs text-[#FFF4ED] placeholder-white/30"
                />
              </div>

              {/* Resumo do que acontecerá a seguir */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F6C945]/10 via-[#141719] to-[#090B0C] border border-[#F6C945]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F6C945]">
                  <Sparkles className="w-4 h-4 animate-spin text-[#F6C945]" style={{ animationDuration: "4s" }} />
                  O que vai acontecer no próximo segundo:
                </div>
                <ul className="text-xs text-[#FFF4ED]/80 space-y-1 list-disc list-inside">
                  <li>O casario colonial 3D do <strong>{formData.name || "seu espaço"}</strong> será erguido tijolo a tijolo na areia.</li>
                  <li>Sua placa entalhada de madeira será esculpida na fachada.</li>
                  <li>O cardápio interativo e a Mesa 01 NFC do TapTable serão gerados ao vivo.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Navegação */}
        <div className="sticky bottom-0 z-30 bg-[#141719]/95 backdrop-blur-sm border-t border-white/10 px-6 py-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FFF4ED]/80 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div className="text-[11px] text-white/40 font-mono">
              Convite: {initialInviteCode}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={step === 1 && !formData.name.trim()}
            className={`py-3 px-6 rounded-2xl font-extrabold text-sm tracking-wide shadow-lg flex items-center gap-2 transition-all ${
              step === 1 && !formData.name.trim()
                ? "bg-stone-800 text-stone-500 border border-white/5 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-[#F6C945] to-[#D97706] text-[#090B0C] hover:brightness-110 active:scale-95 shadow-[#F6C945]/30 cursor-pointer"
            }`}
          >
            {step === 3 ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>✨ Construir Meu Espaço em 3D</span>
              </>
            ) : (
              <>
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
