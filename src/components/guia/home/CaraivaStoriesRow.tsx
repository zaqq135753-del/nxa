import React from 'react';
import { Plus } from 'lucide-react';
import type { GuiaStory } from '../StoriesEngine';

interface CaraivaStoriesRowProps {
  stories: GuiaStory[];
  onSelectStory: (story: GuiaStory) => void;
  onOpenCreateStory?: () => void;
}

export const CaraivaStoriesRow: React.FC<CaraivaStoriesRowProps> = ({
  stories,
  onSelectStory,
  onOpenCreateStory,
}) => {
  const storyCategories = [
    { label: 'Agora', color: '#14C2C5' },
    { label: 'Praia', color: '#38BDF8' },
    { label: 'Comer', color: '#F76B52' },
    { label: 'Pousadas', color: '#F59E0B' },
    { label: 'Passeios', color: '#15803D' },
    { label: 'Noite', color: '#8B5CF6' },
  ];

  return (
    <div style={{ margin: '14px 0', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--cv-ink)', letterSpacing: '-0.01em' }}>
            Stories da Vila
          </h3>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--cv-muted)' }}>
            Momentos ao vivo postados por moradores e viajantes
          </p>
        </div>
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            color: '#0FA3A5',
            background: 'rgba(15,163,165,0.12)',
            padding: '3px 10px',
            borderRadius: 9999,
            border: '1px solid rgba(15,163,165,0.25)',
          }}
        >
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span
              className="cd-sonar-ring"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: '#0FA3A5',
                opacity: 0.75,
              }}
            />
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#0FA3A5',
              }}
            />
          </span>
          <span>Ao Vivo</span>
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 6,
          paddingTop: 4,
        }}
      >
        {/* Bolha para Postar Story */}
        {onOpenCreateStory && (
          <div
            onClick={onOpenCreateStory}
            className="cd-btn-tactile"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--cv-soft)',
                border: '2px dashed #0FA3A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0FA3A5',
                boxShadow: '0 2px 10px rgba(15,163,165,0.15)',
              }}
            >
              <Plus size={24} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cv-ink)', maxWidth: 66, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Seu Story
            </span>
          </div>
        )}

        {/* Lista de Stories */}
        {stories.map((story, i) => {
          const cat = storyCategories[i % storyCategories.length];
          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="cd-btn-tactile"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div
                className="cd-story-live-ring"
                style={{
                  position: 'relative',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  padding: 2.5,
                  background: `linear-gradient(135deg, ${cat.color}, #0FA3A5, #F76B52)`,
                  boxShadow: '0 4px 14px rgba(13,40,52,0.12)',
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '2px solid var(--cv-paper)',
                    overflow: 'hidden',
                    background: 'var(--cv-soft)',
                  }}
                >
                  <img
                    src={story.image}
                    alt={story.author}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--cv-ink)',
                  maxWidth: 68,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {story.author.replace('@', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
