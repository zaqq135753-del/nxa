import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../src/services/journeyModel.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const model = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
globalThis.window = { dispatchEvent() {} };
const business = (id, category, description = '') => ({ id, category, name: id, description, tags: [], amenities: [] });
test('Busca ignora acentos e explica resultados usando o cadastro', () => {
  assert.ok(model.scoreBusiness(business('Café','cafes'), 'cafe').score > 0);
  assert.ok(model.scoreBusiness(business('A','restaurantes'), 'jantar').score > 0);
  assert.equal(model.scoreBusiness(business('A','lojas'), 'mergulhar').score, 0);
});
test('Categorias chegam ao checkout correspondente', () => {
  for (const [category, mode] of Object.entries({ restaurantes:'table', hospedagens:'room', passeios:'tour', noite:'ticket', lojas:'goods' })) assert.equal(model.reservationMode(category), mode);
});
test('Roteiro tem paradas únicas e não gera reservas nem pagamentos', () => {
  const day = model.buildDay([business('praia','praias'),business('comer','restaurantes'),business('passeio','passeios')], { budget:200,people:2,interest:'praia' });
  assert.equal(day.length, 3); assert.equal(new Set(day.map(item => item.businessId)).size, 3);
  assert.ok(day.every(item => !('paymentStatus' in item) && !('orderId' in item)));
  assert.deepEqual(model.buildDay([], {budget:100,people:1,interest:''}), []);
});
test('Persistência tolera conteúdo inválido e evita paradas duplicadas', () => {
  storage.set(model.PLAN_KEY, '[{"id":"invalid"}]'); assert.deepEqual(model.readPlan(), []);
  model.addPlanBusiness(business('comer','restaurantes')); model.addPlanBusiness(business('comer','restaurantes'));
  assert.equal(model.readPlan().length, 1);
  storage.set(model.PLAN_KEY, '{'); assert.deepEqual(model.readPlan(), []);
});
test('Planejador considera o orçamento quando o cadastro informa preço', () => {
  const expensive = { ...business('caro','restaurantes'), priceDescription:'R$ 300 a 500' };
  const affordable = { ...business('acessivel','restaurantes'), priceDescription:'R$ 50 a 100' };
  const plan = model.buildDay([expensive, affordable], { budget:100,people:2,interest:'' });
  assert.equal(plan[0].businessId, 'acessivel');
  assert.ok(plan[0].reason.includes('sujeita a confirmação'));
});
