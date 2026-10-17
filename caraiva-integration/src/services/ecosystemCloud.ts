import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.activation.types';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const ecosystemCloud= url&&key ? createClient<Database>(url,key) : null;
export const cloudCheckoutEnabled=import.meta.env.VITE_CARAIVA_CLOUD==='true'&&!!ecosystemCloud;
