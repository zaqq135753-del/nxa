"use client";
import { useState } from "react";
import { 
  ArrowUpRight, 
  Check, 
  Download, 
  Eye, 
  HelpCircle, 
  Nfc, 
  QrCode, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Users 
} from "lucide-react";
import { byId, establishments, nfcTags } from "@/lib/data";
import { Card3D } from "@/components/ui/Card3D";

export function PlaqueStrategyHub({ establishmentId }: { establishmentId: string }) {
  const est = byId(establishments, establishmentId);
  const tag = nfcTags.find((t) => t.establishmentId === establishmentId) || {
    id: `${establishmentId}-balcao`,
    label: "Placa Balcão Principal",
    deliveryAddress: est?.name || "Estabelecimento",
  };

  const [downloaded, setDownloaded] = useState(false);

  const simulateDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6 animate-rise">
      {/* Banner de contextualização da estratégia */}
      <div className="card p-6 bg-gradient-to-br from-mata-900/30 via-noite-800 to-noite-900 border-mata-400/30">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <span className="chip border-mata-400/40 text-mata-400 text-xs">
              <Nfc size={12} /> Canal de Atração Física Oficial
            </span>
            <h2 className="mt-3 font-display text-2xl text-areia-50">
              A Placa Caraíva.digital no seu Estabelecimento
            </h2>
            <p className="mt-2 text-sm text-areia-200/80 leading-relaxed">
              Esta plaquinha de acrílico com NFC e QR Code é fornecida e mantida pelo <strong>Caraíva.digital</strong>. 
              Ela conecta os turistas que entram no seu espaço diretamente ao ecossistema da vila, destacando seus produtos e integrando suas vendas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-2xl bg-white/[0.04] p-4 text-center border border-white/10 min-w-[130px]">
              <Eye size={18} className="mx-auto text-coral-400" />
              <p className="mt-1 text-2xl font-bold font-display text-areia-50">148</p>
              <p className="text-[11px] text-areia-300">Leituras neste mês</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-4 text-center border border-white/10 min-w-[130px]">
              <Users size={18} className="mx-auto text-rio-400" />
              <p className="mt-1 text-2xl font-bold font-display text-areia-50">92%</p>
              <p className="text-[11px] text-areia-300">Turistas novos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Como o Turista Vivencia a Placa */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-coral-400 font-bold font-display text-lg">
            1
          </div>
          <h4 className="mt-3 font-semibold text-areia-100 text-sm">Aproximação Sem Atrito</h4>
          <p className="mt-1 text-xs text-areia-300 leading-relaxed">
            O turista encosta o celular na placa ou lê o QR Code. O app <strong>Caraíva.digital</strong> abre instantaneamente no navegador, sem precisar baixar nada.
          </p>
        </div>

        <div className="card p-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-mata-400 font-bold font-display text-lg">
            2
          </div>
          <h4 className="mt-3 font-semibold text-areia-100 text-sm">Destaque do Seu Negócio</h4>
          <p className="mt-1 text-xs text-areia-300 leading-relaxed">
            O sistema reconhece que ele está no <strong>{est?.name}</strong>. Seus produtos, passeios ou diárias aparecem em primeiro lugar com opção de compra rápida.
          </p>
        </div>

        <div className="card p-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-rio-400 font-bold font-display text-lg">
            3
          </div>
          <h4 className="mt-3 font-semibold text-areia-100 text-sm">Hub da Vila para o Turista</h4>
          <p className="mt-1 text-xs text-areia-300 leading-relaxed">
            Se ele precisa de pousada, passeio ou farmácia enquanto está no seu balcão, o app resolve tudo na hora, valorizando o atendimento do seu comércio.
          </p>
        </div>
      </div>

      {/* Visual da Placa e Gestão do Ponto Físico */}
      <div className="card p-6 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <span className="label">Ponto de Acesso Cadastrado</span>
          <h3 className="mt-1 font-display text-2xl text-areia-50">{tag.label}</h3>
          <p className="mt-1 text-xs text-areia-300">Localização física: {tag.deliveryAddress}</p>

          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-areia-300">Código da Placa:</span>
              <span className="font-mono font-semibold text-areia-100">{tag.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-areia-300">Status no Balcão:</span>
              <span className="text-mata-400 font-medium flex items-center gap-1">
                <ShieldCheck size={12} /> Placa Física Ativa
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-areia-300">Link Direto:</span>
              <span className="font-mono text-coral-400">caraiva.digital/tag/{tag.id}</span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button 
              onClick={simulateDownload}
              className="btn-primary min-h-[44px] text-xs px-4"
            >
              <Download size={14} /> {downloaded ? "Baixando PDF..." : "Baixar Arte da Placa (PDF)"}
            </button>
            <a 
              href={`/tag/${tag.id}`} 
              target="_blank"
              rel="noreferrer"
              className="btn-ghost min-h-[44px] text-xs px-4"
            >
              <ArrowUpRight size={14} /> Testar Leitura
            </a>
          </div>
        </div>

        {/* Mock visual 3D interativo da placa física de acrílico (21st-dev Card3D) */}
        <div className="flex justify-center">
          <Card3D depth={18} glare={true} className="w-64 border-2 border-white/20 bg-gradient-to-b from-noite-800 to-noite-900 p-6 text-center shadow-2xl backdrop-blur-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest text-areia-200">
              <Nfc size={12} className="text-coral-400" /> Caraíva.digital
            </div>
            <div className="mt-4 mx-auto grid h-28 w-28 place-items-center rounded-xl bg-areia-50 text-noite-900 shadow-inner">
              <QrCode size={80} strokeWidth={1.4} />
            </div>
            <p className="mt-4 font-display text-sm font-semibold text-areia-50">
              Aproxime o celular ou leia o QR Code
            </p>
            <p className="mt-1 text-[10px] text-areia-300">
              Guia oficial, compras e reservas em Caraíva
            </p>
            <div className="mt-3 border-t border-white/10 pt-2 text-[9px] text-areia-300/70 font-mono">
              Ponto: {est?.name}
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
}
