import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json','.mp3':'audio/mpeg','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});res.end('ok');return;}
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const requested=decodeURIComponent(url.pathname);
  let file=path.resolve(root,'.'+requested);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(requested==='/'||requested==='/guia'||requested==='/guia/') file=path.join(root,'index.html');
  else if(!path.extname(requested)){res.writeHead(404);res.end('Página indisponível');return;}
  const info=await stat(file); if(!info.isFile()) throw new Error('not file');
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':requested.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Não encontrado');}
}).listen(Number(process.env.PORT)||8080,'0.0.0.0');
