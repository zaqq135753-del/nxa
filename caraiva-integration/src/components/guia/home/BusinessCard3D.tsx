import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Star, Navigation, Heart, Sparkles, UtensilsCrossed, SmartphoneNfc, Clock } from 'lucide-react';
import type { Business } from '../../../data/caraivaDigitalData';
import { SafeBusinessImage } from '../SafeBusinessImage';
import { TapTableSyncService } from '../../../services/taptableSyncService';

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

  // Sincronização em tempo real de status do TapTable
  const tableStatus = useMemo(() => {
    return TapTableSyncService.getLiveTableStatus(business.id);
  }, [business.id]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 12 graus de inclinação física 3D
    const rx = ((y - centerY) / centerY) * -12;
    const ry = ((x - centerX) / centerX) * 12;
    const gx = (x / rect.width) * 100;
    const gy = (y / rect.height) * 100;

    setTilt({ rx, ry, gx, gy, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: 0, ry: 0, active: false }));
  }, []);

  const handleTouchStart = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: -5, ry: 0, active: true }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTilt(prev => ({ ...prev, rx: 0, ry: 0, active: false }));
  }, []);

  const photo = business.cover_image || business.heroImage || '';

  // Efeito 3D com perspectiva real Dark Luxury
  const transformStyle = tilt.active
    ? `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)';

  const shadowStyle = tilt.active
    ? `${(-tilt.ry * 1.5).toFixed(1)}px ${(tilt.rx * 1.5 + 16).toFixed(1)}px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(246, 201, 69, 0.25)`
    : '0 8px 24px -4px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)';

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(business)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="cd-card-3d cd-business-card select-none group"
      style={{
        borderRadius: 22,
        background: '#141719',
        border: '1px solid rgba(255, 255, 255, 0.08)',
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
          : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, box-shadow',
      }}
    >
      {/* Specular Glare / Efeito de Reflexo Dourado da Areia */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20,
          borderRadius: 22,
          opacity: tilt.active ? 1 : 0,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(circle 260px at ${tilt.gx}% ${tilt.gy}%, rgba(246, 201, 69, 0.16), transparent 75%)`,
        }}
      />

      {/* Imagem do Local com Badges de Destaque 3D */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', background: '#090B0C' }}>
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
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(9,11,12,0.92) 0%, rgba(9,11,12,0.2) 50%, rgba(9,11,12,0.4) 100%)',
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
            transform: tilt.active ? 'translateZ(24px)' : 'translateZ(0px)',
            transition: 'transform 0.2s ease',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 9999,
                background: 'rgba(9, 11, 12, 0.85)',
                backdropFilter: 'blur(8px)',
                fontSize: 11,
                fontWeight: 700,
                color: '#FFF4ED',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {business.subcategory || business.category}
            </span>

            {/* TapTable Badge de Mesas */}
            {tableStatus && (
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 9999,
                  background: tableStatus.availableTables > 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3.5,
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
                title={tableStatus.availableTables > 0 ? `${tableStatus.availableTables} mesas livres agora` : 'Fila de espera'}
              >
                {tableStatus.availableTables > 0 ? <UtensilsCrossed size={10} /> : <Clock size={10} />}
                <span>
                  {tableStatus.availableTables > 0
                    ? `${tableStatus.availableTables} mesas`
                    : `Fila ~${tableStatus.currentWaitMinutes}m`}
                </span>
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* NFC Tap Indicator */}
            {tableStatus?.supportsNfcTap && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(9, 11, 12, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(246, 201, 69, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F6C945',
                }}
                title="TapTable NFC Ativo nesta mesa"
              >
                <SmartphoneNfc size={15} />
              </div>
            )}

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(business.id, business.name);
                }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isFavorite ? 'rgba(244,63,94,0.92)' : 'rgba(9, 11, 12, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: isFavorite ? '1px solid rgba(244,63,94,1)' : '1px solid rgba(255,255,255,0.15)',
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
                  color={isFavorite ? '#FFFFFF' : '#FFF4ED'}
                  fill={isFavorite ? '#FFFFFF' : 'none'}
                />
              </button>
            )}
          </div>
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
              background: 'rgba(246, 201, 69, 0.92)',
              color: '#090B0C',
              fontSize: 10,
              fontWeight: 800,
              backdropFilter: 'blur(6px)',
              transform: tilt.active ? 'translateZ(20px)' : 'translateZ(0px)',
              transition: 'transform 0.2s ease',
              zIndex: 10,
              boxShadow: '0 2px 10px rgba(246,201,69,0.3)',
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
          transform: tilt.active ? 'translateZ(16px)' : 'translateZ(0px)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: '#FFF4ED',
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {business.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3.5, flexShrink: 0 }}>
            <Star size={13} color="#F6C945" fill="#F6C945" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FFF4ED' }}>
              {business.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: 'rgba(255, 244, 237, 0.65)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {business.shortDescription || business.description}
        </p>

        {/* Informações de Distância, Maré e Horário */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
            paddingTop: 8,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: 11,
            color: 'rgba(255, 244, 237, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Navigation size={12} color="#F6C945" />
            <span>{business.distanceTime} a pé</span>
          </div>

          <span
            style={{
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 10,
              fontWeight: 700,
              background: business.isOpenNow ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: business.isOpenNow ? '#34D399' : '#F87171',
              border: business.isOpenNow ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            {business.isOpenNow ? 'Aberto' : 'Fechado'}
          </span>
        </div>
      </div>
    </div>
  );
};
