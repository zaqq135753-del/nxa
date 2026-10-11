import React, { useRef, useState, useCallback } from 'react';
import { Star, Navigation, Heart, Sparkles } from 'lucide-react';
import type { Business } from '../../../data/caraivaDigitalData';
import { SafeBusinessImage } from '../SafeBusinessImage';

interface BusinessCard3DProps {
  business: Business;
  onSelect: (b: Business) => void;
  onOpenMap?: (b: Business) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, name: string) => void;
  aiBadgeReason?: string;
}

export const BusinessCard3D: React.FC<BusinessCard3DProps> = ({
  business,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  aiBadgeReason,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 14 graus de inclinação física 3D
    const rx = ((y - centerY) / centerY) * -14;
    const ry = ((x - centerX) / centerX) * 14;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;

    setTilt({ rx, ry, gx, gy, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: 0, ry: 0, active: false }));
  }, []);

  const handleTouchStart = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: -6, ry: 0, active: true }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: 0, ry: 0, active: false }));
  }, []);

  const photo = business.cover_image || business.heroImage || '';

  // Efeito 3D com perspectiva real e sombra dinâmica deslocada no ângulo oposto
  const transformStyle = tilt.active
    ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateY(-6px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)';

  const shadowStyle = tilt.active
    ? `${(-tilt.ry * 1.5).toFixed(1)}px ${(tilt.rx * 1.5 + 18).toFixed(1)}px 36px rgba(13, 40, 52, 0.22), 0 0 0 1px var(--cv-line)`
    : '0 8px 24px -4px var(--cv-shadow), 0 0 0 1px var(--cv-line)';

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(business)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="cd-card-3d cd-business-card select-none"
      style={{
        borderRadius: 24,
        background: 'var(--cv-paper)',
        border: '1px solid var(--cv-line)',
        boxShadow: shadowStyle,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        transition: tilt.active
          ? 'transform 0.08s ease-out, box-shadow 0.08s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, box-shadow',
      }}
    >
      {/* Specular Glare / Efeito de Reflexo de Luz 3D */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20,
          borderRadius: 24,
          opacity: tilt.active ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle 280px at ${tilt.gx}% ${tilt.gy}%, rgba(255, 255, 255, 0.28), transparent 75%)`,
        }}
      />

      {/* Imagem do Local com Badges de Destaque 3D */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', background: '#0D2834' }}>
        <SafeBusinessImage
          src={photo}
          alt={business.name}
          category={business.category}
          fallbackSeed={business.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: tilt.active ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Badges Superiores com Profundidade 3D (Parallax Pop) */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            insetInline: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transform: tilt.active ? 'translateZ(26px)' : 'translateZ(0px)',
            transition: 'transform 0.2s ease',
            zIndex: 10,
          }}
        >
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 9999,
              background: 'var(--cv-glass)',
              backdropFilter: 'blur(8px)',
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--cv-ink)',
              border: '1px solid var(--cv-line)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {business.subcategory || business.category}
          </span>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(business.id, business.name);
              }}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: isFavorite ? 'rgba(244,63,94,0.92)' : 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(8px)',
                border: isFavorite ? '1px solid rgba(244,63,94,1)' : '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              className={`active:scale-90 hover:scale-110 ${isFavorite ? 'cd-heart-popped shadow-lg shadow-rose-500/40' : ''}`}
            >
              <Heart
                size={16}
                color={isFavorite ? '#FFFFFF' : '#FFFFFF'}
                fill={isFavorite ? '#FFFFFF' : 'none'}
                className={isFavorite ? 'cd-heart-popped' : ''}
              />
            </button>
          )}
        </div>

        {/* Badge da IA se houver (Parallax Pop) */}
        {aiBadgeReason && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 9px',
              borderRadius: 9999,
              background: 'rgba(15, 163, 165, 0.92)',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              backdropFilter: 'blur(6px)',
              transform: tilt.active ? 'translateZ(22px)' : 'translateZ(0px)',
              transition: 'transform 0.2s ease',
              zIndex: 10,
              boxShadow: '0 2px 10px rgba(15,163,165,0.4)',
            }}
          >
            <Sparkles size={11} />
            <span>{aiBadgeReason}</span>
          </div>
        )}
      </div>

      {/* Conteúdo do Card com Profundidade 3D */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          transform: tilt.active ? 'translateZ(18px)' : 'translateZ(0px)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: 'var(--cv-ink)',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {business.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--cv-ink)' }}>
              {business.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: 'var(--cv-muted)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {business.shortDescription || business.description}
        </p>

        {/* Informações de Localização e Horário */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
            paddingTop: 8,
            borderTop: '1px solid var(--cv-line)',
            fontSize: 11,
            color: 'var(--cv-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Navigation size={12} color="#0FA3A5" />
            <span>{business.distanceTime} a pé</span>
          </div>

          <span
            style={{
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              background: business.isOpenNow ? '#DCFCE7' : '#FEE2E2',
              color: business.isOpenNow ? '#15803D' : '#B91C1C',
            }}
          >
            {business.isOpenNow ? 'Aberto' : 'Fechado'}
          </span>
        </div>
      </div>
    </div>
  );
};
