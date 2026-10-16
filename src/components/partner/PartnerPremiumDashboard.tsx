import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  MessageCircle,
  Eye,
  Bookmark,
  Send,
  Clock,
  ChevronRight,
  Wifi,
  DollarSign,
  Plus,
  Save,
  Sun,
  Moon,
} from 'lucide-react';
import { CARAIVA_BUSINESSES } from '../../data/caraivaDigitalData';
import { SyncEngine, type PartnerPost } from '../../services/sync/SyncEngine';
import { useGuideTheme } from '../guia/useGuideTheme';

interface PartnerPremiumDashboardProps {
  businessId?: string;
  onBackToGuide?: () => void;
  onSwitchToSpatial?: () => void;
}

export type BusinessTab =
  | 'visao-geral'
  | 'perfil'
  | 'cardapio'
  | 'pedidos'
  | 'stories'
  | 'hardware-nfc'
  | 'ia-assistente';

interface MenuItemEditable {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  salesToday: number;
}

interface OrderLive {
  id: string;
  customerName: string;
  items: string[];
  total: number;
  location: string;
  paymentStatus: 'Pix Pago' | 'Pendente';
  status: 'novo' | 'cozinha' | 'pronto' | 'entregue';
  timeAgo: string;
}

interface TableReservation {
  id: string;
  customerName: string;
  peopleCount: number;
  timeSlot: string;
  table: string;
  status: 'confirmada' | 'pendente';
  note?: string;
}

