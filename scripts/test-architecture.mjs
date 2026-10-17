import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import * as THREE from 'three';
const source = await readFile(new URL('../src/components/partner/onboarding-magic/architecturalScene.ts',import.meta.url),'utf8');
let compiled = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
compiled=compiled.replace("'three'",JSON.stringify(pathToFileURL(path.resolve('node_modules/three/build/three.module.js')).href)).replace("'three/addons/utils/BufferGeometryUtils.js'",JSON.stringify(pathToFileURL(path.resolve('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js')).href));
// Geometry-only tests: the canvas adapter supplies text metrics, never a production image.
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},strokeRect(){},fillText(){},measureText(text){return {width:text.length*35};}})})};
const {createArchitecture}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const signatures=[];
for(const niche of ['restaurante','pousada']){
 const model=createArchitecture(niche,'Nome longo de teste com acentuação · Caraíva');
 model.root.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(model.root),size=bounds.getSize(new THREE.Vector3());
 assert.ok(size.x>8&&size.x<15&&size.y>3&&size.y<8,'Model fits expected architectural scale');
 let meshCount=0,vertices=0,disposed=0;
 model.root.traverse(object=>{
   if(!object.isMesh)return;meshCount++;
   const attribute=object.geometry.getAttribute('position');vertices+=attribute.count;
   for(const value of attribute.array)assert.ok(Number.isFinite(value),'No invalid geometry coordinates');
   object.geometry.addEventListener('dispose',()=>disposed++);
 });
 assert.ok(meshCount<60,'Static geometry remains batched for mobile');
 assert.equal(model.sign.name,'business-sign');
 signatures.push(vertices);model.dispose();assert.ok(disposed>0,'Geometry is freed when scene closes');
 console.log(`${niche}: ${meshCount} meshes, ${vertices} vertices; bounds and cleanup passed.`);
}
assert.notEqual(signatures[0],signatures[1],'Niches use distinct geometry');
delete globalThis.document;
