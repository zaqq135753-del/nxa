import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Eye, Compass, Waves, Church, Navigation, Sparkles } from "lucide-react";
import type { LiveMapEngineProps, LiveMapPoint } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import "./cartoon-map.css";

// Mapeamento das coordenadas 2D do Guia para o Espaço 3D de Caraíva
// No Guia: x = 0 (Rio) a 100 (Mar) | y = 0 (Norte/Ponta da Barra) a 100 (Sul/Xandó)
function toWorldCoords(point: LiveMapPoint): { x: number; z: number } {
  const b = point.business;
  if (b.coordinates && typeof b.coordinates.x === "number" && typeof b.coordinates.y === "number") {
    // Mapeamento proporcional centrado em (0, 0)
    const x = (b.coordinates.x - 50) * 1.6;
    const z = (b.coordinates.y - 50) * 2.1;
    return { x, z };
  }
  // Fallback baseado em GPS relativo ao centro
  const x = (point.position.lng - CARAIVA_CENTER_COORDS.lng) * 20000;
  const z = (point.position.lat - CARAIVA_CENTER_COORDS.lat) * -22000;
  return { x, z };
}

// Converte coordenadas geográficas de rota (lat, lng) para mundo 3D
function latLngToWorld(lat: number, lng: number): { x: number; z: number } {
  const x = (lng - CARAIVA_CENTER_COORDS.lng) * 22000;
  const z = (lat - CARAIVA_CENTER_COORDS.lat) * -24000;
  return { x, z };
}

// Paleta de cores autênticas das casinhas coloniais de Caraíva
const HOUSE_COLORS: { [key: string]: number } = {
  restaurantes: 0xf59e0b, // Amarelo sol / Mostarda
  bares: 0xef4444,        // Vermelho terracota
  cafes: 0x10b981,        // Verde menta / Folhagem
  praias: 0x06b6d4,       // Azul turquesa
  passeios: 0x3b82f6,     // Azul marinho
  hospedagens: 0x8b5cf6,   // Lavanda colonial
  noite: 0xec4899,        // Rosa bougainville
  lojas: 0xf97316,        // Laranja nativo
  pontos: 0xf8fafc,       // Branco cal histórico
};

// Ícones de categoria para placas 3D
const CATEGORY_EMOJIS: { [key: string]: string } = {
  restaurantes: "🍽️",
  bares: "🍹",
  cafes: "☕",
  praias: "🏖️",
  passeios: "🚤",
  hospedagens: "🏨",
  noite: "♫",
  lojas: "🛍️",
  pontos: "⛪",
};

// Gera textura canvas para o Sprite do marcador
function createMarkerSprite(title: string, emoji: string, isSelected: boolean): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Fundo pill estilizado
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sombra do pill
    ctx.shadowColor = isSelected ? "rgba(245, 158, 11, 0.8)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = isSelected ? 18 : 10;
    ctx.shadowOffsetY = 4;

    // Gradiente do pill
    const grad = ctx.createLinearGradient(16, 20, 240, 80);
    if (isSelected) {
      grad.addColorStop(0, "#F59E0B");
      grad.addColorStop(1, "#D97706");
    } else {
      grad.addColorStop(0, "rgba(15, 23, 42, 0.92)");
      grad.addColorStop(1, "rgba(30, 41, 59, 0.92)");
    }

    // Desenhar pill arredondado
    const x = 16, y = 16, w = 224, h = 64, r = 22;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = grad;
    ctx.fill();

    // Borda iluminada
    ctx.lineWidth = isSelected ? 3.5 : 2;
    ctx.strokeStyle = isSelected ? "#FDE68A" : "rgba(255, 255, 255, 0.25)";
    ctx.stroke();

    // Reset shadow para texto nítido
    ctx.shadowColor = "transparent";

    // Emoji de categoria
    ctx.font = "26px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 32, 48);

    // Nome do lugar
    ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = isSelected ? "#FFFFFF" : "#F8FAFC";
    const truncated = title.length > 14 ? title.substring(0, 13) + "…" : title;
    ctx.fillText(truncated, 72, 49);

    // Ponteiro/Triângulo na parte inferior
    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.lineTo(136, 80);
    ctx.lineTo(128, 96);
    ctx.closePath();
    ctx.fillStyle = isSelected ? "#D97706" : "rgba(30, 41, 59, 0.92)";
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(isSelected ? 9.5 : 7.5, isSelected ? 4.8 : 3.8, 1);
  return sprite;
}

