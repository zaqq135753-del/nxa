import { execSync } from 'child_process';
import fs from 'fs';

const categories = {
  "1.1 Skills e Coleções para Agentes": [
    "anthropics/skills",
    "vercel-labs/agent-skills",
    "addyosmani/agent-skills",
    "nextlevelbuilder/ui-ux-pro-max-skill",
    "pbakaus/impeccable",
    "JustineBijuPaul/frontend-ai-skills",
    "SoftwareInFocus/threejs-skills",
    "finfin/awesome-frontend-skills",
    "PyModel/react-frontend-skills",
    "cloudai-x/threejs-skills"
  ],
  "1.2 Frontend e Componentes": [
    "facebook/react",
    "microsoft/TypeScript",
    "tailwindlabs/tailwindcss",
    "shadcn-ui/ui",
    "radix-ui/primitives",
    "DavidHDev/react-bits",
    "pmndrs/zustand",
    "TanStack/query",
    "TanStack/router"
  ],
  "1.3 Motion e Animações": [
    "motiondivision/motion",
    "greensock/GSAP",
    "remotion-dev/remotion",
    "rive-app/rive-react",
    "airbnb/lottie-web"
  ],
  "1.4 3D e WebGL": [
    "mrdoob/three.js",
    "pmndrs/react-three-fiber",
    "pmndrs/drei",
    "pmndrs/postprocessing",
    "BabylonJS/Babylon.js",
    "splinetool/react-spline"
  ],
  "1.5 Backend e SaaS": [
    "supabase/agent-skills",
    "supabase/supabase",
    "prisma/prisma",
    "drizzle-team/drizzle-orm",
    "honojs/hono",
    "nestjs/nest",
    "fastify/fastify",
    "colinhacks/zod"
  ],
  "1.6 Mobile": [
    "flutter/flutter",
    "flutter/agent-plugins",
    "dart-lang/skills"
  ],
  "1.7 Testes, Qualidade e MCP": [
    "microsoft/playwright",
    "microsoft/playwright-mcp",
    "vitest-dev/vitest",
    "millionco/react-doctor",
    "modelcontextprotocol/servers",
    "axe-core/axe-core"
  ]
};

const ghPath = "C:\\Users\\zaqq1\\AppData\\Local\\Microsoft\\WinGet\\Packages\\GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe\\bin\\gh.exe";

const results = {};

for (const [cat, repos] of Object.entries(categories)) {
  results[cat] = [];
  for (const repo of repos) {
    console.log(`Auditing ${repo}...`);
    try {
      const out = execSync(`"${ghPath}" api repos/${repo}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      const data = JSON.parse(out);
      results[cat].push({
        repo,
        status: 'OK',
        html_url: data.html_url,
        description: data.description || 'Sem descrição',
        pushed_at: data.pushed_at,
        stars: data.stargazers_count,
        license: data.license ? data.license.spdx_id || data.license.name : 'Não especificada',
        archived: data.archived,
        fork: data.fork,
        topics: data.topics || []
      });
    } catch (err) {
      results[cat].push({
        repo,
        status: 'NOT_FOUND_OR_ERROR',
        error: 'Repositório não encontrado, privado ou renomeado'
      });
    }
  }
}

fs.writeFileSync('reports/audit-raw.json', JSON.stringify(results, null, 2));
console.log('Done auditing 47 repos. Output saved to reports/audit-raw.json');
