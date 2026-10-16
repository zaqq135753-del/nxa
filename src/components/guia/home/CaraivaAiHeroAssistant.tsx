import React from 'react';
import { Sparkles, Utensils, Compass, Sun, ArrowRight } from 'lucide-react';

interface CaraivaAiHeroAssistantProps {
  onAskConcierge: (prompt: string) => void;
  onExploreCategory: (category: string) => void;
}

export const CaraivaAiHeroAssistant: React.FC<CaraivaAiHeroAssistantProps> = ({
  onAskConcierge,
}) => {
  const aiPrompts = [
    { label: 'O que fazer agora?', icon: <Compass size={14} color="#0FA3A5" />, prompt: 'O que está acontecendo agora em Caraíva e o que você me recomenda fazer neste horário?' },
    { label: 'Melhor lugar para comer', icon: <Utensils size={14} color="#F76B52" />, prompt: 'Quais são os melhores restaurantes pé na areia e com peixe fresco recomendados hoje?' },
    { label: 'Maré e travessia hoje', icon: <Sun size={14} color="#F59E0B" />, prompt: 'Como está a tábua de marés hoje e qual o melhor horário para atravessar para a praia ou fazer o passeio de barco?' },
    { label: 'Lugares românticos', icon: <Sparkles size={14} color="#38BDF8" />, prompt: 'Quais os locais mais charmosos e tranquilos para curtir a dois ao pôr do sol em Caraíva?' },
  ];

  return (
    <div
      className="cd-glass-card cd-card-3d"
      style={{
        margin: '12px 16px',
        padding: '16px 18px',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1.5px solid rgba(20, 194, 197, 0.35)',
        boxShadow: '0 8px 24px -4px rgba(13, 40, 52, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Luz guia suave no fundo */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 194, 197, 0.25) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            className="cd-ai-glow"
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0FA3A5, #38BDF8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#FFFFFF" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0D2834', letterSpacing: '-0.01em' }}>
              Guia Caraíva IA
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
              Dicas locais em tempo real para o seu dia na vila
            </p>
          </div>
        </div>

        <button
          onClick={() => onAskConcierge('Olá! Gostaria de uma sugestão personalizada de roteiro para o meu momento agora em Caraíva!')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            borderRadius: 12,
            border: 'none',
            background: 'rgba(15, 163, 165, 0.1)',
            color: '#0D8284',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Conversar
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Pílulas de Intenção Rápida com Feedback Tátil */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
        {aiPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onAskConcierge(item.prompt)}
            className="cd-btn-tactile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 13px',
              borderRadius: 14,
              border: '1px solid rgba(13, 40, 52, 0.08)',
              background: '#FFFFFF',
              color: '#0D2834',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(13, 40, 52, 0.04)',
              cursor: 'pointer',
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
