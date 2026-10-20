import * as THREE from "three";

/**
 * Cria texturas procedurais PBR em Alta Resolução (1024x1024) para Madeira Envelhecida
 * e Pintura Naval Tradicional Baiana.
 */
function createHdWoodTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 1024;
  bumpCanvas.height = 1024;
  const bumpCtx = bumpCanvas.getContext("2d")!;

  // 1. Base de madeira tropical (Vinhático / Pequi de Caraíva)
  ctx.fillStyle = "#5c3317";
  ctx.fillRect(0, 0, 1024, 1024);

  bumpCtx.fillStyle = "#808080";
  bumpCtx.fillRect(0, 0, 1024, 1024);

  // 2. Fibras e anéis longitudinais de madeira de lei
  for (let i = 0; i < 480; i++) {
    const y = Math.random() * 1024;
    const h = 1 + Math.random() * 3.5;
    const alpha = 0.08 + Math.random() * 0.18;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(42, 22, 10, ${alpha})` : `rgba(139, 84, 40, ${alpha})`;
    ctx.fillRect(0, y, 1024, h);

    bumpCtx.fillStyle = Math.random() > 0.5 ? `rgba(20, 20, 20, ${alpha * 0.7})` : `rgba(220, 220, 220, ${alpha * 0.7})`;
    bumpCtx.fillRect(0, y, 1024, h);
  }

  // 3. Pintura Naval Tradicional de Caraíva (Azul Ultramar + Branco Caiado + Ouro)
  ctx.fillStyle = "#1e3a5f"; // Azul marinho baiano
  ctx.fillRect(0, 260, 1024, 380);

  // Desgaste da tinta pelo salitre e sol
  for (let d = 0; d < 320; d++) {
    const dx = Math.random() * 1024;
    const dy = 260 + Math.random() * 380;
    const radius = 2 + Math.random() * 8;
    ctx.fillStyle = "rgba(75, 42, 20, 0.45)"; // Madeira aparecendo
    ctx.beginPath();
    ctx.arc(dx, dy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Faixa caiada branca de proteção
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, 420, 1024, 60);

  // Linha d'água terracota / ouro
  ctx.fillStyle = "#d97706";
  ctx.fillRect(0, 620, 1024, 30);

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const roughnessCanvas = document.createElement("canvas");
  roughnessCanvas.width = 512;
  roughnessCanvas.height = 512;
  const rCtx = roughnessCanvas.getContext("2d")!;
  rCtx.fillStyle = "#b0b0b0"; // Madeira acetinada semi-polida
  rCtx.fillRect(0, 0, 512, 512);
  const roughnessMap = new THREE.CanvasTexture(roughnessCanvas);

  return { map, bumpMap, roughnessMap };
}

/**
 * Constrói a geometria precisa e fluida do casco da canoa tradicional baiana.
 * Taper duplo nas extremidades (proa e popa pontiagudas), arqueamento de quilha (rocker)
 * e fundo abaulado natural com espessura realista.
 */
function buildAuthenticCanoeHullGeometry(): THREE.BufferGeometry {
  const lengthSegments = 40;
  const widthSegments = 24;
  const length = 5.8;
  const halfLength = length / 2;
  const maxBeam = 1.15; // Largura máxima no meio da canoa
  const depth = 0.65;   // Altura do bordo

  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= lengthSegments; i++) {
    const u = i / lengthSegments;
    const x = (u - 0.5) * length; // de -halfLength até +halfLength
    
    // Perfil de largura (afunila nas pontas como parábola de canoa)
    const normalizedPos = Math.abs(x / halfLength); // 0 no meio, 1 nas pontas
    const widthFactor = Math.cos(normalizedPos * (Math.PI / 2)); // 1 no centro, 0 nas pontas
    const currentBeam = Math.max(0.04, maxBeam * Math.pow(widthFactor, 0.68));

    // Curvatura de quilha (rocker: proa e popa mais elevadas que o centro)
    const rockerElevation = Math.pow(normalizedPos, 2.2) * 0.32;

    for (let j = 0; j <= widthSegments; j++) {
      const v = j / widthSegments;
      // Ângulo de corte transversal em U: de -PI/2 (bordo esquerdo) passando pelo fundo até +PI/2 (bordo direito)
      const angle = (v - 0.5) * Math.PI;

      const z = Math.sin(angle) * (currentBeam / 2);
      // Fundo mais achatado e borda aberta
      const y = -Math.cos(angle) * depth + depth * 0.82 + rockerElevation;

      vertices.push(x, y, z);
      uvs.push(u, v);
    }
  }

  // Gera triângulos da malha
  for (let i = 0; i < lengthSegments; i++) {
    for (let j = 0; j < widthSegments; j++) {
      const a = i * (widthSegments + 1) + j;
      const b = (i + 1) * (widthSegments + 1) + j;
      const c = (i + 1) * (widthSegments + 1) + (j + 1);
      const d = i * (widthSegments + 1) + (j + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Cria a Canoa de Caraíva em Alta Definição (HD) com texturas PBR,
 * detalhes náuticos realistas e lampião dietz acolhedor.
 */
export function createRealisticBahianCanoe(): THREE.Group {
  const canoeGroup = new THREE.Group();
  canoeGroup.name = "CanoaDaTravessiaHD";

  const { map, bumpMap, roughnessMap } = createHdWoodTextures();

  // 1. Casco Esculpido com PBR Shader Realista
  const hullGeo = buildAuthenticCanoeHullGeometry();
  const hullMat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.04,
    roughnessMap,
    roughness: 0.58,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.castShadow = true;
  hull.receiveShadow = true;
  canoeGroup.add(hull);

  // 2. Verdugo e Borda Falsa (Gunwale) em Madeira Maciça Escura
  const gunwaleMat = new THREE.MeshStandardMaterial({
    color: 0x3d2010,
    roughness: 0.65,
  });
  const railGeo = new THREE.CylinderGeometry(0.045, 0.045, 5.7, 16);
  const railLeft = new THREE.Mesh(railGeo, gunwaleMat);
  railLeft.rotation.z = Math.PI / 2;
  railLeft.position.set(0, 0.56, 0.52);
  railLeft.scale.set(1, 1, 0.85);
  canoeGroup.add(railLeft);

  const railRight = new THREE.Mesh(railGeo, gunwaleMat);
  railRight.rotation.z = Math.PI / 2;
  railRight.position.set(0, 0.56, -0.52);
  railRight.scale.set(1, 1, 0.85);
  canoeGroup.add(railRight);

  // 3. Quilha e Roda de Proa (Keel & Stem)
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x271408, roughness: 0.7 });
  const stemGeo = new THREE.BoxGeometry(5.6, 0.08, 0.08);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, -0.15, 0);
  canoeGroup.add(stem);

  // 4. Bancos Interiores (Toldas & Bancos de Travessia)
  const benchMat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.03,
    roughness: 0.6,
  });

  [-1.4, -0.2, 1.1].forEach((bx) => {
    const benchWidth = 0.28;
    const benchSpan = 0.95 - Math.abs(bx) * 0.18;
    const benchGeo = new THREE.BoxGeometry(benchWidth, 0.05, benchSpan);
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(bx, 0.32, 0);
    bench.castShadow = true;
    canoeGroup.add(bench);
  });

  // 5. Rolo de Corda Náutica de Sisal na Proa
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.9 });
  const ropeTorus = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 8, 20), ropeMat);
  ropeTorus.rotation.x = Math.PI / 2;
  ropeTorus.position.set(2.4, 0.42, 0);
  canoeGroup.add(ropeTorus);

  // 6. Lampião a Querosene Realista (Dietz Hurricane Lantern)
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(2.55, 0.48, 0);

  // Base de metal oxidado / latão envelhecido
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x292524,
    metalness: 0.85,
    roughness: 0.35,
  });
  const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.1, 12), metalMat);
  lanternGroup.add(baseMesh);

  // Vidro protetor translúcido
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffedd5,
    transmission: 0.85,
    opacity: 1,
    transparent: true,
    roughness: 0.1,
    ior: 1.5,
  });
  const chimneyMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.18, 12), glassMat);
  chimneyMesh.position.y = 0.14;
  lanternGroup.add(chimneyMesh);

  // Chaminé de metal superior
  const topMesh = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.08, 12), metalMat);
  topMesh.position.y = 0.26;
  lanternGroup.add(topMesh);

  // Alça de arame curvada
  const handleMesh = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.015, 6, 16, Math.PI), metalMat);
  handleMesh.position.y = 0.28;
  lanternGroup.add(handleMesh);

  // Chama de fogo viva e luz pontual quente
  const flameMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  flameMesh.position.y = 0.12;
  lanternGroup.add(flameMesh);

  const lanternLight = new THREE.PointLight(0xf59e0b, 1.8, 12);
  lanternLight.position.set(0, 0.14, 0);
  lanternLight.castShadow = true;
  lanternGroup.add(lanternLight);

  canoeGroup.add(lanternGroup);

  // 7. Par de Remos de Madeira Maciça Tradicional
  const oarMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.55,
  });

  const createOar = (sideZ: number, rotZ: number) => {
    const oar = new THREE.Group();
    // Eixo / punho do remo
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.2, 8), oarMat);
    shaft.position.y = 0.7;
    oar.add(shaft);

    // Pá achatada do remo esculpida em folha
    const bladeGeo = new THREE.BoxGeometry(0.02, 0.55, 0.18);
    const blade = new THREE.Mesh(bladeGeo, oarMat);
    blade.position.y = -0.15;
    oar.add(blade);

    oar.position.set(-0.8, 0.42, sideZ);
    oar.rotation.x = sideZ > 0 ? 0.45 : -0.45;
    oar.rotation.z = rotZ;
    return oar;
  };

  const activeOar = createOar(0.55, -0.32);
  activeOar.name = "RemoAtivo";
  canoeGroup.add(activeOar);

  // 8. Silhueta do Barqueiro de Caraíva em Linho & Chapéu de Palha Carnaúba
  const boatman = new THREE.Group();
  boatman.name = "Barqueiro";

  const linenMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.9,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x8d5b4c, // Tom de pele pardo/moreno do pescador baiano
    roughness: 0.75,
  });

  // Tronco com camisa de linho
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 0.65, 8), linenMat);
  torso.position.set(0, 0.58, 0);
  boatman.add(torso);

  // Braço segurando o remo
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.45, 6), skinMat);
  arm.position.set(0.12, 0.55, 0.22);
  arm.rotation.x = 0.5;
  arm.rotation.z = -0.35;
  boatman.add(arm);

  // Cabeça
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), skinMat);
  head.position.set(0, 0.98, 0);
  boatman.add(head);

  // Chapéu de Palha de Carnaúba com abas largas
  const strawMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.95,
  });
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 16), strawMat);
  brim.position.set(0, 1.04, 0);
  boatman.add(brim);

  const crown = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.16, 12), strawMat);
  crown.position.set(0, 1.12, 0);
  boatman.add(crown);

  boatman.position.set(-1.4, 0, 0);
  canoeGroup.add(boatman);

  return canoeGroup;
}
