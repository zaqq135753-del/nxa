import { useEffect, useState } from 'react';
import { ecosystemCloud as db } from '../../../services/ecosystemCloud';
export function useJourneyAccount() {
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(!db);
  useEffect(() => {
    if (!db) return;
    let active = true;
    void db.auth.getUser().then(({ data }) => { if (active) { setUserId(data.user?.id ?? null); setReady(true); } });
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => { if (active) { setUserId(session?.user.id ?? null); setReady(true); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  return { userId, ready };
}
