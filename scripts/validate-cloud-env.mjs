import { loadEnv } from 'vite';

const loaded = loadEnv('cloud', process.cwd(), 'VITE_');
const env = {
  VITE_CARAIVA_CLOUD: process.env.VITE_CARAIVA_CLOUD || loaded.VITE_CARAIVA_CLOUD || 'true',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || loaded.VITE_SUPABASE_URL || 'https://ixqmvogmjvgmafmbbgli.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || loaded.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KKq6OMj_MBwDC1oqyv-CkA_14jnpX6o',
  ...process.env,
};

process.env.VITE_CARAIVA_CLOUD = env.VITE_CARAIVA_CLOUD;
process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (env.VITE_CARAIVA_CLOUD !== 'true') {
  throw Error('Configure VITE_CARAIVA_CLOUD=true no projeto Vercel para publicar o checkout conectado.');
}

const url = new URL(env.VITE_SUPABASE_URL || 'https://missing.invalid');
if (url.protocol !== 'https:' || url.hostname !== 'ixqmvogmjvgmafmbbgli.supabase.co') {
  throw Error('Configure VITE_SUPABASE_URL com o projeto compartilhado.');
}

if (!env.VITE_SUPABASE_PUBLISHABLE_KEY || (!env.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_') && !env.VITE_SUPABASE_PUBLISHABLE_KEY.startsWith('eyJ'))) {
  throw Error('Configure VITE_SUPABASE_PUBLISHABLE_KEY. Nunca use service_role no frontend.');
}

if (/service_role|sb_secret_/.test(env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  throw Error('Uma chave privada não pode ser publicada no frontend.');
}

console.log('Configuração do checkout conectado validada com sucesso.');
