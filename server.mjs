import http from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import path from 'node:path';
const root=await realpath(path.resolve('dist'));
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json','.mp3':'audio/mpeg','.woff2':'font/woff2','.ico':'image/x-icon'};
const pages=new Set(['/','/guia','/guia/','/parceiros/cadastro','/parceiros/cadastro/']);
const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Permissions-Policy','camera=(self), microphone=(self), geolocation=(self), payment=()');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com; media-src 'self' blob:; worker-src 'self' blob:; frame-src https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
 res.setHeader('Cache-Control','no-store');
 try {
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});res.end(req.method==='HEAD'?undefined:'ok');return;}
  let requested;try{requested=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
  if(requested.includes('\\')||requested.includes(':')||requested.includes('\0')||requested.split('/').some(segment=>segment.startsWith('.'))){res.writeHead(404);res.end();return;}
  let file=pages.has(requested)?path.join(root,'index.html'):path.resolve(root,'.'+requested);
  if(!pages.has(requested)&&(!types[path.extname(file)]||path.extname(file)==='.html')){res.writeHead(404);res.end();return;}
  file=await realpath(file);
  if(!file.startsWith(root+path.sep)){res.writeHead(404);res.end();return;}
  const info=await stat(file);if(!info.isFile())throw new Error();
  const data=req.method==='HEAD'?undefined:await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':pages.has(requested)?'no-store':'public, max-age=3600'});res.end(data);
 }catch{res.writeHead(404);res.end('Não encontrado');}
});
server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;
server.listen(Number(process.env.PORT)||8080,process.env.HOST||'127.0.0.1');
