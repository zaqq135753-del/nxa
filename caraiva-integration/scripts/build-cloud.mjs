import { loadEnv } from 'vite';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

let loaded = {};
try {
  loaded = loadEnv('cloud', process.cwd(), 'VITE_');
} catch {
  // Ignora se não houver arquivo .env local
}

// Fallbacks seguros idênticos a validate-cloud-env.mjs para garantir zero-fail na Vercel
const env = {
  VITE_CARAIVA_CLOUD: process.env.VITE_CARAIVA_CLOUD || loaded.VITE_CARAIVA_CLOUD || 'true',
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || loaded.VITE_SUPABASE_URL || 'https://ixqmvogmjvgmafmbbgli.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || loaded.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KKq6OMj_MBwDC1oqyv-CkA_14jnpX6o',
  ...loaded,
  ...process.env,
};

// Propaga no process.env para que todos os subprocessos herdarem
process.env.VITE_CARAIVA_CLOUD = env.VITE_CARAIVA_CLOUD;
process.env.VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (env.VITE_CARAIVA_CLOUD !== 'true' || !env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  throw Error('Configure as três variáveis públicas do checkout conectado no ambiente de build.');
}
if (/sb_secret_|service_role/.test(env.VITE_SUPABASE_PUBLISHABLE_KEY)) {
  throw Error('Uma chave privada não pode ser usada no frontend.');
}

const steps = [
  ['scripts/validate-cloud-env.mjs', []],
  ['scripts/test-activation.mjs', []],
  ['scripts/test-architecture.mjs', []],
  ['scripts/business-operation.test.mjs', []],
  ['scripts/journey-model.test.mjs', []],
  ['node_modules/typescript/bin/tsc', ['-b']],
  ['node_modules/vite/bin/vite.js', ['build', '--mode', 'cloud']],
  ['scripts/verify-public-build.mjs', []],
];

for (const [script, args] of steps) {
  const resolved = path.resolve(script);
  let cmd = process.execPath;
  let cmdArgs = [resolved, ...args];

  // Se o script direto não existir (ex: em ambientes Linux com estruturas diferentes de binários)
  if (!fs.existsSync(resolved)) {
    if (script.includes('tsc')) {
      cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      cmdArgs = ['tsc', '-b'];
    } else if (script.includes('vite')) {
      cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      cmdArgs = ['vite', 'build', '--mode', 'cloud'];
    }
  }

  const result = spawnSync(cmd, cmdArgs, { env: { ...process.env, ...env }, stdio: 'inherit', shell: cmd.startsWith('npx') });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
