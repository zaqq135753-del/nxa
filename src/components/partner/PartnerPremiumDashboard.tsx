import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  MessageCircle,
  Eye,
  Bookmark,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { CARAIVA_BUSINESSES } from '../../data/caraivaDigitalData';
import { SyncEngine, type PartnerPost } from '../../services/sync/SyncEngine';

interface PartnerPremiumDashboardProps {
  businessId?: string;
  onBackToGuide?: () => void;
}

export const PartnerPremiumDashboard: React.FC<PartnerPremiumDashboardProps> = ({
  businessId = 'boteco-do-para',
  onBackToGuide,
}) => {
  const currentBusiness =
    CARAIVA_BUSINESSES.find((b) => b.id === businessId) || CARAIVA_BUSINESSES[0];

  const [activeTab, setActiveTab] = useState<'visao-geral' | 'stories' | 'cardapio' | 'ia-assistente'>('visao-geral');
  const [posts, setPosts] = useState<PartnerPost[]>(() => SyncEngine.getAllPosts());
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const aiSuggestions = SyncEngine.generateAiContentSuggestion(
    currentBusiness.name,
    currentBusiness.category,
    currentBusiness.vibe?.[0] || 'praia'
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    SyncEngine.publishContent({
      businessId: currentBusiness.id,
      title: newTitle,
      content: newContent,
      mediaUrl: currentBusiness.cover_image || '',
      type: 'story',
      status: 'published',
    });

    setPosts(SyncEngine.getAllPosts());
    setNewTitle('');
    setNewContent('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3500);
  };

  const handleApplyAiSuggestion = (suggestion: typeof aiSuggestions[0]) => {
    setNewTitle(suggestion.title);
    setNewContent(suggestion.copy);
    setActiveTab('stories');
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 16px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header do Estabelecimento */}
      <div
        className="cd-glass-card"
        style={{
          padding: 20,
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={currentBusiness.cover_image}
            alt={currentBusiness.name}
            style={{ width: 56, height: 56, borderRadius: 18, objectFit: 'cover', border: '2px solid #0FA3A5' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0D2834' }}>
                {currentBusiness.name}
              </h2>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: '#DCFCE7', color: '#15803D' }}>
                ● Online no Guia
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Painel de Gestão & Sincronização em Tempo Real
            </p>
          </div>
        </div>

        {onBackToGuide && (
          <button
            onClick={onBackToGuide}
            className="cd-btn-tactile"
            style={{
              padding: '8px 16px',
              borderRadius: 14,
              border: '1px solid rgba(13,40,52,0.1)',
              background: '#FFFFFF',
              color: '#0D2834',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Voltar ao Guia Público
          </button>
        )}
      </div>

      {/* Métricas Principais de Conversão */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Visualizações', value: '12,4 mil', icon: <Eye size={18} color="#0FA3A5" />, change: '+28%' },
          { label: 'Interações', value: '2,1 mil', icon: <TrendingUp size={18} color="#38BDF8" />, change: '+34%' },
          { label: 'Cliques WhatsApp', value: '320', icon: <MessageCircle size={18} color="#15803D" />, change: '+18%' },
          { label: 'Salvos na Vila', value: '48', icon: <Bookmark size={18} color="#F76B52" />, change: '+22%' },
        ].map((m, i) => (
          <div
            key={i}
            className="cd-card-3d"
            style={{
              padding: 16,
              borderRadius: 20,
              background: '#FFFFFF',
              border: '1px solid rgba(13,40,52,0.06)',
              boxShadow: '0 4px 14px rgba(13,40,52,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {m.icon}
              <span style={{ fontSize: 11, fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '2px 6px', borderRadius: 8 }}>
                {m.change}
              </span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#0D2834' }}>{m.value}</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Abas de Gestão */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(13,40,52,0.08)', paddingBottom: 8, overflowX: 'auto' }}>
        {[
          { id: 'visao-geral', label: 'Visão Geral' },
          { id: 'stories', label: '📸 Postar Stories & Avisos' },
          { id: 'ia-assistente', label: '✨ IA Criador de Conteúdo' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="cd-btn-tactile"
            style={{
              padding: '8px 16px',
              borderRadius: 14,
              border: activeTab === tab.id ? '1.5px solid #0FA3A5' : '1px solid transparent',
              background: activeTab === tab.id ? '#CCFBF1' : 'transparent',
              color: activeTab === tab.id ? '#0F766E' : '#475569',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Aba: Criador de Stories & Posts com sincronização instantânea */}
      {activeTab === 'stories' && (
        <form
          onSubmit={handleCreatePost}
          className="cd-glass-card"
          style={{ padding: 20, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0D2834' }}>
              Publicar Story / Momento no Guia Público
            </h3>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0FA3A5', background: 'rgba(15,163,165,0.1)', padding: '4px 10px', borderRadius: 9999 }}>
              Sincronização Imediata
            </span>
          </div>

          <input
            type="text"
            placeholder="Título do Story (ex: Peixe fresquinho chegando agora!)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #CBD5E1',
              fontSize: 14,
              color: '#0D2834',
              outline: 'none',
            }}
            required
          />

          <textarea
            placeholder="Legenda ou detalhe do momento para os turistas..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            style={{
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid #CBD5E1',
              fontSize: 14,
              color: '#0D2834',
              outline: 'none',
              resize: 'none',
            }}
          />

          <button
            type="submit"
            className="cd-btn-tactile"
            style={{
              padding: '14px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, #0FA3A5, #14C2C5)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(15,163,165,0.3)',
            }}
          >
            <Send size={16} />
            Publicar no Caraíva Digital
          </button>

          {publishSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontSize: 13, fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              Story publicado com sucesso! Já está visível para os visitantes.
            </div>
          )}
        </form>
      )}

      {/* Aba: IA Assistente do Parceiro */}
      {activeTab === 'ia-assistente' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#0FA3A5" className="cd-ai-glow" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0D2834' }}>
              Sugestões da IA Baseadas no Clima & Horário de Caraíva
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {aiSuggestions.map((s, idx) => (
              <div
                key={idx}
                className="cd-card-3d"
                style={{
                  padding: 16,
                  borderRadius: 20,
                  background: '#FFFFFF',
                  border: '1px solid rgba(13,40,52,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0D2834' }}>{s.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {s.suggestedHour}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.4 }}>
                  "{s.copy}"
                </p>
                <button
                  type="button"
                  onClick={() => handleApplyAiSuggestion(s)}
                  className="cd-btn-tactile"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '6px 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: '#F0FDF4',
                    color: '#15803D',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Usar Este Texto no Story <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Stories Já Publicados */}
      {activeTab === 'visao-geral' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0D2834' }}>
            Conteúdos Ativos no Guia
          </h4>
          {posts.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', background: '#F8FAFC', borderRadius: 20, color: '#64748B', fontSize: 13 }}>
              Nenhum story publicado hoje. Crie um novo acima para atrair visitantes!
            </div>
          ) : (
            posts.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0D2834' }}>{p.title}</h5>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{p.content}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 9999, background: '#DCFCE7', color: '#15803D', flexShrink: 0 }}>
                  Publicado
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
