import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../src/services/businessOperationModel.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {canManageOperation,createOperationRequestGate} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('Somente proprietário e gerente configuram catálogo e recebimento na interface', () => {
  for (const role of ['owner','manager']) assert.equal(canManageOperation(role),true);
  for (const role of ['staff','admin','',undefined]) assert.equal(canManageOperation(role),false);
});

test('Consulta atrasada não substitui a resposta mais recente', async () => {
  const gate=createOperationRequestGate();
  let finishOld;
  const oldResponse=new Promise(resolve=>{finishOld=resolve;});
  const oldTicket=gate.start();
  let shown='';
  const old=oldResponse.then(()=>{if(gate.current(oldTicket))shown='antiga';});
  const newTicket=gate.start();
  if(gate.current(newTicket))shown='atual';
  finishOld();await old;
  assert.equal(shown,'atual');
});

test('Desmontagem ou troca de escopo invalida respostas pendentes', () => {
  const gate=createOperationRequestGate(),ticket=gate.start();
  gate.invalidate();assert.equal(gate.current(ticket),false);
  const next=gate.start();assert.equal(gate.current(next),true);
});