export default function CaraivaCartoon3DMap(props: LiveMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Grupos interativos para Raycaster
  const interactiveHousesRef = useRef<Map<THREE.Object3D, LiveMapPoint>>(new Map());
  const markersGroupRef = useRef<THREE.Group>(new THREE.Group());
  const routeGroupRef = useRef<THREE.Group>(new THREE.Group());
  const avatarGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Estados locais da UI
  const [activePreset, setActivePreset] = useState<"geral" | "igreja" | "rio" | "praia" | "pov">("geral");

  // Callbacks refs para não recriar useEffects
  const callbacksRef = useRef(props);
  callbacksRef.current = props;

  // 1. INICIALIZAÇÃO DA CENA THREE.JS
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdbeafe); // Céu suave de verão
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.0055);

    // Câmera Perspectiva
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 600);
    cameraRef.current = camera;
    camera.position.set(0, 75, 110);

    // Renderer WebGL de Alta Eficiência
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.08; // Impede a câmera de ir abaixo da areia
    controls.minDistance = 15;
    controls.maxDistance = 190;
    controls.target.set(0, 0, 0);

    // ILUMINAÇÃO TROPICAL
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(60, 90, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 110;
    sunLight.shadow.camera.bottom = -110;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x70d6ff, 0xffd166, 0.45);
    scene.add(hemiLight);

    // =========================================================================
    // MODELAGEM GEOGRÁFICA DE CARAÍVA: PENÍNSULA DE AREIA, RIO E MAR
    // =========================================================================

    // 1. TERRENO: Península de Areia Dourada
    const sandGeo = new THREE.PlaneGeometry(160, 240, 48, 48);
    // Suave relevo orgânico nas dunas de Caraíva
    const posAttr = sandGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      // Inclinação suave para o Rio (oeste) e Mar (leste)
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
    scene.add(sandMesh);

    // 2. RUAS E BECOS DE AREIA BATIDA (Caminhos lúdicos)
    const pathsGroup = new THREE.Group();
    const createSandStreet = (points: [number, number][], width = 3.8) => {
      const curve = new THREE.CatmullRomCurve3(
        points.map(([px, pz]) => new THREE.Vector3(px, 0.12, pz))
      );
      const streetGeo = new THREE.TubeGeometry(curve, 32, width / 2, 6, false);
      const streetMat = new THREE.MeshStandardMaterial({
        color: 0xfff6dd, // Areia mais clara pisada
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
    createSandStreet([
      [-28, -20], [-10, -18], [12, -16], [32, -14]
    ], 3.2);
    createSandStreet([
      [-27, 10], [-5, 12], [18, 14], [35, 16]
    ], 3.2);

    // Rua da Praia (Lado leste / Oceano)
    createSandStreet([
      [30, -70], [33, -40], [35, -10], [36, 25], [38, 65]
    ], 4.0);

    scene.add(pathsGroup);

    // 3. RIO CARAÍVA (Águas calmas e límpidas esverdeadas)
    const riverGeo = new THREE.PlaneGeometry(75, 260, 24, 24);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Azul turquesa com fundo verde rio
      roughness: 0.15,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88,
    });
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.position.set(-68, -0.2, 0);
    scene.add(riverMesh);

    // Trapiche / Píer de Madeira Nativa na Beira do Rio
    const pierGeo = new THREE.BoxGeometry(14, 0.6, 3.5);
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const pierMesh = new THREE.Mesh(pierGeo, pierMat);
    pierMesh.position.set(-36, 0.4, -18);
    pierMesh.castShadow = true;
    pierMesh.receiveShadow = true;
    scene.add(pierMesh);

    // Canoas de Madeira Coloridas na margem do Rio
    const createCanoe = (x: number, z: number, angle: number, colorHex: number) => {
      const canoeGroup = new THREE.Group();
      const hullGeo = new THREE.CylinderGeometry(0.8, 0.6, 4.5, 6);
      const hullMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
      const hull = new THREE.Mesh(hullGeo, hullMat);
      hull.rotation.z = Math.PI / 2;
      hull.scale.set(0.6, 1, 1.4);
      canoeGroup.add(hull);
      canoeGroup.position.set(x, 0.3, z);
      canoeGroup.rotation.y = angle;
      canoeGroup.castShadow = true;
      scene.add(canoeGroup);
    };
    createCanoe(-34, -24, 0.3, 0xef4444); // Canoa Vermelha
    createCanoe(-35, -12, -0.2, 0xfacc15); // Canoa Amarela
    createCanoe(-33, 5, 0.45, 0x3b82f6); // Canoa Azul

    // 4. OCEANO ATLÂNTICO (Arrebentação e praia)
    const oceanGeo = new THREE.PlaneGeometry(90, 260, 24, 24);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.1,
      metalness: 0.4,
      transparent: true,
      opacity: 0.9,
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.set(82, -0.3, 0);
    scene.add(oceanMesh);

    // Linha de Espuma Branca da Praia
    const foamGeo = new THREE.PlaneGeometry(6, 250);
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
    });
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    foamMesh.rotation.x = -Math.PI / 2;
    foamMesh.position.set(44, 0.05, 0);
    scene.add(foamMesh);

    // 5. VEGETAÇÃO TROPICAL: Coqueiros & Amendoeiras da Vila
    const natureGroup = new THREE.Group();

    // Gerador de Coqueiro Estilizado
    const createPalmTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      // Tronco curvado em segmentos
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
      const trunkSegments = 5;
      let currY = 0;
      let currX = 0;
      for (let s = 0; s < trunkSegments; s++) {
        const segGeo = new THREE.CylinderGeometry(0.35 * (1 - s * 0.08), 0.45 * (1 - s * 0.08), 1.6, 6);
        const segMesh = new THREE.Mesh(segGeo, trunkMat);
        currX += Math.sin(s * 0.3) * 0.2;
        segMesh.position.set(currX, currY + 0.8, 0);
        segMesh.rotation.z = -Math.sin(s * 0.3) * 0.15;
        segMesh.castShadow = true;
        tree.add(segMesh);
        currY += 1.5;
      }
      // Coroa de Folhas de Palmeira
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const numLeaves = 7;
      for (let l = 0; l < numLeaves; l++) {
        const leafAngle = (l / numLeaves) * Math.PI * 2;
        const leafGeo = new THREE.ConeGeometry(0.9, 3.8, 4);
        const leafMesh = new THREE.Mesh(leafGeo, leafMat);
        leafMesh.position.set(currX, currY, 0);
        leafMesh.rotation.x = Math.sin(leafAngle) * 0.8;
        leafMesh.rotation.z = Math.cos(leafAngle) * 0.8;
        leafMesh.rotation.y = leafAngle;
        leafMesh.scale.set(1, 1, 0.15);
        leafMesh.castShadow = true;
        tree.add(leafMesh);
      }
      // Cocos
      const coconutMat = new THREE.MeshStandardMaterial({ color: 0x713f12 });
      for (let c = 0; c < 3; c++) {
        const nutGeo = new THREE.SphereGeometry(0.32, 6, 6);
        const nutMesh = new THREE.Mesh(nutGeo, coconutMat);
        nutMesh.position.set(currX + Math.cos(c * 2) * 0.4, currY - 0.2, Math.sin(c * 2) * 0.4);
        tree.add(nutMesh);
      }
      tree.position.set(x, 0, z);
      tree.scale.set(scale, scale, scale);
      natureGroup.add(tree);
    };

    // Coqueiros ao longo da praia e beira-rio
    const palmPositions: [number, number, number][] = [
      [-36, -65, 1.2], [-35, -45, 1.0], [-33, -15, 1.3], [-32, 25, 1.1], [-35, 60, 1.2],
      [38, -60, 1.1], [40, -35, 1.3], [42, 5, 1.2], [41, 40, 1.0], [39, 70, 1.2],
      [-10, -50, 0.9], [12, -30, 1.1], [-5, 35, 1.0], [22, 10, 0.9], [0, 80, 1.3]
    ];
    palmPositions.forEach(([px, pz, pScale]) => createPalmTree(px, pz, pScale));

    // Amendoeiras Frondosas (Copas redondas sombreadas)
    const createAlmondTree = (x: number, z: number, r = 3.5) => {
      const tree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.6, 0.8, 3.2, 6);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.6;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo = new THREE.SphereGeometry(r, 7, 7);
      const foliageMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.8,
        flatShading: true,
      });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 4.2;
      foliage.scale.set(1.4, 0.75, 1.2);
      foliage.castShadow = true;
      tree.add(foliage);

      tree.position.set(x, 0, z);
      natureGroup.add(tree);
    };

    createAlmondTree(-18, -15, 3.6);
    createAlmondTree(5, -8, 4.2); // Sombra da Praça da Igreja
    createAlmondTree(25, -22, 3.8);
    createAlmondTree(-12, 45, 3.5);

    scene.add(natureGroup);

    // Adiciona grupos dinâmicos na cena
    scene.add(markersGroupRef.current);
    scene.add(routeGroupRef.current);
    scene.add(avatarGroupRef.current);

    // 6. LOOP DE ANIMAÇÃO 60 FPS
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Ondulação suave do Rio e Mar
      riverMesh.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.08;
      oceanMesh.position.y = -0.3 + Math.cos(elapsedTime * 1.2) * 0.06;
      foamMesh.position.x = 44 + Math.sin(elapsedTime * 1.2) * 0.6;

      // Animação de flutuação dos marcadores (Bobbing)
      markersGroupRef.current.children.forEach((child, index) => {
        child.position.y = 6.2 + Math.sin(elapsedTime * 2.5 + index * 0.6) * 0.45;
      });

      // Animação do Avatar ao longo do trajeto
      if (avatarGroupRef.current.children.length > 0) {
        avatarGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 8)) * 0.4;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Callback de pronto
    callbacksRef.current.onReady();

    // Redimensionamento
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  // 2. CONSTRUÇÃO DAS CASINHAS COLONIAIS 3D PARA CADA ESTABELECIMENTO REAL
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Limpa casinhas e marcadores anteriores
    interactiveHousesRef.current.clear();
    while (markersGroupRef.current.children.length > 0) {
      const obj = markersGroupRef.current.children[0];
      markersGroupRef.current.remove(obj);
    }

    const housesGroup = new THREE.Group();

    props.points.forEach((point) => {
      const b = point.business;
      const { x, z } = toWorldCoords(point);
      const isSelected = b.id === props.selectedId;

      const houseContainer = new THREE.Group();
      houseContainer.position.set(x, 0, z);

      // Determina cor colonial autêntica
      const wallColor = HOUSE_COLORS[b.category] || 0xf59e0b;
      const roofColor = 0xc2410c; // Terracota baiano

      // Se for a Igreja de São Sebastião (Ponto Histórico Especial)
      if (b.id === "igreja-sao-sebastiao" || b.category === "pontos") {
        // Fachada da Igreja Colonial com Torre e Cruz
        const churchBodyGeo = new THREE.BoxGeometry(6.5, 5.5, 9);
        const churchMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
        const churchBody = new THREE.Mesh(churchBodyGeo, churchMat);
        churchBody.position.y = 2.75;
        churchBody.castShadow = true;
        churchBody.receiveShadow = true;
        houseContainer.add(churchBody);

        // Telhado da Igreja
        const churchRoofGeo = new THREE.ConeGeometry(5.2, 3.2, 4);
        const churchRoofMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
        const churchRoof = new THREE.Mesh(churchRoofGeo, churchRoofMat);
        churchRoof.position.y = 6.6;
        churchRoof.rotation.y = Math.PI / 4;
        churchRoof.castShadow = true;
        houseContainer.add(churchRoof);

        // Torre Sineira com Cruz
        const belfryGeo = new THREE.BoxGeometry(2, 3.5, 2);
        const belfry = new THREE.Mesh(belfryGeo, churchMat);
        belfry.position.set(0, 7.5, 2.5);
        belfry.castShadow = true;
        houseContainer.add(belfry);

        // Cruz de Madeira
        const crossGeoH = new THREE.BoxGeometry(1.4, 0.25, 0.25);
        const crossGeoV = new THREE.BoxGeometry(0.25, 1.8, 0.25);
        const crossMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const crossH = new THREE.Mesh(crossGeoH, crossMat);
        const crossV = new THREE.Mesh(crossGeoV, crossMat);
        crossH.position.set(0, 9.8, 2.5);
        crossV.position.set(0, 9.6, 2.5);
        houseContainer.add(crossH);
        houseContainer.add(crossV);
      } else {
        // Casinha Colonial Tradicional de Caraíva
        const houseWidth = 4.2 + (b.rating > 4.7 ? 1.0 : 0);
        const houseDepth = 4.6;
        const houseHeight = 3.2;

        // Paredes Coloridas
        const wallGeo = new THREE.BoxGeometry(houseWidth, houseHeight, houseDepth);
        const wallMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffffff : wallColor,
          roughness: 0.65,
        });
        const walls = new THREE.Mesh(wallGeo, wallMat);
        walls.position.y = houseHeight / 2;
        walls.castShadow = true;
        walls.receiveShadow = true;
        houseContainer.add(walls);

        // Telhado de Duas Águas Terracota
        const roofGeo = new THREE.ConeGeometry(houseWidth * 0.85, 2.2, 4);
        const roofMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xf59e0b : roofColor,
          roughness: 0.8,
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = houseHeight + 1.0;
        roof.rotation.y = Math.PI / 4;
        roof.scale.set(1, 1, houseDepth / houseWidth);
        roof.castShadow = true;
        houseContainer.add(roof);

        // Porta Colonial de Madeira Rústica
        const doorGeo = new THREE.BoxGeometry(1.1, 2.0, 0.15);
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 1.0, houseDepth / 2 + 0.08);
        houseContainer.add(door);

        // Janelas com Moldura Pintada
        const winGeo = new THREE.BoxGeometry(0.85, 0.95, 0.15);
        const winMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
        const winLeft = new THREE.Mesh(winGeo, winMat);
        winLeft.position.set(-1.3, 1.6, houseDepth / 2 + 0.08);
        const winRight = new THREE.Mesh(winGeo, winMat);
        winRight.position.set(1.3, 1.6, houseDepth / 2 + 0.08);
        houseContainer.add(winLeft);
        houseContainer.add(winRight);

        // Varandinha com Lamparina de Noite
        const lampGeo = new THREE.SphereGeometry(0.2, 6, 6);
        const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(0, 2.4, houseDepth / 2 + 0.4);
        houseContainer.add(lamp);
      }

      // Aura / Anel Dourado de Seleção
      if (isSelected) {
        const ringGeo = new THREE.RingGeometry(3.6, 4.4, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.15;
        houseContainer.add(ring);
      }

      // Marcador 3D Flutuante (Sprite Billboard com Emoji e Nome)
      const emoji = CATEGORY_EMOJIS[b.category] || "📍";
      const sprite = createMarkerSprite(b.name, emoji, isSelected);
      sprite.position.set(0, 6.4, 0);
      houseContainer.add(sprite);

      // Associa o grupo à lista de interação para clique
      interactiveHousesRef.current.set(houseContainer, point);
      housesGroup.add(houseContainer);
    });

    scene.add(housesGroup);

    return () => {
      scene.remove(housesGroup);
    };
  }, [props.points, props.selectedId]);

  // 3. ROTA PEDONAL 3D ILUMINADA & AVATAR DE NAVEGAÇÃO
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Limpa polilinha anterior
    while (routeGroupRef.current.children.length > 0) {
      routeGroupRef.current.remove(routeGroupRef.current.children[0]);
    }
    while (avatarGroupRef.current.children.length > 0) {
      avatarGroupRef.current.remove(avatarGroupRef.current.children[0]);
    }

    const routeCoords = props.activeRouteCoordinates;
    if (!routeCoords || routeCoords.length < 2) return;

    // Converte rota geográfica para caminho 3D
    const points3D = routeCoords.map((c) => {
      const { x, z } = latLngToWorld(c.lat, c.lng);
      return new THREE.Vector3(x, 0.35, z);
    });

    const curve = new THREE.CatmullRomCurve3(points3D);
    const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.4, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Verde esmeralda brilhante
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    routeGroupRef.current.add(tubeMesh);

    // Pegadas de Luz ao longo do caminho
    for (let i = 0; i < points3D.length; i += 2) {
      const p = points3D[i];
      const markerGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 12);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(p);
      marker.position.y = 0.2;
      routeGroupRef.current.add(marker);
    }

    // 4. MODELO 3D DO AVATAR CARTOON (Viajante Nativo de Caraíva)
    const avatar = new THREE.Group();
    const startPoint = points3D[0];
    avatar.position.copy(startPoint);

    // Corpo / Camisa Floral
    const shirtGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.5, 8);
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0d9488 });
    const shirt = new THREE.Mesh(shirtGeo, shirtMat);
    shirt.position.y = 1.3;
    shirt.castShadow = true;
    avatar.add(shirt);

    // Cabeça
    const headGeo = new THREE.SphereGeometry(0.48, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.4;
    head.castShadow = true;
    avatar.add(head);

    // Chapéu de Palha Tradicional
    const hatBrimGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 16);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 });
    const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
    hatBrim.position.y = 2.68;
    avatar.add(hatBrim);

    const hatTopGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.55, 12);
    const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
    hatTop.position.y = 2.95;
    avatar.add(hatTop);

    // Mochila Laranja
    const bagGeo = new THREE.BoxGeometry(0.55, 0.8, 0.35);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xea580c });
    const bag = new THREE.Mesh(bagGeo, bagMat);
    bag.position.set(0, 1.4, -0.45);
    avatar.add(bag);

    avatarGroupRef.current.add(avatar);

    // Se houver comando de câmera POV, foca no avatar
    if (cameraRef.current && controlsRef.current) {
      controlsRef.current.target.set(startPoint.x, 1.5, startPoint.z);
      cameraRef.current.position.set(startPoint.x, 6, startPoint.z + 14);
    }
  }, [props.activeRouteCoordinates]);

  // 5. INTERAÇÃO DE CLIQUE E SELEÇÃO VIA RAYCASTER
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Busca interseção com os grupos de casas
    const targets: THREE.Object3D[] = [];
    interactiveHousesRef.current.forEach((_, group) => {
      targets.push(group);
    });

    const intersects = raycaster.intersectObjects(targets, true);
    if (intersects.length > 0) {
      let hitObj: THREE.Object3D | null = intersects[0].object;
      while (hitObj && !interactiveHousesRef.current.has(hitObj)) {
        hitObj = hitObj.parent;
      }
      if (hitObj) {
        const foundPoint = interactiveHousesRef.current.get(hitObj);
        if (foundPoint) {
          callbacksRef.current.onSelect(foundPoint);
          // Transição suave da câmera para focar na casa
          if (controlsRef.current) {
            const targetPos = hitObj.position;
            controlsRef.current.target.set(targetPos.x, 2, targetPos.z);
          }
        }
      }
    }
  }, []);

  // 6. CONTROLE DE PRESETS CINEMATOGRÁFICOS DA CÂMERA
  const applyPreset = (preset: "geral" | "igreja" | "rio" | "praia" | "pov") => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    setActivePreset(preset);

    switch (preset) {
      case "geral":
        camera.position.set(0, 75, 110);
        controls.target.set(0, 0, 0);
        break;
      case "igreja":
        camera.position.set(5, 18, 12);
        controls.target.set(2, 2.5, -10);
        break;
      case "rio":
        camera.position.set(-28, 14, -8);
        controls.target.set(-36, 1, -18);
        break;
      case "praia":
        camera.position.set(40, 22, -10);
        controls.target.set(45, 0.5, 0);
        break;
      case "pov":
        camera.position.set(0, 3.5, 8);
        controls.target.set(0, 2.2, -15);
        break;
    }
  };

  // Suporte a comandos externos da barra do LiveMap
  useEffect(() => {
    const cmd = props.command;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!cmd || !camera || !controls) return;

    if (cmd.reset) {
      applyPreset("geral");
    } else if (cmd.zoomBy) {
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      camera.position.addScaledVector(dir, cmd.zoomBy * 12);
    } else if (cmd.center) {
      const { x, z } = latLngToWorld(cmd.center.lat, cmd.center.lng);
      controls.target.set(x, 2, z);
      camera.position.set(x, 25, z + 35);
    }
  }, [props.command]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-sky-100">
      {/* CANVAS THREE.JS CONTAINER */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* BARRA SUPERIOR DE PONTOS DE VISTA (PRESETS 3D) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl max-w-[94vw] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => applyPreset("geral")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "geral"
              ? "bg-amber-400 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Vila Toda</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("igreja")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "igreja"
              ? "bg-amber-400 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Church className="w-3.5 h-3.5" />
          <span>Igreja & Centro</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("rio")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "rio"
              ? "bg-amber-400 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>Beira-Rio</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("praia")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "praia"
              ? "bg-amber-400 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
        >
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          <span>Praia & Mar</span>
        </button>

        <button
          type="button"
          onClick={() => applyPreset("pov")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "pov"
              ? "bg-emerald-400 text-slate-950 shadow-md font-bold"
              : "text-slate-300 hover:text-white hover:bg-white/10"
          }`}
          title="Visão pedestre dentro da vila de Caraíva"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>POV Na Areia</span>
        </button>
      </div>

      {/* BADGE DE CARTOON 3D NO CANTO */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-slate-200 text-[11px] shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Vila Cartoon 3D · Toque numa casinha para explorar</span>
      </div>

      {/* INDICADOR SE ROTA ATIVA ESTIVER RENDERIZANDO */}
      {props.activeRouteCoordinates && props.activeRouteCoordinates.length > 0 && (
        <div className="absolute top-16 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600/90 text-white text-xs font-bold shadow-xl border border-emerald-400/30 animate-in fade-in duration-300">
          <Navigation className="w-3.5 h-3.5 animate-bounce" />
          <span>Rota 3D na Areia Ativa</span>
        </div>
      )}
    </div>
  );
}
