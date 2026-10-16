import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Sparkles,
  Smartphone,
  QrCode,
  Share2,
  Copy,
  Check,
  Zap,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface CaraivaNfcPresentationCardProps {
  onStartOnboarding: () => void;
  inviteCode?: string;
  repName?: string;
}

export const CaraivaNfcPresentationCard: React.FC<CaraivaNfcPresentationCardProps> = ({
  onStartOnboarding,
  inviteCode = "CARAIVA-2026-VIP",
  repName = "Consultor Oficial Caraíva Digital",
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const onboardingUrl = typeof window !== "undefined"
    ? `${window.location.origin}/parceiros/cadastro?invite=${inviteCode}`
    : `https://caraiva.digital/parceiros/cadastro?invite=${inviteCode}`;

  useEffect(() => {
    QRCode.toDataURL(onboardingUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: "#090B0C",
        light: "#F6C945",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Erro ao gerar QR Code", err));
  }, [onboardingUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(onboardingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const simulateNfcTap = () => {
    setIsNfcActive(true);
    setTimeout(() => {
      setIsNfcActive(false);
      onStartOnboarding();
    }, 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 text-[#FFF4ED] flex flex-col items-center">
      {/* Header Sensorial */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F6C945]/10 border border-[#F6C945]/30 text-[#F6C945] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Onboarding Mágico Caraíva & TapTable
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF4ED]">
          Desperte seu Estabelecimento em <span className="text-[#F6C945]">Caraíva</span>
        </h2>
        <p className="text-sm text-[#FFF4ED]/70 max-w-md mx-auto">
          Apresentação inteligente para parceiros: aproxime o celular da tag NFC ou escaneie o QR Code para construir sua vila digital ao vivo em segundos.
        </p>
      </div>

      {/* Cartão de Madeira Nobre & Ouro Interativo */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative w-full max-w-sm aspect-[1/1.45] rounded-3xl p-6 shadow-2xl overflow-hidden cursor-pointer border border-[#F6C945]/40 flex flex-col justify-between"
      >
        {/* Background Madeira Nobre Escura & Textura de Areia */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1915] via-[#141719] to-[#090B0C] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F6C945]/15 via-transparent to-transparent pointer-events-none z-0" />
        
        {/* Veios de Madeira Rústica Sutis */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(246, 201, 69, 0.05) 0px, rgba(246, 201, 69, 0.05) 2px, transparent 2px, transparent 12px)`,
          }}
        />

        {/* Reflexo Especular Sol da Bahia */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(246, 201, 69, 0.25) 0%, transparent 60%)`,
          }}
        />

        {/* Topo do Card */}
        <div className="relative z-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F6C945] flex items-center justify-center text-[#090B0C] font-black text-xl shadow-lg shadow-[#F6C945]/30">
              C
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-[#F6C945] uppercase">
                Caraíva Digital
              </div>
              <div className="text-[11px] text-[#FFF4ED]/60 font-mono">
                TapTable Smart Ecosystem
              </div>
            </div>
          </div>

          {/* Ícone NFC com Animação de Onda */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              simulateNfcTap();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#F6C945]/50 transition-colors"
            title="Clique para simular aproximação NFC"
          >
            <Smartphone className={`w-3.5 h-3.5 ${isNfcActive ? "text-[#F6C945] animate-bounce" : "text-[#FFF4ED]/70"}`} />
            <span className="text-[10px] font-mono tracking-wider text-[#F6C945]">NFC</span>
          </div>
        </div>

        {/* QR Code Centralizado em Placa Dourada */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto">
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-b from-[#F6C945] to-[#D97706] shadow-xl shadow-[#090B0C]/80 border-2 border-[#FFF4ED]/30 group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code de Onboarding Caraíva"
                className="w-44 h-44 rounded-xl object-contain shadow-inner"
              />
            ) : (
              <div className="w-44 h-44 rounded-xl bg-[#090B0C] flex items-center justify-center">
                <QrCode className="w-12 h-12 text-[#F6C945] animate-pulse" />
              </div>
            )}

            {/* Selo Central do QR Code */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-[#090B0C] border-2 border-[#F6C945] flex items-center justify-center shadow-lg">
                <Flame className="w-5 h-5 text-[#F6C945]" />
              </div>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className="text-xs font-semibold text-[#FFF4ED] tracking-wide flex items-center justify-center gap-1.5">
              <Zap className="w-3 h-3 text-[#F6C945]" />
              Aproxime ou Aponte a Câmera
            </span>
            <span className="text-[10px] text-[#FFF4ED]/50 block">
              Ativação instantânea em 3 toques
            </span>
          </div>
        </div>

        {/* Rodapé do Cartão */}
        <div className="relative z-20 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#FFF4ED]/70">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-[#F6C945] font-semibold">Credencial</div>
            <div className="font-mono text-xs text-[#FFF4ED] font-bold">{inviteCode}</div>
          </div>

          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-[#FFF4ED]/50">Autenticação</div>
            <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-medium">
              <ShieldCheck className="w-3 h-3" />
              Verificado
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas abaixo do cartão */}
      <div className="w-full max-w-sm mt-6 flex flex-col gap-3">
        {/* Botão Principal de Ativação / Teste Imediato */}
        <button
          onClick={onStartOnboarding}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#F6C945] to-[#D97706] text-[#090B0C] font-bold text-sm tracking-wide shadow-lg shadow-[#F6C945]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Iniciar Construção ao Vivo Agora</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Botão Copiar Link */}
          <button
            onClick={copyLink}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#141719] border border-white/10 hover:border-[#F6C945]/40 text-xs text-[#FFF4ED] font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">Link Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#F6C945]" />
                <span>Copiar Link</span>
              </>
            )}
          </button>

          {/* Botão Compartilhar WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Olá! Aqui está o convite VIP para cadastrar seu espaço no Caraíva Digital e ativar o sistema TapTable com criação 3D instantânea: ${onboardingUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 hover:bg-[#25D366]/25 text-xs text-[#25D366] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Nota do Consultor */}
        <div className="mt-2 text-center text-[11px] text-[#FFF4ED]/40 flex items-center justify-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#F6C945]" />
          Apresentado por: <span className="text-[#FFF4ED]/70 font-medium">{repName}</span>
        </div>
      </div>
    </div>
  );
};