export const PartnerPremiumDashboard: React.FC<PartnerPremiumDashboardProps> = ({
  businessId = 'boteco-do-para',
  onBackToGuide,
  onSwitchToSpatial,
}) => {
  const { theme, toggleTheme } = useGuideTheme();
  const isLight = theme === 'light';

  const defaultBusiness =
    CARAIVA_BUSINESSES.find((b) => b.id === businessId) || CARAIVA_BUSINESSES[0];

  const [activeTab, setActiveTab] = useState<BusinessTab>('visao-geral');

  // Business Profile Form State
  const [profile, setProfile] = useState({
    name: defaultBusiness.name,
    shortDescription: defaultBusiness.shortDescription || '',
    category: defaultBusiness.category,
    whatsapp: defaultBusiness.whatsapp || '5573999991001',
    instagram: defaultBusiness.instagram || '@boteco.dopara',
    address: defaultBusiness.address || 'Beira-Rio, Caraíva - BA',
    openingHours: typeof defaultBusiness.opening_hours === 'string' ? defaultBusiness.opening_hours : '11:30 - 23:00',
    pixKey: 'botecodopara.pix@caraiva.digital',
    wifiSsid: 'BotecoDoPara_Fibra',
    wifiPassword: 'peixefresco2026',
    priceLevel: defaultBusiness.priceLevel || '$$',
  });

  // Cardápio / Itens State
  const [menuItems, setMenuItems] = useState<MenuItemEditable[]>([
    { id: 'm-1', name: 'Pastel de Arraia do Pará (Genuíno)', price: 28.0, category: 'Petiscos', inStock: true, salesToday: 42 },
    { id: 'm-2', name: 'Peixe Vermelho Grelhado na Brasa', price: 135.0, category: 'Pratos Principais', inStock: true, salesToday: 18 },
    { id: 'm-3', name: 'Moqueca de Robalo na Telha (2 pessoas)', price: 165.0, category: 'Pratos Principais', inStock: true, salesToday: 24 },
    { id: 'm-4', name: 'Camarão VG Empanado na Panko', price: 94.0, category: 'Petiscos', inStock: false, salesToday: 9 },
    { id: 'm-5', name: 'Caipirinha de Umbu-Cajá Artesanal', price: 34.0, category: 'Bebidas', inStock: true, salesToday: 55 },
    { id: 'm-6', name: 'Água de Coco Gelada da Roça', price: 12.0, category: 'Bebidas', inStock: true, salesToday: 38 },
  ]);

  // Orders / KDS State
  const [orders, setOrders] = useState<OrderLive[]>([
    {
      id: 'PED-402',
      customerName: 'Lucas & Beatriz',
      items: ['1x Moqueca de Robalo', '2x Caipirinha de Caju'],
      total: 199.0,
      location: 'Suíte 04 (Pousada da Barra) • NFC',
      paymentStatus: 'Pix Pago',
      status: 'novo',
      timeAgo: 'há 4 min',
    },
    {
      id: 'PED-401',
      customerName: 'Rodrigo Mello',
      items: ['2x Pastel de Arraia', '2x Cerveja Artesanal'],
      total: 88.0,
      location: 'Mesa 08 • Beira-Rio',
      paymentStatus: 'Pix Pago',
      status: 'cozinha',
      timeAgo: 'há 12 min',
    },
    {
      id: 'PED-398',
      customerName: 'Juliana Paes',
      items: ['1x Peixe Grelhado', '1x Água de Coco'],
      total: 147.0,
      location: 'Guarda-Sol 14 • Areia da Praia',
      paymentStatus: 'Pix Pago',
      status: 'pronto',
      timeAgo: 'há 22 min',
    },
  ]);

  // Reservations State
  const [reservations] = useState<TableReservation[]>([
    { id: 'RES-101', customerName: 'Camila Silveira', peopleCount: 4, timeSlot: 'Hoje às 20:30', table: 'Mesa Beira-Rio Deck 02', status: 'confirmada', note: 'Aniversário' },
    { id: 'RES-102', customerName: 'Dr. Fernando Dias', peopleCount: 2, timeSlot: 'Hoje às 21:00', table: 'Mesa Sunset Romântica', status: 'confirmada' },
    { id: 'RES-103', customerName: 'Grupo Amigos SP', peopleCount: 6, timeSlot: 'Amanhã às 13:00', table: 'Lounge Sombra de Amendoeira', status: 'pendente' },
  ]);

  // Stories & Sync State
  const [posts, setPosts] = useState<PartnerPost[]>(() => SyncEngine.getAllPosts());
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const aiSuggestions = SyncEngine.generateAiContentSuggestion(
    profile.name,
    profile.category,
    defaultBusiness.vibe?.[0] || 'praia'
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    SyncEngine.publishContent({
      businessId: defaultBusiness.id,
      title: newTitle,
      content: newContent,
      mediaUrl: defaultBusiness.cover_image || '',
      type: 'story',
      status: 'published',
    });

    setPosts(SyncEngine.getAllPosts());
    setNewTitle('');
    setNewContent('');
    showToast('✦ Story publicado no topo de Caraíva em tempo real!');
  };

  const handleApplyAiSuggestion = (suggestion: typeof aiSuggestions[0]) => {
    setNewTitle(suggestion.title);
    setNewContent(suggestion.copy);
    setActiveTab('stories');
    showToast('Sugestão da IA carregada no formulário de story!');
  };

  const toggleStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = !item.inStock;
        showToast(next ? `✓ ${item.name} agora está DISPONÍVEL` : `✕ ${item.name} PAUSADO (esgotado)`);
        return { ...item, inStock: next };
      })
    );
  };

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        if (ord.status === 'novo') return { ...ord, status: 'cozinha' };
        if (ord.status === 'cozinha') return { ...ord, status: 'pronto' };
        if (ord.status === 'pronto') return { ...ord, status: 'entregue' };
        return ord;
      })
    );
    showToast('Status do pedido atualizado no KDS e para o cliente!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('✦ Configurações do perfil salvas com sucesso!');
  };

  // Dynamic Theme Colors
  const themeStyles = {
    bg: isLight ? '#f7f3e9' : '#090B0C',
    cardBg: isLight ? '#fffdf7' : '#141719',
    cardBorder: isLight ? '1px solid #dce3d5' : '1px solid rgba(255,255,255,0.08)',
    textPrimary: isLight ? '#1e4339' : '#FFF4ED',
    textMuted: isLight ? '#697c6d' : '#8A949E',
    inputBg: isLight ? '#edf1e8' : '#1D2124',
    inputBorder: isLight ? '#c8d4c2' : 'rgba(255,255,255,0.12)',
    accent: isLight ? '#367f89' : '#4EEDB2',
    accentGold: isLight ? '#aa8941' : '#F6C945',
    activeTabBg: isLight ? '#e6eddf' : 'rgba(246,201,69,0.15)',
    activeTabColor: isLight ? '#1e4339' : '#F6C945',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: themeStyles.bg,
        color: themeStyles.textPrimary,
        padding: '24px 16px 120px',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: isLight ? '#1e4339' : '#141E26',
            color: '#FFFFFF',
            border: `1px solid ${themeStyles.accent}`,
            padding: '12px 24px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sparkles size={16} color={themeStyles.accent} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Top Header do Estabelecimento */}
        <div
          style={{
            padding: 22,
            borderRadius: 24,
            background: themeStyles.cardBg,
            border: themeStyles.cardBorder,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxShadow: isLight ? '0 8px 24px rgba(32,67,56,0.06)' : '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={defaultBusiness.cover_image || defaultBusiness.heroImage}
              alt={profile.name}
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                objectFit: 'cover',
                border: `2px solid ${themeStyles.accent}`,
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: themeStyles.textPrimary }}>
                  {profile.name}
                </h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 9999,
                    background: isLight ? '#e6f4ea' : 'rgba(78,237,178,0.15)',
                    color: isLight ? '#137333' : '#4EEDB2',
                    border: `1px solid ${isLight ? '#ceead6' : 'rgba(78,237,178,0.3)'}`,
                  }}
                >
                  ● Online no Guia & TapTable
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: themeStyles.textMuted }}>
                Painel Oficial de Gestão, Configurações e Pedidos em Tempo Real
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 14px',
                borderRadius: 14,
                border: themeStyles.cardBorder,
                background: themeStyles.inputBg,
                color: themeStyles.textPrimary,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              title="Alternar Tema Claro / Escuro"
            >
              {isLight ? <Moon size={14} /> : <Sun size={14} />}
              <span>{isLight ? 'Modo Escuro' : 'Modo Claro'}</span>
            </button>

            {onSwitchToSpatial && (
              <button
                onClick={onSwitchToSpatial}
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  border: `1px solid ${themeStyles.accent}`,
                  background: isLight ? 'rgba(54,127,137,0.1)' : 'rgba(78,237,178,0.15)',
                  color: themeStyles.accent,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkles size={14} />
                <span>Cockpit 3D Espacial</span>
              </button>
            )}

            {onBackToGuide && (
              <button
                onClick={onBackToGuide}
                style={{
                  padding: '8px 16px',
                  borderRadius: 14,
                  border: themeStyles.cardBorder,
                  background: isLight ? '#ffffff' : '#1D2124',
                  color: themeStyles.textPrimary,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ← Guia Público
              </button>
            )}
          </div>
        </div>

        {/* Onboarding Checklist Card */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 20,
            background: isLight ? 'linear-gradient(115deg, #eef5e9, #f9f6ed)' : 'linear-gradient(115deg, #121c21, #17140f)',
            border: `1px solid ${isLight ? '#c8d8c2' : 'rgba(246,201,69,0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isLight ? '#367f89' : '#F6C945',
                color: isLight ? '#ffffff' : '#090B0C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              ✓
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: themeStyles.textPrimary }}>
                Perfil 100% Homologado & Ativo em Caraíva
              </span>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: themeStyles.textMuted }}>
                Sua vitrine pública, Pix D+0, cardápio inteligente e placas NFC estão em sincronia.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700 }}>
            <span style={{ padding: '4px 10px', borderRadius: 10, background: themeStyles.cardBg, border: themeStyles.cardBorder, color: themeStyles.textPrimary }}>
              ✓ Pix Ativo
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 10, background: themeStyles.cardBg, border: themeStyles.cardBorder, color: themeStyles.textPrimary }}>
              ✓ NFC Vinculado
            </span>
            <span style={{ padding: '4px 10px', borderRadius: 10, background: themeStyles.cardBg, border: themeStyles.cardBorder, color: themeStyles.textPrimary }}>
              ✓ Cardápio Online
            </span>
          </div>
        </div>

        {/* Barra de Navegação Entre Módulos de Gestão */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
            borderBottom: `1px solid ${isLight ? '#dce3d5' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {[
            { id: 'visao-geral', label: '📊 Visão Geral & Métricas' },
            { id: 'perfil', label: '⚙️ Perfil & Configurações' },
            { id: 'cardapio', label: '🍽️ Cardápio & Estoque' },
            { id: 'pedidos', label: '🔔 Pedidos & Reservas (KDS)' },
            { id: 'stories', label: '📸 Stories & Avisos' },
            { id: 'hardware-nfc', label: '🏷️ Placa NFC & Wi-Fi' },
            { id: 'ia-assistente', label: '✨ IA Assistente' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as BusinessTab)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 14,
                  border: isActive ? `1.5px solid ${themeStyles.accent}` : '1px solid transparent',
                  background: isActive ? themeStyles.activeTabBg : 'transparent',
                  color: isActive ? themeStyles.activeTabColor : themeStyles.textMuted,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 1. ABA: VISÃO GERAL & MÉTRICAS */}
        {activeTab === 'visao-geral' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Grid de Métricas Principais */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { label: 'Faturamento Pix Hoje', value: 'R$ 1.840,00', icon: <DollarSign size={20} color={isLight ? '#1e4339' : '#4EEDB2'} />, change: 'D+0 Direto', highlight: true },
                { label: 'Visualizações no Guia', value: '12,4 mil', icon: <Eye size={18} color="#0FA3A5" />, change: '+28%' },
                { label: 'Interações no Cardápio', value: '2,1 mil', icon: <TrendingUp size={18} color="#38BDF8" />, change: '+34%' },
                { label: 'Cliques no WhatsApp', value: '320', icon: <MessageCircle size={18} color="#15803D" />, change: '+18%' },
                { label: 'Salvos por Turistas', value: '48', icon: <Bookmark size={18} color="#F76B52" />, change: '+22%' },
              ].map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: 18,
                    borderRadius: 20,
                    background: themeStyles.cardBg,
                    border: themeStyles.cardBorder,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    boxShadow: isLight ? '0 4px 14px rgba(32,67,56,0.04)' : '0 6px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {m.icon}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isLight ? '#137333' : '#4EEDB2',
                        background: isLight ? '#e6f4ea' : 'rgba(78,237,178,0.15)',
                        padding: '2px 8px',
                        borderRadius: 8,
                      }}
                    >
                      {m.change}
                    </span>
                  </div>
                  <span style={{ fontSize: m.highlight ? 22 : 20, fontWeight: 800, color: themeStyles.textPrimary }}>
                    {m.value}
                  </span>
                  <span style={{ fontSize: 12, color: themeStyles.textMuted, fontWeight: 600 }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Atividades Recentes e Pedidos Rápidos */}
            <div
              style={{
                padding: 20,
                borderRadius: 24,
                background: themeStyles.cardBg,
                border: themeStyles.cardBorder,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: themeStyles.textPrimary }}>
                  Últimos Pedidos Recebidos na Mesa / Areia
                </h3>
                <button
                  onClick={() => setActiveTab('pedidos')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: themeStyles.accent,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Ver todos no KDS →
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {orders.slice(0, 2).map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: themeStyles.inputBg,
                      border: themeStyles.cardBorder,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: themeStyles.accentGold }}>{ord.id}</span>
                        <strong style={{ fontSize: 14, color: themeStyles.textPrimary }}>{ord.customerName}</strong>
                        <span style={{ fontSize: 11, color: themeStyles.textMuted }}>• {ord.timeAgo}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                        {ord.items.join(' + ')} • <span style={{ color: themeStyles.accent }}>{ord.location}</span>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: themeStyles.textPrimary }}>
                        R$ {ord.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => advanceOrderStatus(ord.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 12,
                          border: 'none',
                          background: themeStyles.accent,
                          color: isLight ? '#FFFFFF' : '#060B0E',
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        {ord.status === 'novo' ? 'Enviar Cozinha' : ord.status === 'cozinha' ? 'Pronto' : 'Entregue'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ABA: PERFIL & CONFIGURAÇÕES DO NEGÓCIO */}
        {activeTab === 'perfil' && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              padding: 24,
              borderRadius: 24,
              background: themeStyles.cardBg,
              border: themeStyles.cardBorder,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12, borderBottom: themeStyles.cardBorder }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                  Dados & Configurações do Estabelecimento
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                  Estas informações alimentam a busca por inteligência artificial, o guia público e os cartões NFC.
                </p>
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: 14,
                  border: 'none',
                  background: themeStyles.accent,
                  color: isLight ? '#FFFFFF' : '#060B0E',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Save size={16} />
                <span>Salvar Alterações</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {/* Nome */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Nome Comercial
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              {/* Slogan */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Slogan / Descrição Curta
                </label>
                <input
                  type="text"
                  value={profile.shortDescription}
                  onChange={(e) => setProfile({ ...profile, shortDescription: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* WhatsApp de Pedidos */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  WhatsApp para Pedidos & Reservas
                </label>
                <input
                  type="text"
                  value={profile.whatsapp}
                  onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Instagram */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Instagram Oficial
                </label>
                <input
                  type="text"
                  value={profile.instagram}
                  onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Chave Pix */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Chave Pix (Split Direto D+0 na sua conta)
                </label>
                <input
                  type="text"
                  value={profile.pixKey}
                  onChange={(e) => setProfile({ ...profile, pixKey: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Horário de Funcionamento */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={profile.openingHours}
                  onChange={(e) => setProfile({ ...profile, openingHours: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Wi-Fi SSID */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Rede Wi-Fi das Mesas (SSID)
                </label>
                <input
                  type="text"
                  value={profile.wifiSsid}
                  onChange={(e) => setProfile({ ...profile, wifiSsid: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Senha do Wi-Fi */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                  Senha do Wi-Fi (Embutida na Placa NFC 1-Clique)
                </label>
                <input
                  type="text"
                  value={profile.wifiPassword}
                  onChange={(e) => setProfile({ ...profile, wifiPassword: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 12,
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    color: themeStyles.textPrimary,
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Endereço / Ponto de Referência */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: themeStyles.textPrimary, marginBottom: 6 }}>
                Endereço e Ponto de Referência na Vila (para rotas a pé)
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.inputBorder}`,
                  color: themeStyles.textPrimary,
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </form>
        )}

        {/* 3. ABA: CARDÁPIO & PAUSA DE ESTOQUE */}
        {activeTab === 'cardapio' && (
          <div
            style={{
              padding: 24,
              borderRadius: 24,
              background: themeStyles.cardBg,
              border: themeStyles.cardBorder,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 12, borderBottom: themeStyles.cardBorder }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                  Cardápio Digital & Pausa Rápida de Estoque
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                  Acabou o ingrediente? Pause o prato em 1 clique e ele desaparecerá imediatamente do cardápio dos clientes.
                </p>
              </div>
              <button
                onClick={() => showToast('✦ Novo prato adicionado ao rascunho!')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: themeStyles.accent,
                  color: isLight ? '#FFFFFF' : '#060B0E',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Plus size={16} />
                <span>Adicionar Prato</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    background: item.inStock ? themeStyles.inputBg : isLight ? '#fee2e2' : 'rgba(239,68,68,0.1)',
                    border: item.inStock ? themeStyles.cardBorder : '1px solid rgba(239,68,68,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    opacity: item.inStock ? 1 : 0.75,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: themeStyles.textPrimary }}>{item.name}</span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: themeStyles.cardBg,
                          color: themeStyles.textMuted,
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: themeStyles.textMuted, marginTop: 4, display: 'flex', gap: 12 }}>
                      <strong style={{ color: themeStyles.accentGold }}>R$ {item.price.toFixed(2)}</strong>
                      <span>• {item.salesToday} pedidos registrados hoje</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: item.inStock ? (isLight ? '#137333' : '#4EEDB2') : '#EF4444',
                      }}
                    >
                      {item.inStock ? 'Disponível' : 'Esgotado'}
                    </span>
                    <button
                      onClick={() => toggleStock(item.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        border: 'none',
                        background: item.inStock ? (isLight ? '#fee2e2' : 'rgba(239,68,68,0.2)') : isLight ? '#e6f4ea' : 'rgba(78,237,178,0.2)',
                        color: item.inStock ? '#EF4444' : isLight ? '#137333' : '#4EEDB2',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {item.inStock ? 'Pausar Item' : 'Ativar Item'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ABA: PEDIDOS & RESERVAS (KDS) */}
        {activeTab === 'pedidos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Seção 1: Fila do KDS */}
            <div
              style={{
                padding: 24,
                borderRadius: 24,
                background: themeStyles.cardBg,
                border: themeStyles.cardBorder,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                    Fila de Preparo & Entregas na Areia (KDS)
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                    Pedidos recebidos via comanda NFC ou delivery automático no quarto.
                  </p>
                </div>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 10,
                    background: isLight ? '#e6f4ea' : 'rgba(78,237,178,0.15)',
                    color: isLight ? '#137333' : '#4EEDB2',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {orders.filter((o) => o.status !== 'entregue').length} Ativos
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      background: themeStyles.inputBg,
                      border: themeStyles.cardBorder,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: themeStyles.accentGold }}>{ord.id}</span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background:
                              ord.status === 'novo'
                                ? '#EF4444'
                                : ord.status === 'cozinha'
                                ? '#F59E0B'
                                : ord.status === 'pronto'
                                ? '#38BDF8'
                                : '#10B981',
                            color: '#FFFFFF',
                            textTransform: 'uppercase',
                          }}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <h4 style={{ margin: '6px 0 0', fontSize: 15, fontWeight: 800, color: themeStyles.textPrimary }}>
                        {ord.customerName}
                      </h4>
                      <div style={{ fontSize: 11, color: themeStyles.accent, fontWeight: 700, marginTop: 2 }}>
                        {ord.location}
                      </div>
                      <div style={{ margin: '8px 0', fontSize: 12, color: themeStyles.textMuted }}>
                        {ord.items.map((it, idx) => (
                          <div key={idx}>• {it}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: themeStyles.cardBorder }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: themeStyles.textPrimary }}>
                        R$ {ord.total.toFixed(2)}
                      </span>
                      {ord.status !== 'entregue' ? (
                        <button
                          onClick={() => advanceOrderStatus(ord.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 10,
                            border: 'none',
                            background: themeStyles.accent,
                            color: isLight ? '#FFFFFF' : '#060B0E',
                            fontWeight: 800,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {ord.status === 'novo' ? 'Iniciar Cozinha' : ord.status === 'cozinha' ? 'Pronto p/ Entrega' : 'Despachar'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: isLight ? '#137333' : '#4EEDB2', fontWeight: 700 }}>
                          ✓ Concluído
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção 2: Reservas de Mesas */}
            <div
              style={{
                padding: 24,
                borderRadius: 24,
                background: themeStyles.cardBg,
                border: themeStyles.cardBorder,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                Reservas de Mesas & Experiências Sunset
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: themeStyles.inputBg,
                      border: themeStyles.cardBorder,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong style={{ fontSize: 14, color: themeStyles.textPrimary }}>{res.customerName}</strong>
                        <span style={{ fontSize: 11, color: themeStyles.accentGold, fontWeight: 700 }}>
                          • {res.peopleCount} Pessoas
                        </span>
                        <span style={{ fontSize: 11, color: themeStyles.textMuted }}>• {res.timeSlot}</span>
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                        {res.table} {res.note ? `("${res.note}")` : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 8,
                          background: isLight ? '#e6f4ea' : 'rgba(78,237,178,0.15)',
                          color: isLight ? '#137333' : '#4EEDB2',
                        }}
                      >
                        Confirmada
                      </span>
                      <button
                        onClick={() => showToast(`✦ Alerta enviado para ${res.customerName}!`)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 10,
                          border: themeStyles.cardBorder,
                          background: themeStyles.cardBg,
                          color: themeStyles.textPrimary,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Buzzer Web 🔔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. ABA: STORIES & AVISOS */}
        {activeTab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <form
              onSubmit={handleCreatePost}
              style={{
                padding: 24,
                borderRadius: 24,
                background: themeStyles.cardBg,
                border: themeStyles.cardBorder,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                  Publicar Story no Topo do Guia de Caraíva
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: themeStyles.accent,
                    background: isLight ? 'rgba(54,127,137,0.1)' : 'rgba(78,237,178,0.1)',
                    padding: '4px 10px',
                    borderRadius: 9999,
                  }}
                >
                  Sincronização Imediata
                </span>
              </div>

              <input
                type="text"
                placeholder="Título do Story (ex: Peixe fresquinho acabou de sair do mar!)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.inputBorder}`,
                  fontSize: 14,
                  color: themeStyles.textPrimary,
                  outline: 'none',
                }}
                required
              />

              <textarea
                placeholder="Texto explicativo para os turistas na areia..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.inputBorder}`,
                  fontSize: 14,
                  color: themeStyles.textPrimary,
                  outline: 'none',
                  resize: 'none',
                }}
              />

              <button
                type="submit"
                style={{
                  padding: '14px',
                  borderRadius: 16,
                  border: 'none',
                  background: themeStyles.accent,
                  color: isLight ? '#FFFFFF' : '#060B0E',
                  fontWeight: 800,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                }}
              >
                <Send size={16} />
                Publicar no Guia Agora
              </button>
            </form>

            <div
              style={{
                padding: 24,
                borderRadius: 24,
                background: themeStyles.cardBg,
                border: themeStyles.cardBorder,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: themeStyles.textPrimary }}>
                Stories Ativos na Vila
              </h4>
              {posts.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: themeStyles.textMuted, fontSize: 13 }}>
                  Nenhum story ativo hoje. Crie um novo acima para atrair visitantes!
                </div>
              ) : (
                posts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: themeStyles.inputBg,
                      border: themeStyles.cardBorder,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: themeStyles.textPrimary }}>{p.title}</h5>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: themeStyles.textMuted }}>{p.content}</p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 8,
                        background: isLight ? '#e6f4ea' : 'rgba(78,237,178,0.15)',
                        color: isLight ? '#137333' : '#4EEDB2',
                        flexShrink: 0,
                      }}
                    >
                      Ao Vivo
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 6. ABA: HARDWARE & PLACA NFC */}
        {activeTab === 'hardware-nfc' && (
          <div
            style={{
              padding: 24,
              borderRadius: 24,
              background: themeStyles.cardBg,
              border: themeStyles.cardBorder,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                Placa Acrílica NFC Black Piano & Wi-Fi das Mesas
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: themeStyles.textMuted }}>
                Hardware físico entregue e calibrado para mesas, balcões e suítes de Caraíva.
              </p>
            </div>

            <div
              style={{
                maxWidth: 440,
                margin: '0 auto',
                width: '100%',
                padding: 24,
                borderRadius: 20,
                background: '#090B0C',
                border: '2px solid rgba(246,201,69,0.4)',
                textAlign: 'center',
                boxShadow: '0 16px 36px rgba(0,0,0,0.5), 0 0 24px rgba(246,201,69,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(246,201,69,0.15)',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                🏷️
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 2, color: '#F6C945', textTransform: 'uppercase' }}>
                  CARAÍVA DIGITAL • SMART NFC
                </span>
                <h4 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#FFF4ED' }}>
                  {profile.name.toUpperCase()}
                </h4>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#8A949E' }}>
                  Aproxime o celular ou aponte a câmera para abrir comanda e Wi-Fi
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)',
                  color: '#38BDF8',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <Wifi size={16} />
                <span>Wi-Fi 1-Click: {profile.wifiSsid}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: themeStyles.textMuted }}>
              <span>ID do Chip: NFC-CARAIVA-M08-883F</span>
              <button
                onClick={() => showToast('✦ Link NFC copiado para a área de transferência!')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: themeStyles.accentGold,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Copiar Link da Mesa ↗
              </button>
            </div>
          </div>
        )}

        {/* 7. ABA: IA ASSISTENTE DO PARCEIRO */}
        {activeTab === 'ia-assistente' && (
          <div
            style={{
              padding: 24,
              borderRadius: 24,
              background: themeStyles.cardBg,
              border: themeStyles.cardBorder,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color={themeStyles.accent} />
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: themeStyles.textPrimary }}>
                Sugestões da IA Baseadas no Clima & Horário de Caraíva
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {aiSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: themeStyles.inputBg,
                    border: themeStyles.cardBorder,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: themeStyles.textPrimary }}>{s.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: themeStyles.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {s.suggestedHour}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: themeStyles.textMuted, lineHeight: 1.5 }}>
                    "{s.copy}"
                  </p>
                  <button
                    type="button"
                    onClick={() => handleApplyAiSuggestion(s)}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '6px 14px',
                      borderRadius: 10,
                      border: 'none',
                      background: themeStyles.accent,
                      color: isLight ? '#FFFFFF' : '#060B0E',
                      fontSize: 12,
                      fontWeight: 800,
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
      </div>
    </div>
  );
};
