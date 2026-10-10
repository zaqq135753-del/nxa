import React from 'react';
import { Star, Navigation, Heart, Sparkles } from 'lucide-react';
import type { Business } from '../../../data/caraivaDigitalData';

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
  const photo = business.cover_image || business.heroImage || '';

  return (
    <div
      onClick={() => onSelect(business)}
      className="cd-card-3d cd-btn-tactile"
      style={{
        borderRadius: 24,
        background: '#FFFFFF',
        border: '1px solid rgba(13, 40, 52, 0.08)',
        boxShadow: '0 6px 20px rgba(13, 40, 52, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Imagem do Local com Badges de Destaque */}
      <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', background: '#0D2834' }}>
        <img
          src={photo}
          alt={business.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,40,52,0.85) 0%, rgba(13,40,52,0.1) 60%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Badges Superiores */}
        <div style={{ position: 'absolute', top: 12, insetInline: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(8px)',
              fontSize: 11,
              fontWeight: 800,
              color: '#0D2834',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
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
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Heart size={16} color={isFavorite ? '#F43F5E' : '#FFFFFF'} fill={isFavorite ? '#F43F5E' : 'none'} />
            </button>
          )}
        </div>

        {/* Badge da IA se houver */}
        {aiBadgeReason && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 9999,
              background: 'rgba(15, 163, 165, 0.9)',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              backdropFilter: 'blur(6px)',
            }}
          >
            <Sparkles size={11} />
            <span>{aiBadgeReason}</span>
          </div>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0D2834', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {business.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0D2834' }}>
              {business.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 12, color: '#64748B', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {business.shortDescription || business.description}
        </p>

        {/* Informações de Localização e Horário */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingTop: 8, borderTop: '1px solid #F1F5F9', fontSize: 11, color: '#64748B' }}>
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
