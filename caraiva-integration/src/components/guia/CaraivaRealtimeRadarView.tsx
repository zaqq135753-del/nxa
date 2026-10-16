import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Navigation, 
  ShoppingBag, 
  Eye, 
  Compass, 
  Radio,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TelemetryEvent } from '../../services/pixelTelemetry';

export const CaraivaRealtimeRadarView: React.FC = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(3); // Simulado com base no pulso

  useEffect(() => {
    const loadEvents = () => {
      try {
        const raw = localStorage.getItem('cd_pixel_events_buffer');
        if (raw) {
          const parsed: TelemetryEvent[] = JSON.parse(raw);
          setEvents(parsed);
          // Calcula usuários ativos nos últimos 60 segundos
          const now = Date.now();
          const uniqueRecentVisitors = new Set(
            parsed.filter(e => now - e.timestamp < 60000).map(e => e.visitorId)
          );
          setOnlineCount(Math.max(1, uniqueRecentVisitors.size));
        }
      } catch {
        // fallback
      }
    };

    loadEvents();
    const interval = setInterval(loadEvents, 3000);

    const bc = new BroadcastChannel('cd_telemetry_radar');
    bc.onmessage = () => loadEvents();

    return () => {
      clearInterval(interval);
      bc.close();
    };
  }, []);

  const totalPageViews = events.filter(e => e.eventType === 'page_view').length;
  const totalBusinessViews = events.filter(e => e.eventType === 'business_view').length;
  const totalRoutes = events.filter(e => e.eventType === 'route_started').length;
  const totalOrders = events.filter(e => e.eventType === 'order_completed').length;

  return (
    <main className="min-h-screen bg-[#071318] text-[#edf4ef] p-4 sm:p-6 selection:bg-teal-500/30">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Link 
              to="/guia"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  Radar em Tempo Real
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Comportamento & Tráfego de Caraíva
              </h1>
            </div>
          </div>

          {/* Contador de Visitantes Ativos Agora */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-lg">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                Ao Vivo Agora
              </span>
              <strong className="text-lg font-black text-white">
                {onlineCount} {onlineCount === 1 ? 'turista navegando' : 'turistas navegando'}
              </strong>
            </div>
          </div>
        </div>

        {/* Métricas Principais / Funil de Conversão */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Telas Acessadas</span>
              <Eye className="w-4 h-4 text-sky-400" />
            </div>
            <strong className="text-2xl font-black text-white block">{totalPageViews}</strong>
            <p className="text-[11px] text-sky-400">Pixel ativo nas páginas</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Perfis de Lojas</span>
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <strong className="text-2xl font-black text-white block">{totalBusinessViews}</strong>
            <p className="text-[11px] text-amber-400">Cardápios e vitrines vistas</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Rotas a Pé</span>
              <Navigation className="w-4 h-4 text-teal-400" />
            </div>
            <strong className="text-2xl font-black text-white block">{totalRoutes}</strong>
            <p className="text-[11px] text-teal-400">Deslocamento nas ruas</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Pedidos & Reservas</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <strong className="text-2xl font-black text-white block">{totalOrders}</strong>
            <p className="text-[11px] text-emerald-400">Conversão direta na vila</p>
          </div>
        </div>

        {/* Feed de Eventos Instantâneos */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Feed de Eventos do Lead (Live Stream)
              </h2>
            </div>
            <span className="text-xs text-slate-400">Atualização em milissegundos</span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Activity className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
              <p className="text-xs text-slate-400">
                Aguardando primeiros eventos de navegação...
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {events.map((ev) => (
                <div 
                  key={ev.id}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between gap-3 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {ev.eventType === 'page_view' && `Visitante visualizou a tela "${ev.screen}"`}
                        {ev.eventType === 'business_view' && `Visitante abriu o perfil de "${ev.businessName || ev.businessId}"`}
                        {ev.eventType === 'route_started' && `Turista traçou rota a pé para "${ev.businessName || ev.businessId}"`}
                        {ev.eventType === 'cart_action' && `Item adicionado à sacola de "${ev.businessName}"`}
                        {ev.eventType === 'order_completed' && `🎉 Pedido/Reserva concluído em "${ev.businessName}"`}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        ID: {ev.visitorId} · Sessão: {ev.sessionId}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
