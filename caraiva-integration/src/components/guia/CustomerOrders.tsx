import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './business-detail/cloud-checkout.css';

export function CustomerOrders(){
  const [localOrders,setLocalOrders]=useState<any[]>([]);
  const [localBookings,setLocalBookings]=useState<any[]>([]);
  
  // Carrega pedidos e reservas do dispositivo / BroadcastChannel
  useEffect(() => {
    const syncLocal = () => {
      try {
        const hist = JSON.parse(localStorage.getItem('caraiva_orders_history') || '[]');
        const eco = JSON.parse(localStorage.getItem('caraiva-demo-v2') || '{}');
        const reservs = JSON.parse(localStorage.getItem('caraiva-reservation-requests-v1') || '[]');
        setLocalOrders(hist.length ? hist : (eco.orders || []));
        setLocalBookings(reservs.length ? reservs : (eco.bookings || []));
      } catch {
        // fallback
      }
    };
    syncLocal();
    const bc = new BroadcastChannel('caraiva-demo-v2');
    bc.onmessage = syncLocal;
    window.addEventListener('caraiva-demo-v2', syncLocal);
    return () => {
      bc.close();
      window.removeEventListener('caraiva-demo-v2', syncLocal);
    };
  }, []);
  
  return <main style={{minHeight:'100dvh',background:'#07191e',color:'#edf4ef',padding:'max(20px, env(safe-area-inset-top)) 16px max(32px, env(safe-area-inset-bottom))'}}>
    <div style={{maxWidth:900,margin:'auto',display:'grid',gap:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link to="/guia" style={{color:'#65dfcb',fontWeight:700,textDecoration:'none'}}>← Voltar ao Guia</Link>
        <span style={{fontSize:12,padding:'4px 10px',borderRadius:20,background:'rgba(101,223,203,0.15)',color:'#65dfcb',fontWeight:700}}>Sincronizado ao Vivo</span>
      </div>
      <div>
        <h1 style={{fontSize:28,margin:0,fontWeight:800}}>Meus Pedidos & Reservas</h1>
        <p style={{fontSize:13,color:'#94a3b8',marginTop:4}}>Status em tempo real das suas solicitações na vila de Caraíva.</p>
      </div>

      {/* Pedidos Locais / Em Andamento */}
      {localOrders.length > 0 && (
        <section style={{display:'grid',gap:14}}>
          <h3 style={{fontSize:15,color:'#65dfcb',margin:0,textTransform:'uppercase',letterSpacing:1}}>🛵 Pedidos em Andamento</h3>
          {localOrders.map((ord: any, idx: number) => (
            <article className="cv-checkout" style={{maxHeight:'none',borderColor:'rgba(101,223,203,0.3)'}} key={idx}>
              <header style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <h2 style={{fontSize:18,margin:0}}>{ord.businessName || 'Estabelecimento Local'}</h2>
                  <small style={{color:'#94a3b8'}}>Pedido #{ord.orderId || ord.id}</small>
                </div>
                <span style={{padding:'4px 10px',borderRadius:12,background:'#10b981',color:'#022c22',fontSize:12,fontWeight:800}}>
                  {ord.status === 'entregue' ? 'Entregue' : ord.status === 'em_rota' ? 'Em Rota de Entrega' : 'Recebido na Cozinha ⏱️'}
                </span>
              </header>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:8,display:'grid',gap:4}}>
                {(ord.items || []).map((it: any, iIdx: number) => (
                  <p key={iIdx} style={{margin:0,fontSize:13,display:'flex',justifyContent:'space-between'}}>
                    <span>{it.quantity || it.qty}x {it.name}</span>
                    <strong style={{color:'#fbbf24'}}>R$ {((it.unitPrice || it.price || 0) * (it.quantity || it.qty || 1)).toFixed(2)}</strong>
                  </p>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:8}}>
                <span style={{fontSize:12,color:'#94a3b8'}}>📍 {ord.destinationDetail || ord.address || 'Entrega na vila'}</span>
                <strong style={{fontSize:16,color:'#65dfcb'}}>R$ {(ord.totalAmount || (ord.split?.gross) || 0).toFixed(2)}</strong>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Reservas em Andamento */}
      {localBookings.length > 0 && (
        <section style={{display:'grid',gap:14}}>
          <h3 style={{fontSize:15,color:'#38bdf8',margin:0,textTransform:'uppercase',letterSpacing:1}}>📅 Reservas & Agendamentos</h3>
          {localBookings.map((bk: any, idx: number) => (
            <article className="cv-checkout" style={{maxHeight:'none',borderColor:'rgba(56,189,248,0.3)'}} key={idx}>
              <header style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <h2 style={{fontSize:18,margin:0}}>{bk.businessName || bk.title}</h2>
                  <small style={{color:'#94a3b8'}}>Reserva #{bk.id}</small>
                </div>
                <span style={{padding:'4px 10px',borderRadius:12,background:'#38bdf8',color:'#082f49',fontSize:12,fontWeight:800}}>
                  Confirmada
                </span>
              </header>
              <p style={{margin:0,fontSize:13}}>
                🗓️ <strong>Data/Horário:</strong> {bk.date || bk.start} {bk.time ? `às ${bk.time}` : ''}
              </p>
              {bk.checkoutDate && <p style={{margin:0,fontSize:13}}>🏨 <strong>Check-out:</strong> {bk.checkoutDate}</p>}
              <p style={{margin:0,fontSize:13,color:'#94a3b8'}}>
                👥 {bk.people || bk.seats} pessoa(s) {bk.notes ? `· Obs: ${bk.notes}` : ''}
              </p>
            </article>
          ))}
        </section>
      )}

      {/* Se não houver pedidos locais */}
      {!localOrders.length && !localBookings.length && (
        <div style={{textAlign:'center',padding:'60px 20px',borderRadius:24,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)'}}>
          <p style={{fontSize:18,fontWeight:700,margin:0}}>Nenhum pedido ou reserva em andamento</p>
          <p style={{fontSize:13,color:'#94a3b8',marginTop:8}}>Explore os restaurantes, pousadas e passeios pelo Guia para fazer sua primeira solicitação.</p>
          <Link to="/guia" style={{display:'inline-block',marginTop:16,padding:'12px 24px',borderRadius:14,background:'#65dfcb',color:'#07191e',fontWeight:800,textDecoration:'none'}}>
            Explorar Caraíva
          </Link>
        </div>
      )}
    </div>
  </main>;
}
