import React, { useState } from 'react';
import {
  Sparkles,
  CalendarPlus,
  CheckCircle2,
  Send,
  Lightbulb,
} from 'lucide-react';
import { activeConcierge, type ConciergePlan } from '../../../services/conciergeProvider';
import { addToItinerary } from '../../../services/favoritesService';
import type { Business } from '../../../data/caraivaDigitalData';

interface CaraivaConciergeAgentProps {
  initialRequest?: string;
  onSelectBusiness?: (business: Business) => void;
  onNavigateToSaved?: () => void;
}

export const CaraivaConciergeAgent: React.FC<CaraivaConciergeAgentProps> = ({
  initialRequest = '',
  onSelectBusiness,
  onNavigateToSaved,
}) => {
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      role: 'user' | 'assistant';
      text: string;
      plan?: ConciergePlan;
      isStreaming?: boolean;
    }>
  >([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Olá! Sou o seu Guia de IA de Caraíva. 🌴 Posso te sugerir onde comer com os pés na areia, a tábua de maré ideal para travessia, passeios de barco e organizar o seu dia perfeito na vila.',
    },
  ]);

  const [inputDraft, setInputDraft] = useState(initialRequest);
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedItineraryIds, setAddedItineraryIds] = useState<string[]>([]);

  // Sugestões flutuantes inspiradas no 21st-agent-elements (Suggestions Component)
  const quickSuggestions = [
    'O que fazer hoje à tarde com pôr do sol?',
    'Melhores opções para jantar romântico',
    'Roteiro econômico de 1 dia na vila',
    'Onde tem forró pé de serra hoje à noite?',
    'Passeio para Corumbau: melhor horário e maré',
  ];

  const handleSendPrompt = async (promptText: string) => {
    const text = promptText.trim();
    if (!text || isGenerating) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `ai-${Date.now()}`;

    // Adiciona pergunta do usuário
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: 'user', text },
      {
        id: assistantMessageId,
        role: 'assistant',
        text: 'Consultando as marés, horários dos pescadores e lugares abertos em Caraíva...',
        isStreaming: true,
      },
    ]);

    setInputDraft('');
    setIsGenerating(true);

    try {
      // Gera roteiro estruturado com IA
      const mood = text.toLowerCase().includes('romant')
        ? 'romantico'
        : text.toLowerCase().includes('forro') || text.toLowerCase().includes('noite')
        ? 'festa_forro'
        : text.toLowerCase().includes('econom')
        ? 'economico'
        : 'natureza_relax';

      const planResult = await activeConcierge.createItinerary({
        mood,
        timeOfDay: text.toLowerCase().includes('tarde') ? 'tarde' : text.toLowerCase().includes('noite') ? 'noite' : 'dia_completo',
        companions: text.toLowerCase().includes('casal') ? 'casal' : text.toLowerCase().includes('amigo') ? 'amigos' : 'solo',
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                text: planResult.headline,
                plan: planResult,
                isStreaming: false,
              }
            : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                text: 'Aqui está uma sugestão especial: passe a tarde no Boteco do Pará para o pastel de arraia no pôr do sol e depois siga para o Forró do Ouriço! 🎶',
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveItinerary = (plan: ConciergePlan, messageId: string) => {
    plan.steps.forEach((step: { time: string; business?: Business | null; title: string; description: string }) => {
      addToItinerary({
        time: step.time,
        spotId: step.business?.id || 'custom-spot',
        spotName: step.business?.name || step.title,
        activityTitle: step.title,
        category: 'Concierge',
        tip: step.description,
      });
    });

    setAddedItineraryIds((prev) => [...prev, messageId]);
    if (onNavigateToSaved) onNavigateToSaved();
  };

  return (
    <div style={{ maxWidth: 768, margin: '0 auto', padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Cabeçalho do Agente */}
      <div
        className="cd-glass-card"
        style={{
          padding: '16px 20px',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0FA3A5, #38BDF8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(20, 194, 197, 0.4)',
            }}
          >
            <Sparkles size={22} color="#FFFFFF" className="cd-ai-glow" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0D2834' }}>
              Concierge Caraíva IA
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>
              Planejamento interativo & itinerários com base na maré e vila
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 9999,
            background: '#DCFCE7',
            color: '#15803D',
          }}
        >
          ● Online
        </span>
      </div>

      {/* Histórico de Mensagens / Diálogo com a IA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isApproved = addedItineraryIds.includes(msg.id);

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '85%' : '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: isUser ? 'linear-gradient(135deg, #0FA3A5, #0D8284)' : '#FFFFFF',
                  color: isUser ? '#FFFFFF' : '#0D2834',
                  boxShadow: '0 4px 14px rgba(13, 40, 52, 0.06)',
                  border: isUser ? 'none' : '1px solid rgba(13, 40, 52, 0.08)',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {msg.isStreaming ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0FA3A5', fontWeight: 600 }}>
                    <Sparkles size={16} className="animate-spin" />
                    {msg.text}
                  </span>
                ) : (
                  msg.text
                )}
              </div>

              {/* Roteiro e Card Interativo (PlanTool 21st.dev) */}
              {msg.plan && (
                <div
                  className="cd-card-3d"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 24,
                    padding: 18,
                    border: '1.5px solid rgba(20, 194, 197, 0.3)',
                    boxShadow: '0 8px 24px rgba(13, 40, 52, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0FA3A5', textTransform: 'uppercase' }}>
                      Roteiro Aprovado pela IA
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 9999, background: '#FEF3C7', color: '#B45309' }}>
                      Estimativa: {msg.plan.budgetTotal}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontStyle: 'italic' }}>
                    "{msg.plan.vibe}"
                  </p>

                  {/* Dica nativa de morador */}
                  {msg.plan.localTip && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 14,
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: 12,
                        color: '#92400E',
                      }}
                    >
                      <Lightbulb size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{msg.plan.localTip}</span>
                    </div>
                  )}

                  {/* Linha do Tempo de Etapas */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {msg.plan.steps.map((step: { time: string; business?: Business | null; title: string; description: string }, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: 10,
                          borderRadius: 16,
                          background: '#F8FAFC',
                        }}
                      >
                        <div
                          style={{
                            padding: '4px 8px',
                            borderRadius: 10,
                            background: '#0D2834',
                            color: '#FFFFFF',
                            fontSize: 11,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {step.time}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#0D2834' }}>
                            {step.title}
                          </h4>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>
                            {step.description}
                          </p>

                          {step.business && (
                            <button
                              onClick={() => onSelectBusiness && onSelectBusiness(step.business!)}
                              style={{
                                marginTop: 6,
                                padding: '4px 10px',
                                borderRadius: 8,
                                border: '1px solid rgba(13,40,52,0.1)',
                                background: '#FFFFFF',
                                color: '#0FA3A5',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Ver detalhes do local ↗
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botão de Aprovação e Salvamento do Roteiro */}
                  <button
                    onClick={() => handleApproveItinerary(msg.plan!, msg.id)}
                    disabled={isApproved}
                    className="cd-btn-tactile"
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      border: 'none',
                      background: isApproved ? '#DCFCE7' : 'linear-gradient(135deg, #0FA3A5, #14C2C5)',
                      color: isApproved ? '#15803D' : '#FFFFFF',
                      fontSize: 14,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      cursor: isApproved ? 'default' : 'pointer',
                      boxShadow: isApproved ? 'none' : '0 6px 18px rgba(15, 163, 165, 0.3)',
                    }}
                  >
                    {isApproved ? (
                      <>
                        <CheckCircle2 size={16} />
                        Roteiro Salvo no Seu Guia!
                      </>
                    ) : (
                      <>
                        <CalendarPlus size={16} />
                        Aprovar e Salvar Roteiro no Guia
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sugestões de Perguntas Rápidas (Pílulas do 21st.dev) */}
      <div style={{ marginTop: 8 }}>
        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
          Perguntas Frequentes na Vila:
        </p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
          {quickSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendPrompt(sug)}
              className="cd-btn-tactile"
              style={{
                padding: '8px 14px',
                borderRadius: 9999,
                border: '1px solid rgba(13,40,52,0.1)',
                background: '#FFFFFF',
                color: '#0D2834',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(13,40,52,0.04)',
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Digitação Fixa (InputBar) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt(inputDraft);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '6px 8px 6px 16px',
          border: '1.5px solid rgba(13,40,52,0.12)',
          boxShadow: '0 8px 24px rgba(13,40,52,0.08)',
        }}
      >
        <input
          type="text"
          placeholder="Pergunte sobre lugares, passeios, maré..."
          value={inputDraft}
          onChange={(e) => setInputDraft(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 14,
            color: '#0D2834',
          }}
        />
        <button
          type="submit"
          disabled={!inputDraft.trim() || isGenerating}
          className="cd-btn-tactile"
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            border: 'none',
            background: inputDraft.trim() ? '#0FA3A5' : '#E2E8F0',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputDraft.trim() ? 'pointer' : 'default',
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
