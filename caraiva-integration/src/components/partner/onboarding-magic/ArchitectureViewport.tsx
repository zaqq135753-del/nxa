import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createArchitecture, type ArchitectureNiche } from './architecturalScene';

export default function ArchitectureViewport({ niche, name, progress, onFailure, onReady }: {
  niche: ArchitectureNiche; name: string; progress: number; onFailure: () => void; onReady: () => void;
}) {
  const host = useRef<HTMLDivElement>(null), position = useRef(progress);
  const modelRef=useRef<ReturnType<typeof createArchitecture> | null>(null);
  const [exporting,setExporting]=useState(false),[exportNotice,setExportNotice]=useState('');
  const callbacks = useRef({ onFailure, onReady }); callbacks.current = { onFailure, onReady }; position.current = progress;
  useEffect(() => {
    const element = host.current; if (!element) return;
    let renderer: T.WebGLRenderer | undefined, model: ReturnType<typeof createArchitecture> | undefined, controls: OrbitControls | undefined;
    let frame = 0, observer: ResizeObserver | undefined, intersection: IntersectionObserver | undefined, visible = true, dirty = true, lastProgress = -1, lastFrame = 0;
    const contextLost = (event: Event) => { event.preventDefault(); callbacks.current.onFailure(); };
    const geometries: T.BufferGeometry[] = [], materials: T.Material[] = [];
    let shadow: T.DirectionalLightShadow | undefined;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
      const mobile = matchMedia('(max-width: 760px)').matches;
      renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2)); renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
      renderer.domElement.setAttribute('aria-label', `Modelo 3D conceitual de ${name || 'um negócio'} · ${niche}`);
      renderer.domElement.setAttribute('role','img'); renderer.domElement.addEventListener('webglcontextlost', contextLost);
      element.appendChild(renderer.domElement);
      const scene = new T.Scene(); scene.background = new T.Color('#090b0c');
      const camera = new T.PerspectiveCamera(38, 1, .1, 80); camera.position.set(9,7.1,11.2);if(mobile)camera.position.multiplyScalar(1.25);
      controls = new OrbitControls(camera, renderer.domElement); controls.target.set(0,1.25,0);controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.08;
      controls.minDistance=9;controls.maxDistance=22;controls.minPolarAngle=.35;controls.maxPolarAngle=Math.PI*.47;controls.enableZoom=false;
      const ambient = new T.HemisphereLight('#f3dcc0','#4e5c51',2.3);scene.add(ambient);
      const sun = new T.DirectionalLight('#ffd9a1',3.4);sun.position.set(-5,8,5);sun.castShadow=true;
      sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=7;sun.shadow.camera.bottom=-7;sun.shadow.normalBias=.04;sun.shadow.bias=-.00015;scene.add(sun);
      shadow=sun.shadow;
      const fill = new T.DirectionalLight('#a0c1c2',1.2);fill.position.set(5,4,-4);scene.add(fill);
      const groundGeometry = new T.PlaneGeometry(100,100); const groundMaterial = new T.ShadowMaterial({ opacity:.35 });geometries.push(groundGeometry);materials.push(groundMaterial);
      const ground = new T.Mesh(groundGeometry,groundMaterial);ground.rotation.x=-Math.PI/2;ground.position.y=-.3;ground.receiveShadow=true;scene.add(ground);
      model = createArchitecture(niche,name);modelRef.current=model;scene.add(model.root);
      const resize = () => { const width=element.clientWidth,height=element.clientHeight;if(width>0&&height>0&&renderer){renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.sub(controls!.target).normalize().multiplyScalar(camera.aspect<1?21.5:16).add(controls!.target);camera.updateProjectionMatrix();dirty=true;} };
      observer=new ResizeObserver(resize);observer.observe(element);resize();
      intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;});intersection.observe(element);
      const render=(now=0)=>{
        if(!document.hidden&&visible&&renderer&&model&&controls&&now-lastFrame>=33){
          lastFrame=now;
          const progress=position.current;
          if(progress!==lastProgress){model.stages.forEach((stage,index)=>{
            const t=T.MathUtils.clamp(progress*5-index,0,1), eased=1-Math.pow(1-t,3);
            stage.visible=t>0;stage.scale.setScalar(Math.max(.001,eased));stage.position.y=index===0?-.35*(1-eased):1.4*(1-eased);
          });model.lights.forEach(light=>{light.intensity=T.MathUtils.clamp((progress-.8)*5,0,1)*7;});dirty=true;lastProgress=progress;}
          const moved=controls.update();if(dirty||moved){renderer.render(scene,camera);dirty=false;}
        }
        frame=requestAnimationFrame(render);
      };
      render();callbacks.current.onReady();
    } catch { callbacks.current.onFailure(); }
    return ()=>{
      cancelAnimationFrame(frame);observer?.disconnect();intersection?.disconnect();controls?.dispose();model?.dispose();shadow?.dispose();modelRef.current=null;geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
      if(renderer){renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
    };
  }, [niche,name]);
  async function exportModel(){
    if(!modelRef.current||exporting)return;
    setExporting(true);setExportNotice('');
    try {
      const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');
      const copy=modelRef.current.root.clone(true);copy.children.forEach(stage=>{stage.visible=true;stage.scale.setScalar(1);stage.position.y=0;});copy.updateMatrixWorld(true);
      const binary=await new GLTFExporter().parseAsync(copy,{binary:true});
      if(!(binary instanceof ArrayBuffer))throw Error('Formato inválido');
      const url=URL.createObjectURL(new Blob([binary],{type:'model/gltf-binary'}));
      const link=document.createElement('a');link.href=url;link.download=`caraiva-${niche}.glb`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
      setExportNotice('Modelo GLB preparado. É um conceito arquitetônico.');
    }catch{setExportNotice('Não foi possível exportar o modelo. Tente novamente.');}
    finally{setExporting(false);}
  }
  return <><div className="cb-viewport" ref={host}/><button className="cb-export" disabled={exporting} onClick={()=>void exportModel()}>{exporting?'Preparando GLB…':'Baixar modelo GLB'}</button>{exportNotice&&<p className="cb-export-notice" role="status">{exportNotice}</p>}</>;
}
