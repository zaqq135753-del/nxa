import type { Database as JourneyDatabase, Json } from './database.journey.types';
type ActivationRow = { id: string; owner_id: string; payload: Json; revision: number; business_id: string | null; updated_at: string };
export type Database = Omit<JourneyDatabase, 'public'> & { public: Omit<JourneyDatabase['public'], 'Tables' | 'Functions'> & {
  Tables: JourneyDatabase['public']['Tables'] & { cd_activation_drafts: {
    Row: ActivationRow; Insert: Pick<ActivationRow, 'id' | 'owner_id'> & Partial<ActivationRow>; Update: Partial<ActivationRow>; Relationships: [];
  } };
  Functions: JourneyDatabase['public']['Functions'] & {
    cd_save_activation: { Args: { p_id: string; p_payload: Json; p_revision: number }; Returns: number };
    cd_activate_business: { Args: { p_id: string }; Returns: string };
  };
} };
