import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
const allowed=new Set(['.html','.js','.css','.svg','.png','.jpg','.jpeg','.webp','.json','.webmanifest','.mp3','.woff','.woff2','.ico']);
let count=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name),rel=path.relative(root,p);if(e.isSymbolicLink())throw Error('Symlink in public output: '+rel);if(e.isDirectory()){if(e.name.startsWith('.')||['src','node_modules','database','scripts'].includes(e.name))throw Error('Internal directory in public output: '+rel);walk(p);}else{if(e.name.startsWith('.')||!allowed.has(path.extname(p))||/^(?:package(?:-lock)?\.json|server\.mjs|tsconfig.*|vercel\.json|railway\.json)$/i.test(e.name))throw Error('Internal file in public output: '+rel);if(/\.(?:js|html|css|json)$/.test(p)){const t=fs.readFileSync(p,'utf8');if(/(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|sourceMappingURL=)/.test(t))throw Error('Secret or source map in output: '+rel);}count++;}}}
walk(root);if(!fs.existsSync(path.join(root,'index.html')))throw Error('Missing index.html');console.log('Public build verified: '+count+' files, no internal files, private keys or sourcemaps.');
