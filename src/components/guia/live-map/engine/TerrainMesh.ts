import * as THREE from 'three';

export interface TerrainComponents {
  sandMesh: THREE.Mesh;
  pathsGroup: THREE.Group;
  foamMesh: THREE.Mesh;
}

export function createCaraivaTerrain(): TerrainComponents {
  // 1. TERRENO: Península de Areia Dourada
  const sandGeo = new THREE.PlaneGeometry(160, 240, 48, 48);
  const posAttr = sandGeo.attributes.position;
  
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    let height = Math.sin(vx * 0.06) * 1.4 + Math.cos(vy * 0.05) * 1.2;
    if (vx < -40) height -= Math.abs(vx + 40) * 0.15; // Baixa até a margem do rio
    if (vx > 45) height -= Math.abs(vx - 45) * 0.12;  // Baixa até a arrebentação
    posAttr.setZ(i, height);
  }
  sandGeo.computeVertexNormals();

  const sandMat = new THREE.MeshStandardMaterial({
    color: 0xf5deb3, // Areia dourada da Bahia
    roughness: 0.95,
    metalness: 0.02,
    flatShading: true,
  });
  const sandMesh = new THREE.Mesh(sandGeo, sandMat);
  sandMesh.rotation.x = -Math.PI / 2;
  sandMesh.receiveShadow = true;

  // 2. RUAS E BECOS DE AREIA BATIDA
  const pathsGroup = new THREE.Group();
  const createSandStreet = (points: [number, number][], width = 3.8) => {
    const curve = new THREE.CatmullRomCurve3(
      points.map(([px, pz]) => new THREE.Vector3(px, 0.12, pz))
    );
    const streetGeo = new THREE.TubeGeometry(curve, 32, width / 2, 6, false);
    const streetMat = new THREE.MeshStandardMaterial({
      color: 0xfff6dd, // Areia clara pisada
      roughness: 0.9,
    });
    const streetMesh = new THREE.Mesh(streetGeo, streetMat);
    streetMesh.scale.set(1, 0.05, 1);
    streetMesh.receiveShadow = true;
    pathsGroup.add(streetMesh);
  };

  // Rua do Rio (Beira-Rio com os botecos e canoas)
  createSandStreet([
    [-32, -80], [-30, -50], [-28, -20], [-27, 10], [-29, 45], [-31, 75]
  ], 4.2);

  // Rua Principal / Centro / Igreja de São Sebastião
  createSandStreet([
    [-15, -60], [-5, -35], [2, -10], [5, 20], [8, 55], [10, 85]
  ], 3.8);

  // Beco da Lua e Travessas que ligam o Rio ao Mar
  createSandStreet([[-28, -20], [-10, -18], [12, -16], [32, -14]], 3.2);
  createSandStreet([[-27, 10], [-5, 12], [18, 14], [35, 16]], 3.2);

  // Rua da Praia (Lado leste / Oceano)
  createSandStreet([
    [30, -70], [33, -40], [35, -10], [36, 25], [38, 65]
  ], 4.0);

  // 3. Linha de Espuma Branca da Praia
  const foamGeo = new THREE.PlaneGeometry(6, 250);
  const foamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.68,
  });
  const foamMesh = new THREE.Mesh(foamGeo, foamMat);
  foamMesh.rotation.x = -Math.PI / 2;
  foamMesh.position.set(44, 0.05, 0);

  return { sandMesh, pathsGroup, foamMesh };
}
