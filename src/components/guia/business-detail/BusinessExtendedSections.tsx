import React, { useState } from 'react';
import { Clock, Calendar, Check, Plus, ShoppingBag } from 'lucide-react';
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
    // Converte preço formatado "R$ 68,00" para número float
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filtros em Pílula */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                border: active ? '1px solid #14B8A6' : '1px solid rgba(13,40,52,0.1)',
                background: active ? '#14B8A6' : 'white',
                color: active ? '#FFFFFF' : '#0D2834',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Pratos com visual 3D e detalhes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="cd-card-3d"
            style={{
              display: 'flex',
              gap: 14,
              padding: 14,
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid rgba(13,40,52,0.06)',
              boxShadow: '0 4px 16px rgba(13,40,52,0.05)',
              alignItems: 'center',
            }}
          >
            {item.image && (
              <div style={{ position: 'relative', width: 92, height: 92, flexShrink: 0, borderRadius: 16, overflow: 'hidden' }}>
                <SafeBusinessImage
                  src={item.image}
                  alt={item.name}
                  category="gastronomia"
                  fallbackSeed={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
            )}
            
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0D2834' }}>
                  {item.name}
                </h4>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      background: item.badge === 'Mais Pedido' ? '#FEF3C7' : '#E0F2FE',
                      color: item.badge === 'Mais Pedido' ? '#B45309' : '#0369A1',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#64748B', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0D2834' }}>
                  {item.price}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 14,
                    border: 'none',
                    background: addedItemId === item.id ? '#14B8A6' : '#F59E0B',
                    color: addedItemId === item.id ? '#FFFFFF' : '#0B131E',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {addedItemId === item.id ? (
                    <>
                      <Check size={14} />
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      + Sacola
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {onOpenCartModal && (
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onOpenCartModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 14,
              border: '1px solid rgba(20, 184, 166, 0.3)',
              background: 'rgba(20, 184, 166, 0.1)',
              color: '#0D9488',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ShoppingBag size={16} />
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
