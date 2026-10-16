import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Sparkles,
  FastForward,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";

export type WorldBuilderStage =
  | "sand"
  | "walls"
  | "roof"
  | "facade_sign"
  | "orb_blessing"
  | "dive_in"
  | "completed";

export interface CaraivaRealtimeWorldBuilder3DProps {
  businessName?: string;
  category?: string;
  customColor?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

// Mapeamento oficial de cores da arquitetura colonial de Caraíva por categoria
export const CARAIVA_CATEGORY_COLORS: Record<string, string> = {
  restaurantes: "#F59E0B", // Amarelo Mostarda Tradicional
  bares: "#EF4444",        // Vermelho Terracota Bahiano
  cafes: "#10B981",        // Verde Menta de Caraíva
  praias: "#06B6D4",       // Azul Turquesa Beira-Mar
  passeios: "#2563EB",     // Azul Colonial Real
  hospedagens: "#8B5CF6",   // Lavanda Floral Pousada
  noite: "#EC4899",        // Rosa Bougainville do Forró
  lojas: "#F97316",        // Laranja Artesanato Pataxó
  pontos: "#EAB308",       // Dourado Sol de São Sebastião
};

interface StageMetadata {
  id: WorldBuilderStage;
  label: string;
  phrase: string;
  durationMs: number;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

const STAGES: StageMetadata[] = [
  {
    id: "sand",
    label: "Fundação",
    phrase: "Compactando a areia da beira-rio...",
    durationMs: 2600,
    cameraPos: [0, 8, 16],
    targetPos: [0, 0, 0],
  },
  {
    id: "walls",
    label: "Paredes & Adobe",
    phrase: "Erguendo as paredes caiadas e vigas de eucalipto...",
    durationMs: 3000,
    cameraPos: [7, 6, 13],
    targetPos: [0, 1.6, 0],
  },
  {
    id: "roof",
    label: "Telhado Colonial",
    phrase: "Assentando o telhado colonial e esquadrias...",
    durationMs: 2800,
    cameraPos: [5, 7, 11],
    targetPos: [0, 2.4, 0],
  },
  {
    id: "facade_sign",
    label: "Placa Entalhada",
    phrase: "Entalhando a placa de madeira nobre...",
    durationMs: 2800,
    cameraPos: [0, 3.4, 7.8],
    targetPos: [0, 2.7, 2.2],
  },
  {
    id: "orb_blessing",
    label: "Living Orb",
    phrase: "Despertando o Orb de Caraíva e conectando à rede TapTable...",
    durationMs: 3600,
    cameraPos: [0, 6.5, 12.5],
    targetPos: [0, 3.8, 0],
  },
  {
    id: "dive_in",
    label: "Mergulho Cinemático",
    phrase: "Abrindo as portas coloniais e integrando ao destino...",
    durationMs: 2400,
    cameraPos: [0, 1.8, 0.4],
    targetPos: [0, 1.8, -4.0],
  },
  {
    id: "completed",
    label: "Inauguração",
    phrase: "Casario de Caraíva inaugurado com sucesso no ecossistema!",
    durationMs: 0,
    cameraPos: [0, 3.8, 9.5],
    targetPos: [0, 2.0, 0],
  },
];

// Gerador procedural da textura de placa de madeira entalhada em Canvas 2D
function createWoodSignTexture(businessName: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Fundo Madeira Rústica Nobre de Demolição
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#2B170B");
    grad.addColorStop(0.25, "#3D2211");
    grad.addColorStop(0.5, "#251308");
    grad.addColorStop(0.75, "#3A1F0F");
    grad.addColorStop(1, "#200E05");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Veios Orgânicos da Madeira de Lei
    ctx.save();
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 48; i++) {
      const y = (i * canvas.height) / 48;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        256,
        y + Math.sin(i * 0.8) * 16,
        768,
        y - Math.cos(i * 0.6) * 18,
        canvas.width,
        y + Math.sin(i * 1.2) * 12
      );
      ctx.strokeStyle = i % 2 === 0 ? "rgba(18, 9, 4, 0.45)" : "rgba(75, 42, 22, 0.35)";
      ctx.stroke();
    }
    ctx.restore();

