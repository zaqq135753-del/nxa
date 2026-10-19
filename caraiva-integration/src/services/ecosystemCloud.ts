import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.activation.types';
const url = import.meta.env.VITE_SUPABASE_URL || 'https://ixqmvogmjvgmafmbbgli.supabase.co';
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KKq6OMj_MBwDC1oqyv-CkA_14jnpX6o';
export const ecosystemCloud = url && key ? createClient<Database>(url, key) : null;
export const cloudCheckoutEnabled = !!ecosystemCloud;
