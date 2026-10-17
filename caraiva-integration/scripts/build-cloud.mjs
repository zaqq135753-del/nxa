import { loadEnv } from 'vite';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const env = { ...loadEnv('cloud', process.cwd(), 'VITE_'), ...process.env };
if (env.VITE_CARAIVA_CLOUD !== 'true' || !env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY) throw Error('Configure as três variáveis públicas do checkout conectado no ambiente de build.');
if (/sb_secret_|service_role/.test(env.VITE_SUPABASE_PUBLISHABLE_KEY)) throw Error('Uma chave privada não pode ser usada no frontend.');
for (const [script, args] of [
  ['scripts/validate-cloud-env.mjs', []],
  ['scripts/test-activation.mjs', []],
  ['node_modules/typescript/bin/tsc', ['-b']],
  ['node_modules/vite/bin/vite.js', ['build', '--mode', 'cloud']],
  ['scripts/verify-public-build.mjs', []]
]) {
  const result = spawnSync(process.execPath, [path.resolve(script), ...args], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
