const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split(/\r?\n/).filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
const root=env.NEXT_PUBLIC_SUPABASE_URL;
const headers={apikey:env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'};
test('catálogo público compartilhado está acessível sem expor pedidos',async()=>{
  const result=await fetch(`${root}/rest/v1/cd_businesses?select=id,name,niche`,{headers});
  assert.equal(result.status,200);
  const rows=await result.json();assert.equal(rows.length,18);
  assert.ok(rows.some(r=>r.id==='culinaria-central'));
});
test('pedidos privados não estão disponíveis sem autenticação',async()=>{
  const result=await fetch(`${root}/rest/v1/cd_orders?select=id`,{headers});
  assert.ok([401,403].includes(result.status),`unexpected ${result.status}`);
});
test('checkout anônimo não consegue criar pedidos',async()=>{
  const result=await fetch(`${root}/rest/v1/rpc/cd_checkout`,{method:'POST',headers,body:JSON.stringify({p_business:'culinaria-central',p_request:crypto.randomUUID(),p_name:'Teste bloqueado',p_destination:{},p_lines:[]})});
  assert.ok([401,403].includes(result.status),`unexpected ${result.status}`);
});
