import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import {
  Sparkles,
  CheckCircle2,
  Utensils,
  Share2,
  Smartphone,
  ExternalLink,
  MapPin,
  Flame,
  Award,
  Layers,
  QrCode,
  ArrowRight,
  Copy,
  Check,
  Send,
} from "lucide-react";
import type { InstantBusinessData } from "./CaraivaInstantOnboardingModal";
import { Caraiva3DFloatingDishShowcase } from "../../guia/business-detail/Caraiva3DFloatingDishShowcase";

interface CaraivaBusinessLiveRevealProps {
  businessData: InstantBusinessData;
  onExploreMap: () => void;
  onOpenDashboard: () => void;
  onRestart: () => void;
}

export const CaraivaBusinessLiveReveal: React.FC<CaraivaBusinessLiveRevealProps> = ({
  businessData,
  onExploreMap,
  onOpenDashboard,
  onRestart,
}) => {
  const [activeTab, setActiveTab] = useState<"menu" | "table" | "share">("menu");
  const [tableQrUrl, setTableQrUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const businessSlug = businessData.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/guia?business=${businessSlug}`
    : `https://caraiva.digital/guia?business=${businessSlug}`;

  const tableOrderUrl = typeof window !== "undefined"
    ? `${window.location.origin}/guia/checkout/${businessSlug}?mesa=1`
    : `https://caraiva.digital/guia/checkout/${businessSlug}?mesa=1`;

  useEffect(() => {
    QRCode.toDataURL(tableOrderUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#090B0C",
        light: "#F6C945",
      },
    })
      .then((url) => setTableQrUrl(url))
      .catch((err) => console.error("Erro ao gerar QR Code de Mesa", err));
  }, [tableOrderUrl]);

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in"
      style={{ color: "#FFF4ED" }}
    >
      {/* Banner de Celebração de Boas-Vindas */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-center shadow-2xl border"
        style={{
          background: "linear-gradient(135deg, #1E1915 0%, #141719 50%, #090B0C 100%)",
          borderColor: "rgba(246, 201, 69, 0.4)",
          color: "#FFF4ED",
        }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40 text-[#F6C945]" />
        </div>

        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 0.4)",
            color: "#10B981",
          }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Espaço Construído com Sucesso
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: "#FFF4ED" }}>
          Bem-vindo à Vila, <span style={{ color: "#F6C945" }}>{businessData.name}</span>!
        </h1>
        <p className="text-xs sm:text-sm max-w-md mx-auto mt-2" style={{ color: "rgba(255, 244, 237, 0.75)" }}>
          Seu casario colonial digital foi registrado na beira-rio de Caraíva. Seu cardápio 3D sensorial e comanda TapTable estão prontos para receber clientes.
        </p>

        {/* Localização & Categoria */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span
            className="flex items-center gap-1 px-3 py-1 rounded-full border"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFF4ED",
            }}
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "#F6C945" }} />
            {businessData.locationRef}
          </span>
          <span
            className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold border"
            style={{
              backgroundColor: "rgba(246, 201, 69, 0.15)",
              borderColor: "rgba(246, 201, 69, 0.35)",
              color: "#F6C945",
            }}
          >
            <Award className="w-3.5 h-3.5" />
            Parceiro Oficial Caraíva Digital
          </span>
        </div>
      </div>

      {/* Tabs de Prévia Interativa */}
      <div className="flex rounded-2xl bg-[#090B0C] p-1.5 border border-white/10">
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
            activeTab === "menu"
              ? "bg-[#F6C945] text-[#090B0C] shadow-md shadow-[#F6C945]/20"
              : "text-[#FFF4ED]/60 hover:text-[#FFF4ED]"
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Prato 3D Flutuante</span>
        </button>

        <button
          onClick={() => setActiveTab("table")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
            activeTab === "table"
              ? "bg-[#F6C945] text-[#090B0C] shadow-md shadow-[#F6C945]/20"
              : "text-[#FFF4ED]/60 hover:text-[#FFF4ED]"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Mesa 01 TapTable NFC</span>
        </button>

        <button
          onClick={() => setActiveTab("share")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all ${
            activeTab === "share"
              ? "bg-[#F6C945] text-[#090B0C] shadow-md shadow-[#F6C945]/20"
              : "text-[#FFF4ED]/60 hover:text-[#FFF4ED]"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar</span>
        </button>
      </div>

      {/* TAB 1: Prato 3D Flutuante com Vapor */}
      {activeTab === "menu" && (
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-semibold text-[#F6C945] tracking-wide flex items-center justify-center gap-1.5 uppercase">
              <Flame className="w-3.5 h-3.5 text-[#F6C945]" />
              Prévia do Prato Estrela em 3D Sensorial
            </span>
            <p className="text-xs text-[#FFF4ED]/60">
              Profundidade física 2.5D, reflexo solar da Bahia e simulação de vapor quente ativo.
            </p>
          </div>

          <Caraiva3DFloatingDishShowcase
            customDish={{
              id: "custom-star-dish",
              name: businessData.highlightDishName || "Especialidade da Casa",
              subtitle: businessData.name,
              price: businessData.highlightDishPrice || 85,
              image: businessData.highlightDishImage,
              category: "Especialidade da Casa",
              temperature: "quente",
              ingredients: [
                { name: "Pescado / Ingrediente Nobre", x: "40%", y: "45%" },
                { name: "Tempero Fresco da Bahia", x: "60%", y: "35%" },
                { name: "Azeite e Ervas Locais", x: "50%", y: "65%" },
              ],
              customOptions: ["Sem Coentro", "Pimenta à Parte", "Porção Individual", "Para Compartilhar"],
              solarVibe: `Prato estrela de ${businessData.name} sob o sol de Caraíva`,
            }}
            onAddDishToCart={(dish, price) => alert(`Prato "${dish}" (R$ ${price}) adicionado à comanda de teste!`)}
          />
        </div>
      )}

      {/* TAB 2: Mesa 01 TapTable NFC */}
      {activeTab === "table" && (
        <div className="rounded-3xl bg-[#141719] border border-white/10 p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F6C945]/15 border border-[#F6C945]/30 flex items-center justify-center text-[#F6C945]">
            <Smartphone className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#FFF4ED]">
              Display de Mesa TapTable — Mesa 01
            </h3>
            <p className="text-xs text-[#FFF4ED]/60 max-w-sm mx-auto mt-1">
              Escaneie este QR Code com outro celular ou clique para simular o cliente sentado na sua mesa fazendo o pedido sem garçom.
            </p>
          </div>

          {/* Placa da Mesa com QR Code */}
          <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#1E1915] to-[#090B0C] border-2 border-[#F6C945]/40 shadow-2xl flex flex-col items-center">
            <div className="text-[10px] font-mono tracking-widest text-[#F6C945] uppercase mb-2">
              {businessData.name} • Mesa 01
            </div>

            {tableQrUrl ? (
              <img
                src={tableQrUrl}
                alt="QR Code da Mesa 01"
                className="w-48 h-48 rounded-2xl object-contain shadow-inner"
              />
            ) : (
              <div className="w-48 h-48 rounded-2xl bg-[#090B0C] flex items-center justify-center">
                <QrCode className="w-12 h-12 text-[#F6C945] animate-pulse" />
              </div>
            )}

            <div className="mt-3 text-[11px] font-semibold text-[#FFF4ED]/80 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F6C945]" />
              TapTable NFC & Pix Direto
            </div>
          </div>

          <a
            href={tableOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-[#FFF4ED] transition-colors"
          >
            <span>Simular Pedido do Cliente na Mesa 01</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#F6C945]" />
          </a>
        </div>
      )}

      {/* TAB 3: Compartilhar & Link Público */}
      {activeTab === "share" && (
        <div className="rounded-3xl bg-[#141719] border border-white/10 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#FFF4ED]">
              Link Oficial da sua Casa em Caraíva
            </h3>
            <p className="text-xs text-[#FFF4ED]/60 mt-1">
              Divulgue este link no perfil do Instagram do seu restaurante ou envie para clientes que perguntarem onde comer na vila.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#090B0C] border border-white/10">
            <span className="text-xs font-mono text-[#F6C945] truncate flex-1 pl-2">
              {publicUrl}
            </span>
            <button
              onClick={copyPublicLink}
              className="py-2 px-3.5 rounded-xl bg-[#F6C945] text-[#090B0C] font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Conheça nosso espaço no Caraíva Digital: ${businessData.name}! Peça pratos e reserve mesa ao vivo: ${publicUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 text-xs text-[#25D366] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Enviar no WhatsApp</span>
            </a>

            <button
              onClick={onExploreMap}
              className="py-3 px-4 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 hover:bg-[#06B6D4]/25 text-xs text-[#06B6D4] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Ver Minha Casa no Mapa 3D</span>
            </button>
          </div>
        </div>
      )}

      {/* Ações Finais / Acesso ao Painel */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onOpenDashboard}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F6C945] to-[#D97706] text-[#090B0C] font-bold text-sm tracking-wide shadow-lg shadow-[#F6C945]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Acessar Painel Gerencial do Parceiro</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-[#141719] hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#FFF4ED]/70 hover:text-[#FFF4ED] transition-colors"
        >
          Cadastrar Outro Estabelecimento
        </button>
      </div>
    </div>
  );
};
