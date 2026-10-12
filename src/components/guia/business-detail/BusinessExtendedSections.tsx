import React, { useState } from 'react';
import { Clock, Calendar, Check, Plus, ShoppingBag, LayoutGrid, List } from 'lucide-react';
import type { MenuItemDetail, BusinessScheduleInfo } from '../../../data/caraivaExtendedProfiles';
import { addToCart, type CatalogProduct } from '../../../services/catalogCartService';
import { SafeBusinessImage } from '../SafeBusinessImage';

interface BusinessMenuTabProps {
  businessId?: string;
  businessName: string;
  menuItems: MenuItemDetail[];
  whatsappNumber?: string;
  onOpenCartModal?: () => void;
}

export const BusinessMenuTab: React.FC<BusinessMenuTabProps> = ({
  businessId = 'restaurante-local',
  businessName,
  menuItems,
  onOpenCartModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'grid'>('compact');

  const categories = [
    { id: 'todos', label: 'Tudo' },
    { id: 'principais', label: 'Pratos' },
    { id: 'entradas', label: 'Petiscos' },
    { id: 'bebidas', label: 'Drinks & Sucos' },
    { id: 'sobremesas', label: 'Sobremesas' },
  ];

  const filteredItems = selectedCategory === 'todos'
    ? menuItems
    : menuItems.filter((i) => i.category === selectedCategory);

  const handleAddToCart = (item: MenuItemDetail) => {
    const numericPrice = parseFloat(
      item.price.replace('R$', '').replace('.', '').replace(',', '.').trim()
    ) || 50;

    const catalogProd: CatalogProduct = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: numericPrice,
      formattedPrice: item.price,
      description: item.description,
      image: item.image,
      stockStatus: 'em_estoque',
      badge: item.badge as any,
    };

    addToCart(catalogProd, businessId, businessName, 'gastronomia');
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1800);
  };

  return (
    <div className="space-y-3">
      {/* Barra de Filtros e Alternância de Visualização */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none text-[12px] font-semibold flex-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Toggle Compact vs Grid */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'compact' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Lista Compacta (Ver Mais)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid Visual com Fotos"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contador de itens */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Mostrando {filteredItems.length} opções do cardápio</span>
        <span className="text-amber-400/90 font-medium">Toque para adicionar à sacola</span>
      </div>

      {/* Renderização: Lista Compacta (Padrão Otimizado para Ver Mais Itens) */}
      {viewMode === 'compact' ? (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
              >
                {/* Miniatura Foto do Prato */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/10">
                  <SafeBusinessImage
                    src={item.image}
                    alt={item.name}
                    category="gastronomia"
                    fallbackSeed={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.badge && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-xs text-[8px] text-center font-bold text-amber-300 py-0.5 truncate px-1">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Dados Compactos do Prato */}
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm font-extrabold text-amber-400">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Botão Compacto Adicionar à Sacola */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1 shrink-0 transition-all active:scale-95 cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
                  }`}
                  title="Adicionar à sacola"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Adicionado</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Sacola</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Renderização: Grid Visual com Fotos (2 Colunas em Desktop / Mobile) */
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {filteredItems.map((item) => {
            const isAdded = addedItemId === item.id;
            return (
              <div
                key={item.id}
                className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-2">
                    <SafeBusinessImage
                      src={item.image}
                      alt={item.name}
                      category="gastronomia"
                      fallbackSeed={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {item.badge && (
                      <span className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-[9px] font-bold text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-white/5">
                  <span className="text-xs sm:text-sm font-extrabold text-amber-400">
                    {item.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg font-black text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950'
                    }`}
                  >
                    {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isAdded ? 'Salvo' : '+'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {onOpenCartModal && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onOpenCartModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ver Sacola & Finalizar Pedido</span>
          </button>
        </div>
      )}
    </div>
  );
};

interface BusinessBookingTabProps {
  businessName: string;
  schedule: BusinessScheduleInfo;
  whatsappNumber?: string;
}

export const BusinessBookingTab: React.FC<BusinessBookingTabProps> = ({
  businessName,
  schedule,
  whatsappNumber = '5573999990000',
}) => {
  const [peopleCount, setPeopleCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [notes, setNotes] = useState('');

  const timeSlots = ['12:30', '13:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const handleConfirmBooking = () => {
    const formattedDate = selectedDate.split('-').reverse().join('/');
    const message = `Olá! Gostaria de solicitar uma reserva em *${businessName}* via *Caraíva Digital* 🌴:\n\n📅 Data: *${formattedDate}*\n⏰ Horário: *${selectedTime}*\n👥 Pessoas: *${peopleCount}*\n${notes ? `📝 Obs: ${notes}\n` : ''}\nPoderiam confirmar a disponibilidade?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Status de Horário & Dias da Semana */}
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: 20,
          padding: 16,
          border: '1px solid rgba(13,40,52,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={16} color="#0D2834" />
            <strong style={{ fontSize: 14, color: '#0D2834' }}>Horário Hoje</strong>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 700,
              background: schedule.isOpenNow ? '#DCFCE7' : '#FEE2E2',
              color: schedule.isOpenNow ? '#15803D' : '#B91C1C',
            }}
          >
            {schedule.isOpenNow ? 'Aberto Agora' : 'Fechado no momento'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
          {schedule.todayHours}
        </p>

        {/* Tabela semanal compacta */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {schedule.weekSchedule.map((ws: { day: string; hours: string; isOpen: boolean }, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B' }}>
              <span>{ws.day}</span>
              <span style={{ fontWeight: 600, color: ws.isOpen ? '#0D2834' : '#94A3B8' }}>{ws.hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário de Reserva Direta via WhatsApp */}
      <div
        className="cd-glass-card"
        style={{
          padding: 18,
          borderRadius: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="#0FA3A5" />
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0D2834' }}>
            Agendar / Reservar Mesa
          </h4>
        </div>

        {/* Quantidade de Pessoas */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Número de Pessoas
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 4, 6, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPeopleCount(num)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 12,
                  border: peopleCount === num ? '2px solid #0FA3A5' : '1px solid #CBD5E1',
                  background: peopleCount === num ? '#CCFBF1' : '#FFFFFF',
                  color: peopleCount === num ? '#0F766E' : '#334155',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                {num} pes.
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Data Desejada
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid #CBD5E1',
              fontSize: 14,
              color: '#0D2834',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Horários */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Horário Preferido
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 12,
                  border: selectedTime === slot ? '2px solid #0FA3A5' : '1px solid #E2E8F0',
                  background: selectedTime === slot ? '#0FA3A5' : '#FFFFFF',
                  color: selectedTime === slot ? '#FFFFFF' : '#334155',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Observações Opcionais */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
            Observação (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Mesa externa perto do rio, aniversário..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 14,
              border: '1px solid #CBD5E1',
              fontSize: 13,
              color: '#0D2834',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Botão de Envio de Reserva */}
        <button
          onClick={handleConfirmBooking}
          className="cd-btn-tactile"
          style={{
            marginTop: 6,
            width: '100%',
            padding: '14px',
            borderRadius: 18,
            border: 'none',
            background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 8px 20px rgba(20, 184, 166, 0.35)',
            cursor: 'pointer',
          }}
        >
          <Check size={18} />
          Solicitar Reserva via WhatsApp
        </button>
      </div>
    </div>
  );
};
