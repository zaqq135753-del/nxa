const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const source=fs.readFileSync('src/lib/businessRules.ts','utf8');
const out=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const rules={};new Function('exports',out)(rules);
test('voucher de outro estabelecimento não permite check-in',()=>{
  assert.equal(rules.canCheckIn({kind:'passeio',refId:'barco-b',paymentStatus:'paid'},{kind:'passeio',refIds:['barco-a']}),false);
});
test('voucher pendente ou já utilizado não permite check-in',()=>{
  const scope={kind:'passeio',refIds:['barco-a']};
  assert.equal(rules.canCheckIn({kind:'passeio',refId:'barco-a',paymentStatus:'pending'},scope),false);
  assert.equal(rules.canCheckIn({kind:'passeio',refId:'barco-a',paymentStatus:'paid',checkedIn:true},scope),false);
});
test('simulação só pode ser usada explicitamente em modo demonstração',()=>{
  const booking={kind:'passeio',refId:'barco-a',paymentStatus:'simulated'};
  assert.equal(rules.canCheckIn(booking,{kind:'passeio',refIds:['barco-a']}),false);
  assert.equal(rules.canCheckIn(booking,{kind:'passeio',refIds:['barco-a'],allowSimulation:true}),true);
});
test('pagamentos não realizados nunca são rotulados como pagos',()=>{
  assert.equal(rules.paymentLabel('simulated'),'Simulação · sem cobrança');
  assert.equal(rules.paymentLabel(undefined),'Aguardando pagamento');
});
test('contagem de vagas isola roteiro e tipo da reserva',()=>{
  assert.equal(rules.bookedSeats('a',[{kind:'passeio',refId:'a',seats:2},{kind:'passeio',refId:'b',seats:7},{kind:'servico',refId:'a',seats:8}]),2);
});
