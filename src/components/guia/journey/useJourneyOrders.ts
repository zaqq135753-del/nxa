import { useCallback, useEffect, useRef, useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
export type JourneyOrder = { id: string; business_id: string; status: string; payment_status: string; total_cents: number; created_at: string; cd_order_lines: { name: string; quantity: number; unit_price_cents: number }[]; cd_bookings: { id: string; starts_at: string; ends_at: string; seats: number; checked_in_at: string | null }[] };
export function useJourneyOrders(userId: string | null) {
  const [orders, setOrders] = useState<JourneyOrder[]>([]), [error, setError] = useState(''), [loading, setLoading] = useState(false), [updatedAt, setUpdatedAt] = useState('');
  const activeUser = useRef(userId), owner = useRef<string | null>(null);
  activeUser.current = userId;
  const refresh = useCallback(async () => {
    if (!db || !userId || !navigator.onLine) return;
    setLoading(true);
    try {
      const { data, error: failure } = await db.from('cd_orders').select('id,business_id,status,payment_status,total_cents,created_at,cd_order_lines(name,quantity,unit_price_cents),cd_bookings(id,starts_at,ends_at,seats,checked_in_at)').eq('customer_id', userId).order('created_at', { ascending: false }).limit(100);
      if (activeUser.current !== userId) return;
      if (failure) throw failure;
      owner.current = userId;
      setOrders(data ?? []); setUpdatedAt(new Date().toISOString()); setError('');
    } catch { if (activeUser.current === userId) setError('Não foi possível atualizar seus pedidos. Tente novamente.'); }
    finally { if (activeUser.current === userId) setLoading(false); }
  }, [userId]);
  useEffect(() => {
    setOrders([]); setUpdatedAt(''); setError(''); setLoading(false);
    if (!userId || !db) return;
    void refresh();
    const timer = window.setInterval(() => void refresh(), 20000);
    window.addEventListener('online', refresh);
    return () => { clearInterval(timer); window.removeEventListener('online', refresh); };
  }, [userId, refresh]);
  return { orders: userId && owner.current === userId ? orders : [], error, loading, updatedAt, refresh };
}
