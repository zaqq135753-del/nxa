import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export type ArchitectureNiche = 'restaurante' | 'pousada';
export interface ArchitecturalModel { root: T.Group; stages: T.Group[]; lights: T.PointLight[]; sign: T.Mesh; dispose: () => void }
// These are original, parametric concept models. They do not describe an existing address.
export function createArchitecture(niche: ArchitectureNiche, name: string): ArchitecturalModel {
  const root = new T.Group();
  const stages = Array.from({ length: 5 }, () => new T.Group());
  stages.forEach((group, i) => { group.name = `assembly-${i}`; root.add(group); });
  const textures: T.Texture[] = [];
  let seed = 71;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  function texture(kind: 'wood' | 'sand' | 'plaster'): T.CanvasTexture {
    const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw Error('Não foi possível preparar as texturas.');
    ctx.fillStyle = kind === 'wood' ? '#92704c' : kind === 'sand' ? '#d3bd95' : '#ddcdb0'; ctx.fillRect(0,0,256,256);
    for (let i=0;i<6500;i++) {
      const alpha = random() * (kind === 'wood' ? .15 : .12);
      ctx.fillStyle = `rgba(${random() > .5 ? '255,245,220' : '50,35,20'},${alpha})`;
      const x = random()*256, y = random()*256;
      ctx.fillRect(x,y,kind === 'wood' ? .5+random()*1.2 : 1,kind === 'wood' ? 8+random()*90 : 1);
    }
    const result = new T.CanvasTexture(canvas); result.colorSpace = T.SRGBColorSpace; result.wrapS = result.wrapT = T.RepeatWrapping;
    textures.push(result); return result;
  }
  const woodMap = texture('wood'), sandMap = texture('sand'), plasterMap = texture('plaster');
  const timber = new T.MeshStandardMaterial({color:'#ad9479',map:woodMap,bumpMap:woodMap,bumpScale:.035,roughness:.88});
  const paleWood = new T.MeshStandardMaterial({color:'#dfc49b',map:woodMap,bumpMap:woodMap,bumpScale:.025,roughness:.88});
  const plaster = new T.MeshStandardMaterial({color:'#eadfc9',map:plasterMap,bumpMap:plasterMap,bumpScale:.02,roughness:1});
  const sand = new T.MeshStandardMaterial({color:'#d9c6a3',map:sandMap,bumpMap:sandMap,bumpScale:.035,roughness:1});
  const roof = new T.MeshStandardMaterial({color:'#a96647',map:plasterMap,bumpMap:plasterMap,bumpScale:.03,roughness:.92});
  const leaves = [new T.MeshStandardMaterial({color:'#536c32',roughness:.95,side:T.DoubleSide}),new T.MeshStandardMaterial({color:'#344c25',roughness:1,side:T.DoubleSide})];
  const brass = new T.MeshStandardMaterial({color:'#ae863e',metalness:.65,roughness:.36});
  const glow = new T.MeshStandardMaterial({color:'#ffe2a2',emissive:'#ffb751',emissiveIntensity:2.5,roughness:.8});
  const lights: T.PointLight[] = [];
  const boxGeometry = new T.BoxGeometry(1,1,1);
  function box(parent: T.Group, material: T.Material, x: number,y: number,z: number,w: number,h: number,d: number): T.Mesh {
    const mesh = new T.Mesh(boxGeometry,material); mesh.position.set(x,y,z); mesh.scale.set(w,h,d); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function cylinder(parent: T.Group, material: T.Material,x:number,y:number,z:number,r:number,h:number): T.Mesh {
    const mesh = new T.Mesh(new T.CylinderGeometry(r,r,h,12), material); mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  const island = new T.Shape();
  for (let i=0;i<=48;i++) { const a=i/48*Math.PI*2, r=5.4 + Math.sin(a*3)*.22 + Math.cos(a*5)*.17; const x=Math.cos(a)*r, z=Math.sin(a)*r*.83; if (!i) island.moveTo(x,z); else island.lineTo(x,z); }
  const islandMesh = new T.Mesh(new T.ExtrudeGeometry(island,{depth:.26,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.12,bevelThickness:.1}),sand);
  islandMesh.rotation.x=-Math.PI/2; islandMesh.position.y=-.12; islandMesh.receiveShadow=true; stages[0].add(islandMesh);
  function lantern(parent:T.Group,x:number,y:number,z:number) {
    cylinder(parent,brass,x,y+.14,z,.16,.08); cylinder(parent,glow,x,y,z,.09,.25); cylinder(parent,brass,x,y-.14,z,.14,.04);
    for(let i=0;i<4;i++) { const a=i/4*Math.PI*2; box(parent,brass,x+Math.cos(a)*.11,y,z+Math.sin(a)*.11,.015,.29,.015); }
    const light=new T.PointLight('#ffc06e',7,4,2);light.position.set(x,y,z); lights.push(light);parent.add(light);
  }
  function chair(parent:T.Group,x:number,z:number,angle:number) {
    const chairRoot=new T.Group();chairRoot.position.set(x,.18,z);chairRoot.rotation.y=angle;parent.add(chairRoot);
    for(const dx of [-.2,.2])for(const dz of [-.2,.2])box(chairRoot,paleWood,dx,.26,dz,.045,.52,.045);
    for(let i=0;i<5;i++)box(chairRoot,paleWood,-.2+i*.1,.53,0,.075,.05,.45);
    for(const dx of [-.2,.2])box(chairRoot,paleWood,dx,.78,-.2,.045,.5,.045);
    for(let i=0;i<4;i++)box(chairRoot,paleWood,0,.62+i*.1,-.2,.43,.045,.045);
  }
  function table(parent:T.Group,x:number,z:number) {
    cylinder(parent,timber,x,.69,z,.07,1);cylinder(parent,paleWood,x,1.2,z,.52,.09);
    const plate=new T.Mesh(new T.CylinderGeometry(.13,.13,.022,24),new T.MeshStandardMaterial({color:'#eee5ce',roughness:.4}));plate.position.set(x-.2,1.26,z);parent.add(plate);
    cylinder(parent,brass,x+.15,1.35,z,.045,.18);
    chair(parent,x,z+.85,0);chair(parent,x,z-.85,Math.PI);
  }
  function cottage(cx:number,cz:number,width:number,depth:number,hotel:boolean) {
    const walls=stages[1], roofs=stages[2], details=stages[3], identity=stages[4];
    const floorDepth=depth+1.5;
    for(let i=0;i<Math.ceil(width/.16);i++)box(walls,i%3 ? timber : paleWood,cx-width/2+.08+i*.16,.18,cz+.45,.15,.12,floorDepth);
    box(walls,plaster,cx,1.28,cz-depth/2,width,2.1,.15);
    for(const side of [-1,1]) {
      box(walls,plaster,cx+side*width/2,1.28,cz,.12,2.1,depth);
      box(walls,plaster,cx+side*(width/2-.4),1.28,cz+depth/2,.65,2.1,.13);
      for(const z of [cz-depth/2,cz+depth/2+.85])box(walls,timber,cx+side*(width/2-.08),1.45,z,.13,2.5,.13);
    }
    box(walls,timber,cx,2.6,cz+depth/2+.85,width+.3,.19,.17);
    const ridge=3.35, roofCenter=cz+.25, halfDepth=(depth+2)/2, slope=.43;
    for(const side of [-1,1]) {
      const sheet=box(roofs,roof,cx,ridge-halfDepth*Math.tan(slope)/2,roofCenter+side*halfDepth/2,width+.7,.09,halfDepth/Math.cos(slope));sheet.rotation.x=side*slope;
      const columns=Math.ceil((width+.7)/.22), rows=Math.ceil(halfDepth/.32);
      const tiles=new T.InstancedMesh(new T.CylinderGeometry(.13,.145,.41,7,1,true,0,Math.PI),roof,columns*rows);
      const dummy=new T.Object3D(), color=new T.Color();let index=0;
      for(let x=0;x<columns;x++)for(let z=0;z<rows;z++) {
        const dz=.15+z*.32; dummy.position.set(cx-(width+.7)/2+x*.22,ridge-dz*Math.tan(slope)+.05,roofCenter+side*dz);
        dummy.rotation.set(Math.PI/2+side*slope,0,0);dummy.updateMatrix();tiles.setMatrixAt(index,dummy.matrix);color.setHSL(.055+random()*.015,.3+random()*.1,.28+random()*.12);tiles.setColorAt(index++,color);
      }
      tiles.castShadow=true;tiles.receiveShadow=true;roofs.add(tiles);
    }
    box(roofs,timber,cx,ridge+.04,roofCenter,width+.8,.12,.14);
    for(let i=0;i<Math.ceil(width/.35);i++)box(roofs,timber,cx-width/2+i*.35,2.6,cz+depth/2+.85,.06,.08,1.15);
    if(hotel) {
      // A veranda with a real draped hammock surface, not a restaurant table.
      box(details,timber,cx,1.2,cz+depth/2+.02,width-.95,1.9,.08);
      box(details,glow,cx,1.3,cz+depth/2+.07,.9,1.3,.025);
      for(let i=0;i<8;i++)box(details,timber,cx-.42+i*.12,1.3,cz+depth/2+.1,.04,1.32,.03);
      const hammockGeometry=new T.PlaneGeometry(1.9,.65,24,8), positions=hammockGeometry.attributes.position;
      for(let i=0;i<positions.count;i++) { const x=positions.getX(i), y=positions.getY(i); positions.setXYZ(i,x,.75+.6*Math.pow(Math.abs(x)/.95,2),y); }
      hammockGeometry.computeVertexNormals();
      const hammock=new T.Mesh(hammockGeometry,new T.MeshStandardMaterial({color:'#ede0b7',roughness:1,side:T.DoubleSide}));hammock.position.set(cx,0,cz+depth/2+.5);details.add(hammock);
      chair(details,cx+width/2-.5,cz+depth/2+.45,.2);
    } else {
      box(details,timber,cx,1.05,cz-depth/2+.5,width-.7,.9,.55);
      for(let row=0;row<2;row++) {
        box(details,timber,cx,1.6+row*.4,cz-depth/2+.2,width-.7,.07,.35);
        for(let i=0;i<12;i++)cylinder(details,i%2?brass:leaves[1],cx-width/2+.55+i*(width-.9)/12,1.78+row*.4,cz-depth/2+.2,.045,.25);
      }
      for(const x of [-1.5,0,1.5])table(details,cx+x,cz+depth/2+.3);
    }
    lantern(identity,cx-width/2+.3,2.1,cz+depth/2+.6);lantern(identity,cx+width/2-.3,2.1,cz+depth/2+.6);
  }
  if(niche==='pousada') { cottage(-2.05,-.55,3.1,2.5,true);cottage(1.95,.55,3.1,2.5,true); }
  else cottage(0,-.35,5.8,2.8,false);
  function palm(x:number,z:number,height:number,rotation:number) {
    const group=new T.Group();group.position.set(x,0,z);group.rotation.y=rotation;stages[3].add(group);
    const bend=.35;
    const trunk=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(-.06,height*.4,0),new T.Vector3(bend,height,0)]),16,.115,7,false),timber);trunk.castShadow=true;group.add(trunk);
    for(let j=0;j<9;j++) {
      const a=j/9*Math.PI*2, r=1.4;
      const spine=new T.CatmullRomCurve3([new T.Vector3(bend,height,0),new T.Vector3(bend+Math.cos(a)*.7,height+.45,Math.sin(a)*.7),new T.Vector3(bend+Math.cos(a)*r,height-.1,Math.sin(a)*r)]);
      const stem=new T.Mesh(new T.TubeGeometry(spine,10,.018,3),leaves[j%2]);group.add(stem);
      for(let k=1;k<10;k++) {
        const t=k/10, origin=spine.getPoint(t), length=.44*Math.sin(t*Math.PI)+.06;
        for(const side of [-1,1]) {
          const direction=a+side*1.0;
          const tip=origin.clone().add(new T.Vector3(Math.cos(direction)*length,-.12,Math.sin(direction)*length));
          const center=origin.clone().lerp(tip,.45);center.y+=.05;
          const perpendicular=new T.Vector3(-Math.sin(direction)*.045,0,Math.cos(direction)*.045);
          const geo=new T.BufferGeometry();const l=center.clone().add(perpendicular), rgt=center.clone().sub(perpendicular);
          geo.setAttribute('position',new T.Float32BufferAttribute([...origin.toArray(),...l.toArray(),...tip.toArray(),...origin.toArray(),...tip.toArray(),...rgt.toArray()],3));geo.computeVertexNormals();
          group.add(new T.Mesh(geo,leaves[(j+k)%2]));
        }
      }
    }
  }
  palm(-3.9,-2,4.4,.3);palm(3.9,-1.7,4.1,-.4);palm(-3.6,2.5,3.3,1.1);
  const bushGeometry=new T.SphereGeometry(1,8,5);
  const bush=new T.InstancedMesh(bushGeometry,leaves[1],900);
  const dummy=new T.Object3D();
  for(let i=0;i<900;i++) {const a=i/900*Math.PI*2,r=4.4+random()*.45;dummy.position.set(Math.cos(a)*r,.18+random()*.55,Math.sin(a)*r*.8);dummy.scale.set(.06+random()*.1,.025+random()*.055,.08+random()*.08);dummy.rotation.set(random(),a,random());dummy.updateMatrix();bush.setMatrixAt(i,dummy.matrix);}
  stages[3].add(bush);
  const flowerMaterial=new T.MeshStandardMaterial({color:'#d26b7b',roughness:.9});
  for(let i=0;i<30;i++) {const a=random()*Math.PI*2;const flower=new T.Mesh(new T.SphereGeometry(.055,5,4),flowerMaterial);flower.position.set(Math.cos(a)*4.3,.5+random()*.35,Math.sin(a)*3.5);stages[3].add(flower);}
  for(let i=0;i<8;i++) {const stone=new T.Mesh(new T.CylinderGeometry(.22,.25,.045,7),plaster);stone.position.set(Math.sin(i*.7)*.17,.03,2+i*.3);stages[0].add(stone);}
  const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;
  const ctx=signCanvas.getContext('2d'); if(!ctx)throw Error('Não foi possível criar a placa.');
  ctx.fillStyle='#32261b';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#c4a471';ctx.lineWidth=3;ctx.strokeRect(15,15,994,226);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f3dfb2';
  let fontSize=68;do {ctx.font=`${fontSize}px Georgia`; if(ctx.measureText(name || 'Seu lugar na vila').width<920)break;fontSize-=2;}while(fontSize>22);
  ctx.fillText((name || 'Seu lugar na vila').slice(0,120),512,128,930);
  const signTexture=new T.CanvasTexture(signCanvas);signTexture.colorSpace=T.SRGBColorSpace;textures.push(signTexture);
  const sign=new T.Mesh(new T.BoxGeometry(niche==='pousada'?2:2.6,.58,.08),new T.MeshStandardMaterial({map:signTexture,roughness:.7}));
  sign.name='business-sign';
  sign.position.set(niche==='pousada'?1.95:0,2.65,niche==='pousada'?2.75:2.0);stages[4].add(sign);
  // Batch static pieces per material and stage. Hundreds of leaves and timber slats
  // become a few GPU draws while each assembly stage remains independently animated.
  const sourceGeometries=new Set<T.BufferGeometry>();
  root.updateMatrixWorld(true);
  for(const stage of stages) {
    const buckets=new Map<T.Material,T.Mesh[]>();
    stage.traverse(object=>{
      if(object instanceof T.Mesh && !(object instanceof T.InstancedMesh) && object!==sign && !Array.isArray(object.material)) {
        const bucket=buckets.get(object.material)??[];bucket.push(object);buckets.set(object.material,bucket);
      }
    });
    const inverse=stage.matrixWorld.clone().invert();
    for(const [material,pieces] of buckets) {
      const parts=pieces.map(piece=>{
        sourceGeometries.add(piece.geometry);
        const geometry=piece.geometry.index?piece.geometry.toNonIndexed():piece.geometry.clone();
        if(!geometry.getAttribute('uv'))geometry.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(geometry.getAttribute('position').count*2),2));
        geometry.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,piece.matrixWorld));return geometry;
      });
      const merged=mergeGeometries(parts);parts.forEach(part=>part.dispose());
      if(merged){const mesh=new T.Mesh(merged,material);mesh.castShadow=mesh.receiveShadow=true;stage.add(mesh);pieces.forEach(piece=>piece.removeFromParent());}
    }
  }
  sourceGeometries.forEach(geometry=>geometry.dispose());
  return {root,stages,lights,sign,dispose() {
    const geometries=new Set<T.BufferGeometry>(), materials=new Set<T.Material>();
    root.traverse(object=>{if(object instanceof T.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>materials.add(material));if(object instanceof T.InstancedMesh)object.dispose();}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }};
}