    // 3. Moldura Chanfrada Entalhada
    const pad = 24;
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(10, 5, 2, 0.85)";
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "rgba(246, 201, 69, 0.45)"; // Filete dourado artesanal
    ctx.strokeRect(pad + 8, pad + 8, canvas.width - (pad + 8) * 2, canvas.height - (pad + 8) * 2);

    // 4. Pregos/Parafusos Rústicos de Bronze nos 4 Cantos
    const corners = [
      [pad + 20, pad + 20],
      [canvas.width - pad - 20, pad + 20],
      [pad + 20, canvas.height - pad - 20],
      [canvas.width - pad - 20, canvas.height - pad - 20],
    ];

    corners.forEach(([cx, cy]) => {
      const boltGrad = ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, 12);
      boltGrad.addColorStop(0, "#F6C945");
      boltGrad.addColorStop(0.7, "#854D0E");
      boltGrad.addColorStop(1, "#1C1917");
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = boltGrad;
      ctx.fill();
    });

    // 5. Cabeçalho Colonial
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 28px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "rgba(246, 201, 69, 0.75)";
    ctx.letterSpacing = "6px";
    ctx.fillText("• CARAÍVA • BAHIA •", canvas.width / 2, pad + 60);

    // 6. Nome do Negócio com Efeito Entalhado em Ouro
    const displayName = (businessName || "Casario Colonial").toUpperCase();
    const fontSize = displayName.length > 20 ? 46 : displayName.length > 14 ? 54 : 64;
    ctx.font = `900 ${fontSize}px 'Playfair Display', 'Cinzel', Georgia, serif`;
    ctx.letterSpacing = "3px";

    // Sombra entalhada profunda
    ctx.fillStyle = "#0A0502";
    ctx.fillText(displayName, canvas.width / 2 + 3, canvas.height / 2 + 5);

    // Preenchimento Dourado Rico
    const goldGrad = ctx.createLinearGradient(0, canvas.height / 2 - 40, 0, canvas.height / 2 + 40);
    goldGrad.addColorStop(0, "#FFF9D2");
    goldGrad.addColorStop(0.4, "#F6C945");
    goldGrad.addColorStop(1, "#D97706");
    ctx.fillStyle = goldGrad;
    ctx.fillText(displayName, canvas.width / 2, canvas.height / 2);

    // Contorno fino de ouro
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.strokeText(displayName, canvas.width / 2, canvas.height / 2);

    // 7. Rodapé com Selo do Ecossistema
    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillStyle = "rgba(255, 244, 237, 0.55)";
    ctx.fillText("ECOSSISTEMA DIGITAL & TAPTABLE", canvas.width / 2, canvas.height - pad - 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

export const CaraivaRealtimeWorldBuilder3D: React.FC<CaraivaRealtimeWorldBuilder3DProps> = ({
  businessName = "Pousada Flor do Mar",
  category = "hospedagens",
  customColor,
  autoPlay = true,
  onComplete,
  onSkip,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Estados de controle e UI
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0); // 0 a 100
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isDiving, setIsDiving] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Audio Context autocontido (Web Audio API sintetizada, zero downloads de áudio)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Refs de controle de loop Three.js
  const reqIdRef = useRef<number>(0);
  const stageStartTimeRef = useRef<number>(performance.now());
  const stageIndexRef = useRef<number>(0);
  const speedRef = useRef<number>(1);
  const isMutedRef = useRef<boolean>(true);

  // Sincronizar refs
  useEffect(() => {
    stageIndexRef.current = currentStageIndex;
  }, [currentStageIndex]);

  useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Função para tocar efeitos sonoros táteis via Web Audio API
  const playSensorySound = useCallback((type: "thud" | "wood" | "blessing" | "whoosh") => {
    if (isMutedRef.current) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (type === "thud") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else if (type === "wood") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
      } else if (type === "blessing") {
        // Acorde místico e acolhedor de Caraíva (Dourado / Sol)
        const freqs = [528, 660, 792, 1056];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.12, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + 1.85);
        });
      } else if (type === "whoosh") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(450, now + 0.6);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.66);
      }
    } catch {
      // Audio autoplay policy guard
    }
  }, []);

  // Determinar a cor principal da categoria
  const themeColor = customColor || CARAIVA_CATEGORY_COLORS[category] || "#F59E0B";

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // 1. Scene & Fog Dark Luxury
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090b0c);
    scene.fog = new THREE.FogExp2(0x090b0c, 0.022);

    // 2. Camera com perspectiva cinematográfica
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 8, 16);
    camera.lookAt(0, 0, 0);

    // 3. Renderer de alta performance
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 4. Iluminação Tropical & Dark Luxury
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffe6a3, 2.2);
    sunLight.position.set(12, 18, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 40;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    // Luz interna acolhedora da casinha (surge ao abrir a porta)
    const indoorLight = new THREE.PointLight(0xffbe3b, 0, 12);
    indoorLight.position.set(0, 1.8, 0.8);
    scene.add(indoorLight);

    // Luz dinâmica do Caraíva Orb
    const orbPointLight = new THREE.PointLight(0xf6c945, 0, 22);
    scene.add(orbPointLight);

    // --- GRUPO 1: FUNDAÇÃO DE AREIA DOURADA ---
    const sandGroup = new THREE.Group();
    scene.add(sandGroup);

    // Disco de areia batida
    const sandGeo = new THREE.CircleGeometry(9.5, 48);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.95,
      metalness: 0.05,
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.rotation.x = -Math.PI / 2;
    sandMesh.receiveShadow = true;
    sandGroup.add(sandMesh);

    // Anel decorativo de duna exterior
    const duneGeo = new THREE.RingGeometry(9.3, 11.2, 48);
    const duneMat = new THREE.MeshStandardMaterial({
      color: 0xc29b62,
      roughness: 0.98,
      side: THREE.DoubleSide,
    });
    const duneMesh = new THREE.Mesh(duneGeo, duneMat);
    duneMesh.rotation.x = -Math.PI / 2;
    duneMesh.position.y = -0.02;
    sandGroup.add(duneMesh);

    // Caminho de pegadas/areia fofa em direção à porta
    const pathGeo = new THREE.PlaneGeometry(1.6, 5.0);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xe9dcc9,
      roughness: 0.9,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, 3.8);
    sandGroup.add(pathMesh);

    // Pequenas pedras/tochas de restinga nas laterais da areia
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 8.4 + (i % 2) * 0.8;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 6);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.9 });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, 0.4, pz);
      post.castShadow = true;
      sandGroup.add(post);
    }

    // --- GRUPO 2: CASARIO (PAREDES DE ADOBE, ESQUADRIAS E PORTA) ---
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    const houseW = 4.6;
    const houseH = 3.2;
    const houseD = 4.2;

    // Paredes de adobe caiadas
    const wallGeo = new THREE.BoxGeometry(houseW, houseH, houseD);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2, // Cal branco off-white rústico
      roughness: 0.82,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = houseH / 2;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    houseGroup.add(wallMesh);

    // 4 Vigas estruturais de eucalipto nos cantos
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x3d2211, roughness: 0.9 });
    const beamGeo = new THREE.CylinderGeometry(0.14, 0.15, houseH + 0.2, 8);
    const corners = [
      [-houseW / 2 + 0.08, houseD / 2 - 0.08],
      [houseW / 2 - 0.08, houseD / 2 - 0.08],
      [-houseW / 2 + 0.08, -houseD / 2 + 0.08],
      [houseW / 2 - 0.08, -houseD / 2 + 0.08],
    ];
    corners.forEach(([cx, cz]) => {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(cx, (houseH + 0.2) / 2, cz);
      beam.castShadow = true;
      houseGroup.add(beam);
    });

    // Esquadria da Porta Colonial na cor temática da categoria
    const doorFrameGeo = new THREE.BoxGeometry(1.6, 2.4, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.45,
      metalness: 0.1,
    });
    const doorFrame = new THREE.Mesh(doorFrameGeo, frameMat);
    doorFrame.position.set(0, 1.2, houseD / 2 + 0.08);
    doorFrame.castShadow = true;
    houseGroup.add(doorFrame);

    // Folhas da Porta Colonial Dupla (com dobradiças para abrir no dive_in)
    const doorLeafGeo = new THREE.BoxGeometry(0.66, 2.18, 0.08);
    const doorLeafMat = new THREE.MeshStandardMaterial({
      color: 0x381e10, // Madeira escura de lei
      roughness: 0.85,
    });

    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-0.66, 1.15, houseD / 2 + 0.12);
    const leftDoorMesh = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    leftDoorMesh.position.set(0.33, 0, 0);
    leftDoorPivot.add(leftDoorMesh);
    houseGroup.add(leftDoorPivot);

    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(0.66, 1.15, houseD / 2 + 0.12);
    const rightDoorMesh = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    rightDoorMesh.position.set(-0.33, 0, 0);
    rightDoorPivot.add(rightDoorMesh);
    houseGroup.add(rightDoorPivot);

    // Janelas Coloniais com venezianas na cor da categoria
    const winGeo = new THREE.BoxGeometry(0.9, 1.05, 0.12);
    const winLeft = new THREE.Mesh(winGeo, frameMat);
    winLeft.position.set(-1.45, 1.8, houseD / 2 + 0.06);
    winLeft.castShadow = true;
    houseGroup.add(winLeft);

    const winRight = new THREE.Mesh(winGeo, frameMat);
    winRight.position.set(1.45, 1.8, houseD / 2 + 0.06);
    winRight.castShadow = true;
    houseGroup.add(winRight);

    // Lamparina de ferro colonial sobre a porta
    const lanternGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xf6c945 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0, 2.65, houseD / 2 + 0.28);
    houseGroup.add(lantern);

    // --- GRUPO 3: TELHADO COLONIAL EM DUAS ÁGUAS ---
    const roofGroup = new THREE.Group();
    scene.add(roofGroup);

    // Telhado duas águas terracota baiano
    const roofW = houseW + 0.9;
    const roofD = houseD + 0.8;
    const roofH = 1.9;

    // Duas abas inclinadas
    const slopeMat = new THREE.MeshStandardMaterial({
      color: 0xc2410c, // Terracota de barro queimado
      roughness: 0.88,
      metalness: 0.05,
    });

    const slopeAngle = 0.58; // ~33 graus
    const slopeLen = Math.sqrt(Math.pow(roofW / 2, 2) + Math.pow(roofH, 2)) * 1.08;
    const slopeGeo = new THREE.BoxGeometry(slopeLen, 0.18, roofD);

    const leftSlope = new THREE.Mesh(slopeGeo, slopeMat);
    leftSlope.position.set(-roofW / 4 + 0.05, houseH + roofH / 2, 0);
    leftSlope.rotation.z = slopeAngle;
    leftSlope.castShadow = true;
    roofGroup.add(leftSlope);

    const rightSlope = new THREE.Mesh(slopeGeo, slopeMat);
    rightSlope.position.set(roofW / 4 - 0.05, houseH + roofH / 2, 0);
    rightSlope.rotation.z = -slopeAngle;
    rightSlope.castShadow = true;
    roofGroup.add(rightSlope);

    // Cumeeira colonial de barro no topo
    const ridgeGeo = new THREE.CylinderGeometry(0.12, 0.12, roofD + 0.1, 8);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.9 });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridge.rotation.x = Math.PI / 2;
    ridge.position.set(0, houseH + roofH + 0.05, 0);
    roofGroup.add(ridge);

    // Empena triangular frontal em adobe caiado
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-houseW / 2, 0);
    pedimentShape.lineTo(0, roofH - 0.05);
    pedimentShape.lineTo(houseW / 2, 0);
    pedimentShape.closePath();

    const pedimentGeo = new THREE.ShapeGeometry(pedimentShape);
    const pedimentFront = new THREE.Mesh(pedimentGeo, wallMat);
    pedimentFront.position.set(0, houseH, houseD / 2 - 0.02);
    roofGroup.add(pedimentFront);

    const pedimentBack = new THREE.Mesh(pedimentGeo, wallMat);
    pedimentBack.position.set(0, houseH, -houseD / 2 + 0.02);
    pedimentBack.rotation.y = Math.PI;
    roofGroup.add(pedimentBack);

    // --- GRUPO 4: PLACA DE MADEIRA ENTALHADA ---
    const signGroup = new THREE.Group();
    scene.add(signGroup);

    const woodTexture = createWoodSignTexture(businessName);
    const signGeo = new THREE.BoxGeometry(2.3, 1.15, 0.08);
    const signMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }), // sides
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.65 }), // front
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }), // back
    ];
    const signMesh = new THREE.Mesh(signGeo, signMaterials);
    signMesh.castShadow = true;
    signGroup.add(signMesh);

    // Duas cordinhas/correntes de ferro fundido prendendo a placa
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4, metalness: 0.8 });
    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6);
    const chainLeft = new THREE.Mesh(chainGeo, chainMat);
    chainLeft.position.set(-0.8, 0.7, 0);
    signGroup.add(chainLeft);

    const chainRight = new THREE.Mesh(chainGeo, chainMat);
    chainRight.position.set(0.8, 0.7, 0);
    signGroup.add(chainRight);

    // Posição final da placa: na fachada acima da porta
    const signFinalPos = new THREE.Vector3(0, 3.45, houseD / 2 + 0.22);
    signGroup.position.copy(signFinalPos);

    // --- GRUPO 5: CARAÍVA LIVING ORB & PARTICULAS ---
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbCoreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const orbCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfff6c5,
      emissive: 0xf6c945,
      emissiveIntensity: 2.5,
      roughness: 0.15,
      metalness: 0.85,
    });
    const orbCore = new THREE.Mesh(orbCoreGeo, orbCoreMat);
    orbGroup.add(orbCore);

    // Sistema de 140 partículas orbitantes (enxame dourado de lucíolas de Caraíva)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.9 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);
      particleSpeeds[i] = 0.5 + Math.random() * 1.5;
      particleRadii[i] = radius;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd580,
      size: 0.14,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particlePoints);

    // Anel de luz expansivo da bênção (Shockwave Ring)
    const ringGeo = new THREE.RingGeometry(0.3, 0.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf6c945,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    shockwaveRing.rotation.x = -Math.PI / 2;
    scene.add(shockwaveRing);

    // Posicionamento inicial das partes para animação procedural:
    sandGroup.scale.set(0.001, 1, 0.001);

    houseGroup.scale.set(1, 0.001, 1);
    houseGroup.position.y = 0;

    roofGroup.position.y = 12; // Telhado descerá dos céus
    roofGroup.scale.set(1, 1, 1);

    signGroup.scale.set(0.001, 0.001, 0.001);

    orbGroup.position.set(0, 16, 0); // Orb inicia nos céus
    orbGroup.scale.set(0.001, 0.001, 0.001);

    // Easing helpers
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easeOutBack = (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    // Alvos para interpolação da câmera
    const currentCamTarget = new THREE.Vector3(0, 0, 0);
    const lookTarget = new THREE.Vector3(0, 0, 0);

    // Variáveis de controle de som por estágio
    let stageSoundPlayed = -1;

    // Loop de Renderização e Animação Procedural
    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      const activeIdx = stageIndexRef.current;
      const currentStage = STAGES[activeIdx];
      const elapsed = time - stageStartTimeRef.current;
      const duration = currentStage.durationMs / speedRef.current;

      // Calcular progresso do estágio atual (0 a 1)
      let t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;

      // Tocar som na transição de estágio
      if (stageSoundPlayed !== activeIdx) {
        stageSoundPlayed = activeIdx;
        if (currentStage.id === "sand") playSensorySound("thud");
        else if (currentStage.id === "walls") playSensorySound("wood");
        else if (currentStage.id === "roof") playSensorySound("thud");
        else if (currentStage.id === "facade_sign") playSensorySound("wood");
        else if (currentStage.id === "orb_blessing") playSensorySound("blessing");
        else if (currentStage.id === "dive_in") playSensorySound("whoosh");
      }

      // Animações Procedurais Específicas por Estágio
      // 1. ESTÁGIO 'sand': expansão circular da areia
      if (activeIdx === 0) {
        const s = easeOutCubic(t);
        sandGroup.scale.set(s, 1, s);
      } else {
        sandGroup.scale.set(1, 1, 1);
      }

      // 2. ESTÁGIO 'walls': elevação suave das paredes de adobe
      if (activeIdx >= 1) {
        if (activeIdx === 1) {
          const sy = easeOutCubic(t);
          houseGroup.scale.set(1, Math.max(sy, 0.001), 1);
        } else {
          houseGroup.scale.set(1, 1, 1);
        }
      }

      // 3. ESTÁGIO 'roof': descida suave com amortecimento do telhado colonial
      if (activeIdx >= 2) {
        if (activeIdx === 2) {
          const py = THREE.MathUtils.lerp(10, 0, easeOutBack(t));
          roofGroup.position.y = py;
        } else {
          roofGroup.position.y = 0;
        }
      }

      // 4. ESTÁGIO 'facade_sign': placa artesanal surge com leve balanço
      if (activeIdx >= 3) {
        if (activeIdx === 3) {
          const s = easeOutBack(t);
          signGroup.scale.set(s, s, s);
          // Leve balanço pendular nas correntes
          signGroup.rotation.x = Math.sin(time * 0.006) * 0.08 * (1 - t);
        } else {
          signGroup.scale.set(1, 1, 1);
          signGroup.rotation.x = 0;
        }
      }

      // 5. ESTÁGIO 'orb_blessing': Orb desce, pulsa e emite onda expansiva
      if (activeIdx >= 4) {
        if (activeIdx === 4) {
          const orbT = easeOutCubic(Math.min(t * 1.3, 1));
          const orbY = THREE.MathUtils.lerp(16, 5.4, orbT);
          orbGroup.position.set(0, orbY, 0);

          const orbScale = easeOutBack(Math.min(t * 1.2, 1));
          orbGroup.scale.set(orbScale, orbScale, orbScale);

          // Pulsação e brilho da luz
          const pulse = 1.0 + Math.sin(time * 0.008) * 0.2;
          orbPointLight.position.copy(orbGroup.position);
          orbPointLight.intensity = 2.4 * pulse * t;

          // Onda de choque luminosa (Shockwave)
          if (t > 0.45) {
            const shockT = (t - 0.45) / 0.55;
            const shockScale = THREE.MathUtils.lerp(0.8, 14.5, easeOutCubic(shockT));
            shockwaveRing.position.set(0, 0.06, 0);
            shockwaveRing.scale.set(shockScale, shockScale, shockScale);
            ringMat.opacity = Math.sin(shockT * Math.PI) * 0.95;
          }
        } else {
          orbGroup.position.set(0, 5.4, 0);
          orbGroup.scale.set(1, 1, 1);
          orbPointLight.intensity = 2.0;
          ringMat.opacity = 0;
        }
      }

      // Rotação suave contínua do enxame de partículas do Orb
      if (activeIdx >= 4) {
        particlePoints.rotation.y += 0.025;
        particlePoints.rotation.x = Math.sin(time * 0.001) * 0.2;
      }

      // 6. ESTÁGIO 'dive_in': portas coloniais se abrem e luz interna acende
      if (activeIdx >= 5) {
        if (activeIdx === 5) {
          const openT = easeOutCubic(Math.min(t * 1.5, 1));
          leftDoorPivot.rotation.y = -openT * (Math.PI * 0.52);
          rightDoorPivot.rotation.y = openT * (Math.PI * 0.52);

          // Luz acolhedora interna expande para fora
          indoorLight.intensity = openT * 3.5;
        } else {
          leftDoorPivot.rotation.y = -Math.PI * 0.52;
          rightDoorPivot.rotation.y = Math.PI * 0.52;
          indoorLight.intensity = 3.5;
        }
      }

      // Interpolação suave de Câmera (Cinematic Camera Lerp)
      const targetCam = new THREE.Vector3(...currentStage.cameraPos);
      const targetLook = new THREE.Vector3(...currentStage.targetPos);

      // No dive_in, avançar diretamente em direção ao umbral da porta
      if (activeIdx === 5) {
        targetCam.z = THREE.MathUtils.lerp(7.8, 0.4, easeOutCubic(t));
        targetCam.y = THREE.MathUtils.lerp(3.4, 1.8, easeOutCubic(t));
      }

      currentCamTarget.lerp(targetCam, 0.045);
      lookTarget.lerp(targetLook, 0.045);

      camera.position.copy(currentCamTarget);
      camera.lookAt(lookTarget);

      // Atualizar progresso visual para UI
      const totalStages = STAGES.length - 1; // 6 estágios ativos antes de 'completed'
      const overallPercent = Math.min(
        Math.round(((activeIdx + t) / totalStages) * 100),
        100
      );
      setStageProgress(overallPercent);

      // Transição automática para o próximo estágio
      if (autoPlay && t >= 1 && activeIdx < STAGES.length - 1) {
        const nextIdx = activeIdx + 1;
        stageIndexRef.current = nextIdx;
        stageStartTimeRef.current = performance.now();
        setCurrentStageIndex(nextIdx);

        if (nextIdx === 5) {
          setIsDiving(true);
        } else if (nextIdx === 6) {
          setIsCompleted(true);
          onComplete?.();
        }
      }

      renderer.render(scene, camera);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    // ResizeObserver para manter proporção perfeita em telas mobile e desktop
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          width = newW;
          height = newH;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    // Limpeza rigorosa de memória em unmount (Descarte de Geometrias, Materiais, Texturas e Renderer)
    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();

      woodTexture.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [themeColor, businessName, autoPlay, onComplete, playSensorySound]);

  // Função para Pular Introdução e concluir
  const handleSkip = () => {
    setCurrentStageIndex(STAGES.length - 1);
    stageIndexRef.current = STAGES.length - 1;
    setIsCompleted(true);
    onSkip?.();
  };

  // Função para Reiniciar a Construção Procedural
  const handleRestart = () => {
    setCurrentStageIndex(0);
    stageIndexRef.current = 0;
    stageStartTimeRef.current = performance.now();
    setIsDiving(false);
    setIsCompleted(false);
  };

  const activeStage = STAGES[currentStageIndex];

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#F6C945]/20 bg-[#090B0C] shadow-2xl ${className}`}
      style={{
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(246, 201, 69, 0.15)",
      }}
    >
      {/* Canvas Three.js */}
      <div
        ref={mountRef}
        className="w-full h-[420px] sm:h-[500px] md:h-[540px] cursor-grab active:cursor-grabbing"
      />

      {/* Vinheta Dark Luxury Superior com Nome do Negócio */}
      <div className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-[#090B0C]/95 via-[#090B0C]/60 to-transparent flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
            style={{
              backgroundColor: `${themeColor}20`,
              borderColor: `${themeColor}60`,
            }}
          >
            <Building2 className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <div>
            <div className="text-[11px] font-mono tracking-widest text-[#F6C945] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>CARAÍVA WORLD BUILDER 3D</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#FFF4ED] tracking-tight">
              {businessName}
            </h2>
          </div>
        </div>

        {/* Controles de Áudio e Velocidade */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-2.5 rounded-xl bg-[#141719]/80 border border-white/10 hover:border-[#F6C945]/40 text-[#FFF4ED] transition-colors"
            title={isMuted ? "Ativar Áudio Sensorial" : "Silenciar Áudio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-[#F6C945]" />}
          </button>

          <button
            onClick={() => setSpeedMultiplier((s) => (s === 1 ? 1.6 : 1))}
            className="px-3 py-1.5 rounded-xl bg-[#141719]/80 border border-white/10 hover:border-[#F6C945]/40 text-xs font-mono text-[#FFF4ED] transition-colors flex items-center gap-1.5"
            title="Acelerar Animação"
          >
            <FastForward className="w-3.5 h-3.5 text-[#F6C945]" />
            <span>{speedMultiplier === 1 ? "1x" : "1.6x"}</span>
          </button>

          {!isCompleted && (
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-xl bg-[#F6C945]/15 border border-[#F6C945]/40 hover:bg-[#F6C945]/25 text-xs font-semibold text-[#F6C945] transition-all"
            >
              Pular
            </button>
          )}
        </div>
      </div>

      {/* Flash Dourado na Conclusão do Mergulho (dive_in) */}
      <div
        className={`absolute inset-0 bg-[#F6C945] pointer-events-none transition-opacity duration-700 ${
          isDiving ? "opacity-25" : "opacity-0"
        }`}
      />

      {/* Painel Inferior: Indicador de Progresso Sensorial e Frase Mágica */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-[#090B0C] via-[#090B0C]/90 to-transparent">
        {/* Barra de Progresso Dourada */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#D97706] via-[#F6C945] to-[#FFE57F] transition-all duration-300 rounded-full"
            style={{ width: `${stageProgress}%` }}
          />
        </div>

        {/* Marcadores de Estágios */}
        <div className="hidden sm:flex items-center justify-between mb-3 text-[11px] font-mono text-white/40">
          {STAGES.slice(0, 6).map((stage, idx) => (
            <span
              key={stage.id}
              className={`transition-colors ${
                currentStageIndex >= idx ? "text-[#F6C945] font-semibold" : ""
              }`}
            >
              {idx + 1}. {stage.label}
            </span>
          ))}
        </div>

        {/* Frase Sensorial de Caraíva e Estado Atual */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F6C945] animate-ping" />
            <p className="text-xs sm:text-sm text-[#FFF4ED] font-medium tracking-wide">
              {activeStage.phrase}
            </p>
          </div>

          {/* Botões de Ação na Conclusão */}
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="px-3.5 py-2 rounded-xl bg-[#141719] border border-white/10 hover:border-white/20 text-xs font-semibold text-white/80 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rever</span>
              </button>
              <button
                onClick={() => onComplete?.()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#F6C945] to-[#D97706] text-[#090B0C] text-xs font-bold shadow-lg hover:shadow-[#F6C945]/30 transition-all flex items-center gap-1.5"
              >
                <span>Avançar para o Negócio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-[11px] font-mono text-[#F6C945]/80 self-end sm:self-auto flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C945]" />
              <span>{stageProgress}% CONSTRUÍDO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
