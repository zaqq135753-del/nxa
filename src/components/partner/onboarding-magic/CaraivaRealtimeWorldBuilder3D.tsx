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
  Eye,
  Compass,
  Play,
  Pause,
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
    label: "Fundação & Natureza",
    phrase: "Acomodando a areia beira-rio e despertando os coqueirais...",
    durationMs: 3000,
    cameraPos: [0, 7.5, 17.5],
    targetPos: [0, 1.2, 0],
  },
  {
    id: "walls",
    label: "Mourões & Adobe",
    phrase: "Cravando mourões de eucalipto e erguendo paredes de cal caiada...",
    durationMs: 3200,
    cameraPos: [7.5, 5.5, 14.0],
    targetPos: [0, 1.8, 0],
  },
  {
    id: "roof",
    label: "Telhado Colonial",
    phrase: "Assentando telhas coloniais de barro e acendendo lampiões...",
    durationMs: 3400,
    cameraPos: [5.8, 6.8, 12.0],
    targetPos: [0, 2.4, 0],
  },
  {
    id: "facade_sign",
    label: "Placa Entalhada",
    phrase: "Entalhando o nome em madeira nobre e correntes de ferro...",
    durationMs: 3000,
    cameraPos: [0, 3.2, 8.6],
    targetPos: [0, 2.6, 2.0],
  },
  {
    id: "orb_blessing",
    label: "Living Orb Solar",
    phrase: "O Caraíva Orb abençoa a cumeeira e propaga ondas douradas...",
    durationMs: 3800,
    cameraPos: [0, 5.8, 14.2],
    targetPos: [0, 2.8, 0],
  },
  {
    id: "dive_in",
    label: "Mergulho Cinemático",
    phrase: "Abrindo as portas coloniais e integrando o negócio à vila...",
    durationMs: 2500,
    cameraPos: [0, 1.8, 0.4],
    targetPos: [0, 1.8, -4.0],
  },
  {
    id: "completed",
    label: "Inauguração",
    phrase: "Casario inaugurado com excelência no ecossistema Caraíva Digital!",
    durationMs: 0,
    cameraPos: [0, 3.8, 11.0],
    targetPos: [0, 2.2, 0],
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
    grad.addColorStop(0, "#231207");
    grad.addColorStop(0.25, "#381d0c");
    grad.addColorStop(0.5, "#210f05");
    grad.addColorStop(0.75, "#351b0a");
    grad.addColorStop(1, "#1c0c04");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Veios Orgânicos da Madeira de Lei
    ctx.save();
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 54; i++) {
      const y = (i * canvas.height) / 54;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        256,
        y + Math.sin(i * 0.8) * 18,
        768,
        y - Math.cos(i * 0.6) * 20,
        canvas.width,
        y + Math.sin(i * 1.2) * 14
      );
      ctx.strokeStyle = i % 2 === 0 ? "rgba(14, 7, 3, 0.55)" : "rgba(82, 44, 21, 0.4)";
      ctx.stroke();
    }
    ctx.restore();

    // 3. Moldura Chanfrada Entalhada com Pátina
    const pad = 24;
    ctx.lineWidth = 9;
    ctx.strokeStyle = "rgba(10, 5, 2, 0.9)";
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "rgba(246, 201, 69, 0.55)"; // Filete dourado artesanal
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
    ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "rgba(246, 201, 69, 0.85)";
    ctx.letterSpacing = "6px";
    ctx.fillText("• CARAÍVA • BAHIA •", canvas.width / 2, pad + 55);

    // 6. Nome do Negócio com Efeito Entalhado em Ouro
    const displayName = (businessName || "Casario Colonial").toUpperCase();
    const fontSize = displayName.length > 22 ? 44 : displayName.length > 15 ? 52 : 62;
    ctx.font = `900 ${fontSize}px 'Playfair Display', 'Cinzel', Georgia, serif`;
    ctx.letterSpacing = "3px";

    // Sombra entalhada profunda
    ctx.fillStyle = "#0A0502";
    ctx.fillText(displayName, canvas.width / 2 + 3, canvas.height / 2 + 5);

    // Preenchimento Dourado Rico com Degradê Solar
    const goldGrad = ctx.createLinearGradient(0, canvas.height / 2 - 40, 0, canvas.height / 2 + 40);
    goldGrad.addColorStop(0, "#FFFBEB");
    goldGrad.addColorStop(0.3, "#F6C945");
    goldGrad.addColorStop(0.7, "#D97706");
    goldGrad.addColorStop(1, "#92400E");
    ctx.fillStyle = goldGrad;
    ctx.fillText(displayName, canvas.width / 2, canvas.height / 2);

    // Contorno fino de ouro polido
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.strokeText(displayName, canvas.width / 2, canvas.height / 2);

    // 7. Rodapé com Selo do Ecossistema
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillStyle = "rgba(255, 244, 237, 0.65)";
    ctx.fillText("ECOSSISTEMA DIGITAL & TAPTABLE", canvas.width / 2, canvas.height - pad - 45);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// Construtor procedural de Coqueiro Nativo de Caraíva com física de brisa
function createCoconutPalmTree(height = 6.2, curveDirection = 1): {
  group: THREE.Group;
  fronds: THREE.Mesh[];
  trunk: THREE.Group;
} {
  const palmGroup = new THREE.Group();
  const trunkGroup = new THREE.Group();
  palmGroup.add(trunkGroup);

  // Tronco segmentado com curvatura tropical orgânica
  const segments = 8;
  const segHeight = height / segments;
  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x4e3621,
    roughness: 0.92,
    metalness: 0.05,
  });

  let currentY = 0;
  let currentX = 0;

  for (let i = 0; i < segments; i++) {
    const bottomR = 0.22 - (i / segments) * 0.08;
    const topR = 0.20 - ((i + 1) / segments) * 0.08;
    const segGeo = new THREE.CylinderGeometry(topR, bottomR, segHeight, 9);
    const segMesh = new THREE.Mesh(segGeo, trunkMat);
    segMesh.castShadow = true;
    segMesh.receiveShadow = true;

    // Curva progressiva em direção à praia
    const lean = (i / segments) * 0.12 * curveDirection;
    currentX += lean;
    currentY += segHeight;

    segMesh.position.set(currentX, currentY - segHeight / 2, 0);
    segMesh.rotation.z = -lean * 1.5;
    trunkGroup.add(segMesh);
  }

  // Coroa de Folhas de Palmeira (Fronds)
  const frondsGroup = new THREE.Group();
  frondsGroup.position.set(currentX, currentY, 0);
  palmGroup.add(frondsGroup);

  const frondCount = 9;
  const fronds: THREE.Mesh[] = [];

  const frondMat = new THREE.MeshStandardMaterial({
    color: 0x2e6b35,
    roughness: 0.72,
    metalness: 0.08,
    side: THREE.DoubleSide,
  });

  for (let i = 0; i < frondCount; i++) {
    const angle = (i / frondCount) * Math.PI * 2;
    const frondShape = new THREE.Shape();
    frondShape.moveTo(0, 0);
    frondShape.quadraticCurveTo(0.35, 1.5, 0, 3.2);
    frondShape.quadraticCurveTo(-0.35, 1.5, 0, 0);

    const frondGeo = new THREE.ShapeGeometry(frondShape, 8);
    const frondMesh = new THREE.Mesh(frondGeo, frondMat);
    frondMesh.castShadow = true;

    // Inclinação natural em leque e caimento para baixo
    frondMesh.rotation.z = Math.PI / 2 + 0.35;
    frondMesh.rotation.y = angle;
    frondMesh.rotation.x = 0.65;
    frondMesh.scale.set(0.85, 0.85, 0.85);

    frondsGroup.add(frondMesh);
    fronds.push(frondMesh);
  }

  // Cacho de cocos verdes na base da coroa
  const coconutMat = new THREE.MeshStandardMaterial({ color: 0x4a7c2e, roughness: 0.65 });
  const coconutGeo = new THREE.SphereGeometry(0.14, 8, 8);
  for (let c = 0; c < 5; c++) {
    const cMesh = new THREE.Mesh(coconutGeo, coconutMat);
    const ca = (c / 5) * Math.PI * 2;
    cMesh.position.set(
      currentX + Math.cos(ca) * 0.22,
      currentY - 0.12,
      Math.sin(ca) * 0.22
    );
    cMesh.castShadow = true;
    palmGroup.add(cMesh);
  }

  return { group: palmGroup, fronds, trunk: trunkGroup };
}

// Construtor do Telhado Colonial Real com telhas de canal e capa (barro artesanal)
function createColonialTileRoof(
  width: number,
  depth: number,
  height: number,
  wallHeight: number
): {
  roofGroup: THREE.Group;
  tilesGroup: THREE.Group;
} {
  const roofGroup = new THREE.Group();
  const tilesGroup = new THREE.Group();
  roofGroup.add(tilesGroup);

  // Vigamento estrutural de madeira de maçaranduba
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x3d2011, roughness: 0.9 });
  const ridgeBeamGeo = new THREE.BoxGeometry(width + 0.6, 0.16, 0.16);
  const ridgeBeam = new THREE.Mesh(ridgeBeamGeo, beamMat);
  ridgeBeam.position.set(0, wallHeight + height + 0.05, 0);
  ridgeBeam.castShadow = true;
  roofGroup.add(ridgeBeam);

  // Base rústica das duas águas
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x823315, roughness: 0.95 });
  const slopeAngle = 0.58; // ~33 graus
  const slopeLen = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height, 2)) * 1.08;
  const slopeGeo = new THREE.BoxGeometry(slopeLen, 0.08, depth + 0.6);

  const leftBase = new THREE.Mesh(slopeGeo, baseMat);
  leftBase.position.set(-width / 4 + 0.04, wallHeight + height / 2, 0);
  leftBase.rotation.z = slopeAngle;
  leftBase.receiveShadow = true;
  roofGroup.add(leftBase);

  const rightBase = new THREE.Mesh(slopeGeo, baseMat);
  rightBase.position.set(width / 4 - 0.04, wallHeight + height / 2, 0);
  rightBase.rotation.z = -slopeAngle;
  rightBase.receiveShadow = true;
  roofGroup.add(rightBase);

  // Geração de Telhas Coloniais Tipo Barro Artesanal (Capa & Canal)
  const rows = 12;
  const cols = 9;
  const tileRadius = 0.11;
  const tileLen = (depth + 0.5) / cols;

  const tileColors = [0xb44318, 0xa33612, 0x8c2c0e, 0xc14c1d, 0x983210];

  for (let side = -1; side <= 1; side += 2) {
    for (let r = 0; r < rows; r++) {
      const rowProgress = r / (rows - 1);
      const px = side * (0.2 + rowProgress * (width / 2 - 0.1));
      const py = wallHeight + height - rowProgress * height + 0.08;

      for (let c = 0; c < cols; c++) {
        const pz = -depth / 2 + 0.15 + c * tileLen;

        const tileMat = new THREE.MeshStandardMaterial({
          color: tileColors[(r + c) % tileColors.length],
          roughness: 0.85,
          metalness: 0.04,
        });

        // Telha semicilíndrica de capa (convexa)
        const tileGeo = new THREE.CylinderGeometry(
          tileRadius,
          tileRadius * 1.1,
          tileLen * 1.08,
          8,
          1,
          true,
          0,
          Math.PI
        );
        const tileMesh = new THREE.Mesh(tileGeo, tileMat);
        tileMesh.castShadow = true;
        tileMesh.receiveShadow = true;

        tileMesh.rotation.x = Math.PI / 2;
        tileMesh.rotation.y = side === -1 ? slopeAngle : -slopeAngle;
        tileMesh.position.set(px, py, pz);

        // Pequena variação artesanal de rotação para cada telha de barro moldada à mão
        tileMesh.rotation.z = (Math.random() - 0.5) * 0.08;

        tilesGroup.add(tileMesh);
      }
    }
  }

  // Cumeeira de capeamento no pico central
  const ridgeTileGeo = new THREE.CylinderGeometry(0.14, 0.14, depth + 0.7, 9);
  const ridgeTileMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.85 });
  const ridge = new THREE.Mesh(ridgeTileGeo, ridgeTileMat);
  ridge.rotation.x = Math.PI / 2;
  ridge.position.set(0, wallHeight + height + 0.1, 0);
  ridge.castShadow = true;
  roofGroup.add(ridge);

  return { roofGroup, tilesGroup };
}

// Construtor de Lampião Colonial de Ferro Forjado com Luz Quente
function createColonialLantern(): {
  lanternGroup: THREE.Group;
  light: THREE.PointLight;
} {
  const lanternGroup = new THREE.Group();

  // Braço de ferro forjado
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.4, metalness: 0.85 });
  const armGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
  const arm = new THREE.Mesh(armGeo, ironMat);
  arm.rotation.x = Math.PI / 3;
  lanternGroup.add(arm);

  // Cúpula do lampião
  const cupGeo = new THREE.ConeGeometry(0.14, 0.12, 6);
  const cup = new THREE.Mesh(cupGeo, ironMat);
  cup.position.set(0, 0.18, 0.14);
  lanternGroup.add(cup);

  // Vidro âmbar com filamento incandescente
  const glassGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.18, 8);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffd060,
    emissive: 0xf59e0b,
    emissiveIntensity: 2.2,
    transparent: true,
    opacity: 0.88,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 0.06, 0.14);
  lanternGroup.add(glass);

  // Luz pontual que tremula
  const light = new THREE.PointLight(0xffbe3b, 1.6, 9, 1.8);
  light.position.set(0, 0.06, 0.18);
  light.castShadow = true;
  light.shadow.bias = -0.002;
  lanternGroup.add(light);

  return { lanternGroup, light };
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
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<"director" | "free">("director");

  // Audio Context autocontido (Web Audio API sintetizada, zero downloads de áudio)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Refs de controle de loop Three.js
  const reqIdRef = useRef<number>(0);
  const stageStartTimeRef = useRef<number>(performance.now());
  const stageIndexRef = useRef<number>(0);
  const speedRef = useRef<number>(1);
  const isMutedRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  const cameraModeRef = useRef<"director" | "free">("director");

  // Controle de Órbita 3D Manual (Drag / Swipe)
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngleRef = useRef<{ theta: number; phi: number }>({ theta: 0, phi: 0 });

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

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  // Função para tocar efeitos sonoros táteis via Web Audio API
  const playSensorySound = useCallback((type: "thud" | "wood" | "blessing" | "whoosh" | "chime") => {
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
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.38);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "wood") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === "chime") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.6);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.62);
      } else if (type === "blessing") {
        const freqs = [528, 660, 792, 1056];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.15, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + 2.05);
        });
      } else if (type === "whoosh") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.6);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.66);
      }
    } catch {
      // Audio policy protection
    }
  }, []);

  const themeColor = customColor || CARAIVA_CATEGORY_COLORS[category] || "#F59E0B";

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;

    // 1. Scene com atmosfera de Pôr do Sol de Caraíva (Dark Luxury)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f12);
    scene.fog = new THREE.FogExp2(0x0c0f12, 0.02);

    // 2. Camera com perspectiva cinematográfica suave
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 8.5, 17);
    camera.lookAt(0, 0, 0);

    // 3. Renderer de alta fidelidade visual
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
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // 4. Sistema de Iluminação Tropical & Pôr do Sol
    // Luz ambiente quente do céu de Caraíva
    const ambientLight = new THREE.AmbientLight(0xfff1e0, 0.85);
    scene.add(ambientLight);

    // Hemisfério: céu quente âmbar e reflexo de areia dourada
    const hemiLight = new THREE.HemisphereLight(0xffdfba, 0xc49a6c, 0.65);
    scene.add(hemiLight);

    // Sol Poente da Bahia: feixe dourado com sombras suaves de alta resolução
    const sunLight = new THREE.DirectionalLight(0xffdfa8, 1.85);
    sunLight.position.set(14, 16, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -11;
    sunLight.shadow.camera.right = 11;
    sunLight.shadow.camera.top = 11;
    sunLight.shadow.camera.bottom = -11;
    sunLight.shadow.bias = -0.0006;
    scene.add(sunLight);

    // Luz de borda azul turquesa do Rio e Mar (Rim Light)
    const oceanRimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    oceanRimLight.position.set(-15, 12, -14);
    scene.add(oceanRimLight);

    // Luz interna acolhedora da casinha (surge ao abrir a porta colonial)
    const indoorLight = new THREE.PointLight(0xffb03a, 0, 14);
    indoorLight.position.set(0, 1.8, 0.6);
    scene.add(indoorLight);

    // Luz dinâmica do Caraíva Orb
    const orbPointLight = new THREE.PointLight(0xf6c945, 0, 24);
    scene.add(orbPointLight);

    // --- GRUPO 1: FUNDAÇÃO, AREIA DE CARAÍVA & COQUEIRAIS ---
    const sandGroup = new THREE.Group();
    scene.add(sandGroup);

    // Malha de areia com relevo suave de dunas e tom dourado autêntico
    const sandGeo = new THREE.CylinderGeometry(11.5, 12.5, 0.5, 48);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xc99c6b,
      roughness: 0.98,
      metalness: 0.0,
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.y = -0.25;
    sandMesh.receiveShadow = true;
    sandGroup.add(sandMesh);

    // Caminho pedonal de areia branca batida
    const pathGeo = new THREE.PlaneGeometry(1.8, 6.2);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9,
      roughness: 0.92,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.02, 4.4);
    sandGroup.add(pathMesh);

    // 2 Coqueiros Nativos de Caraíva balançando ao vento
    const palmLeft = createCoconutPalmTree(6.4, -1);
    palmLeft.group.position.set(-5.6, 0, -1.8);
    palmLeft.group.rotation.y = 0.4;
    sandGroup.add(palmLeft.group);

    const palmRight = createCoconutPalmTree(5.8, 1);
    palmRight.group.position.set(5.4, 0, -2.4);
    palmRight.group.rotation.y = -0.8;
    sandGroup.add(palmRight.group);

    // Cerca rústica de mourões com corda de sisal
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const r = 9.8 + (i % 2) * 0.6;
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const postGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.9, 7);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x422617, roughness: 0.9 });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, 0.45, pz);
      post.castShadow = true;
      sandGroup.add(post);
    }

    // Partículas de poeira dourada flutuando na areia (God-rays / dust motes)
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 1] = Math.random() * 6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe6a3,
      size: 0.1,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // --- GRUPO 2: CASARIO (PAREDES DE ADOBE, MOURÕES E ESQUADRIAS) ---
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    const houseW = 4.8;
    const houseH = 3.3;
    const houseD = 4.4;

    // Paredes de adobe caiadas artesanais
    const wallGeo = new THREE.BoxGeometry(houseW, houseH, houseD);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfcf9f2, // Cal branco off-white tradicional
      roughness: 0.85,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = houseH / 2;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    houseGroup.add(wallMesh);

    // 4 Mourões estruturais de eucalipto tratado com chanfros
    const postMat = new THREE.MeshStandardMaterial({ color: 0x361d0f, roughness: 0.92 });
    const postGeo = new THREE.CylinderGeometry(0.15, 0.16, houseH + 0.25, 8);
    const postCoords = [
      [-houseW / 2 + 0.08, houseD / 2 - 0.08],
      [houseW / 2 - 0.08, houseD / 2 - 0.08],
      [-houseW / 2 + 0.08, -houseD / 2 + 0.08],
      [houseW / 2 - 0.08, -houseD / 2 + 0.08],
    ];
    postCoords.forEach(([cx, cz]) => {
      const beam = new THREE.Mesh(postGeo, postMat);
      beam.position.set(cx, (houseH + 0.25) / 2, cz);
      beam.castShadow = true;
      houseGroup.add(beam);
    });

    // Batente da Porta Colonial na cor temática da categoria
    const doorFrameGeo = new THREE.BoxGeometry(1.68, 2.45, 0.22);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.42,
      metalness: 0.08,
    });
    const doorFrame = new THREE.Mesh(doorFrameGeo, frameMat);
    doorFrame.position.set(0, 1.22, houseD / 2 + 0.09);
    doorFrame.castShadow = true;
    houseGroup.add(doorFrame);

    // Folhas da Porta Colonial Dupla com tábuas verticais e puxadores de ferro
    const doorLeafGeo = new THREE.BoxGeometry(0.7, 2.22, 0.08);
    const doorLeafMat = new THREE.MeshStandardMaterial({
      color: 0x301a0e,
      roughness: 0.85,
    });

    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-0.7, 1.18, houseD / 2 + 0.14);
    const leftDoorMesh = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    leftDoorMesh.position.set(0.35, 0, 0);
    leftDoorPivot.add(leftDoorMesh);
    houseGroup.add(leftDoorPivot);

    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(0.7, 1.18, houseD / 2 + 0.14);
    const rightDoorMesh = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    rightDoorMesh.position.set(-0.35, 0, 0);
    rightDoorPivot.add(rightDoorMesh);
    houseGroup.add(rightDoorPivot);

    // Janelas Coloniais com venezianas de madeira na cor da categoria
    const winGeo = new THREE.BoxGeometry(0.95, 1.1, 0.14);
    const winLeft = new THREE.Mesh(winGeo, frameMat);
    winLeft.position.set(-1.55, 1.85, houseD / 2 + 0.08);
    winLeft.castShadow = true;
    houseGroup.add(winLeft);

    const winRight = new THREE.Mesh(winGeo, frameMat);
    winRight.position.set(1.55, 1.85, houseD / 2 + 0.08);
    winRight.castShadow = true;
    houseGroup.add(winRight);

    // Dois Lampiões de Ferro Forjado iluminando a fachada
    const lanternLeft = createColonialLantern();
    lanternLeft.lanternGroup.position.set(-1.15, 2.55, houseD / 2 + 0.12);
    houseGroup.add(lanternLeft.lanternGroup);

    const lanternRight = createColonialLantern();
    lanternRight.lanternGroup.position.set(1.15, 2.55, houseD / 2 + 0.12);
    houseGroup.add(lanternRight.lanternGroup);

    // Soleira de pedra na entrada
    const stepGeo = new THREE.BoxGeometry(1.8, 0.12, 0.6);
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.95 });
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(0, 0.06, houseD / 2 + 0.3);
    step.receiveShadow = true;
    houseGroup.add(step);

    // --- GRUPO 3: TELHADO COLONIAL COM TELHAS DE BARRO ---
    const { roofGroup, tilesGroup } = createColonialTileRoof(houseW + 0.8, houseD + 0.8, 2.0, houseH);
    scene.add(roofGroup);

    // Empena triangular frontal em adobe caiado
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-houseW / 2, 0);
    pedimentShape.lineTo(0, 1.95);
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

    // --- GRUPO 4: PLACA DE MADEIRA NOBRE ENTALHADA ---
    const signGroup = new THREE.Group();
    scene.add(signGroup);

    const woodTexture = createWoodSignTexture(businessName);
    const signGeo = new THREE.BoxGeometry(2.4, 1.2, 0.09);
    const signMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.62 }), // Frente entalhada
      new THREE.MeshStandardMaterial({ color: 0x241208, roughness: 0.9 }),
    ];
    const signMesh = new THREE.Mesh(signGeo, signMaterials);
    signMesh.castShadow = true;
    signGroup.add(signMesh);

    // Correntes de ferro fundido sustentando a placa
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.85 });
    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6);
    const chainLeft = new THREE.Mesh(chainGeo, chainMat);
    chainLeft.position.set(-0.85, 0.72, 0);
    signGroup.add(chainLeft);

    const chainRight = new THREE.Mesh(chainGeo, chainMat);
    chainRight.position.set(0.85, 0.72, 0);
    signGroup.add(chainRight);

    // Posição final da placa: na fachada acima da porta
    const signFinalPos = new THREE.Vector3(0, 3.55, houseD / 2 + 0.24);
    signGroup.position.copy(signFinalPos);

    // --- GRUPO 5: CARAÍVA LIVING ORB & PARTICULAS DOURADAS ---
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbCoreGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const orbCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf6c945,
      emissiveIntensity: 2.8,
      roughness: 0.12,
      metalness: 0.88,
    });
    const orbCore = new THREE.Mesh(orbCoreGeo, orbCoreMat);
    orbGroup.add(orbCore);

    // Enxame solar de 180 lucíolas de Caraíva em órbita
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 0.95 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd97d,
      size: 0.15,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particlePoints);

    // Anel de luz expansivo da bênção solar (Shockwave Ring)
    const ringGeo = new THREE.RingGeometry(0.3, 0.8, 48);
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

    // Posicionamento inicial para a coreografia:
    sandGroup.scale.set(0.001, 1, 0.001);
    houseGroup.scale.set(1, 0.001, 1);
    roofGroup.position.y = 12; // Telhado desce dos céus
    signGroup.scale.set(0.001, 0.001, 0.001);
    orbGroup.position.set(0, 16, 0); // Orb inicia alto no céu
    orbGroup.scale.set(0.001, 0.001, 0.001);

    // Easing helpers orgânicos
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easeOutBack = (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    // Alvos para interpolação da câmera
    const currentCamTarget = new THREE.Vector3(0, 8.5, 17);
    const lookTarget = new THREE.Vector3(0, 0, 0);

    let stageSoundPlayed = -1;

    // Loop de Renderização & Animação
    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Tremor orgânico dos lampiões (chama viva)
      const flicker = 1.5 + Math.sin(time * 0.012) * 0.18 + Math.sin(time * 0.028) * 0.1;
      lanternLeft.light.intensity = flicker;
      lanternRight.light.intensity = flicker * 0.95;

      // Balanço suave dos coqueiros e folhas com o vento do mar
      const wind = Math.sin(time * 0.002) * 0.05;
      palmLeft.trunk.rotation.z = wind * 0.5;
      palmRight.trunk.rotation.z = -wind * 0.4;
      palmLeft.fronds.forEach((f, idx) => {
        f.rotation.z = Math.PI / 2 + 0.35 + Math.sin(time * 0.0025 + idx) * 0.05 + wind;
      });
      palmRight.fronds.forEach((f, idx) => {
        f.rotation.z = Math.PI / 2 + 0.35 + Math.cos(time * 0.0022 + idx) * 0.05 - wind;
      });

      // Flutuação das partículas de poeira solar
      dustPoints.rotation.y = time * 0.00015;

      const activeIdx = stageIndexRef.current;
      const currentStage = STAGES[activeIdx];
      const elapsed = time - stageStartTimeRef.current;
      const duration = currentStage.durationMs / speedRef.current;

      let t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;

      // Sons na transição de estágios
      if (stageSoundPlayed !== activeIdx) {
        stageSoundPlayed = activeIdx;
        if (currentStage.id === "sand") playSensorySound("thud");
        else if (currentStage.id === "walls") playSensorySound("wood");
        else if (currentStage.id === "roof") playSensorySound("chime");
        else if (currentStage.id === "facade_sign") playSensorySound("wood");
        else if (currentStage.id === "orb_blessing") playSensorySound("blessing");
        else if (currentStage.id === "dive_in") playSensorySound("whoosh");
      }

      // Animações Procedurais por Fase
      // 1. ESTÁGIO 'sand': expansão circular da areia e coqueiros
      if (activeIdx === 0) {
        const s = easeOutCubic(t);
        sandGroup.scale.set(s, 1, s);
      } else {
        sandGroup.scale.set(1, 1, 1);
      }

      // 2. ESTÁGIO 'walls': elevação das paredes caiadas e mourões
      if (activeIdx >= 1) {
        if (activeIdx === 1) {
          const sy = easeOutCubic(t);
          houseGroup.scale.set(1, Math.max(sy, 0.001), 1);
        } else {
          houseGroup.scale.set(1, 1, 1);
        }
      }

      // 3. ESTÁGIO 'roof': descida suave das telhas coloniais de barro
      if (activeIdx >= 2) {
        if (activeIdx === 2) {
          const py = THREE.MathUtils.lerp(10, 0, easeOutBack(t));
          roofGroup.position.y = py;
          tilesGroup.position.y = (1 - t) * 1.5;
        } else {
          roofGroup.position.y = 0;
          tilesGroup.position.y = 0;
        }
      }

      // 4. ESTÁGIO 'facade_sign': placa de madeira surge com oscilação pendular
      if (activeIdx >= 3) {
        if (activeIdx === 3) {
          const s = easeOutBack(t);
          signGroup.scale.set(s, s, s);
          signGroup.rotation.x = Math.sin(time * 0.006) * 0.09 * (1 - t);
        } else {
          signGroup.scale.set(1, 1, 1);
          signGroup.rotation.x = 0;
        }
      }

      // 5. ESTÁGIO 'orb_blessing': Orb solar toca a cumeeira e propaga onda dourada
      if (activeIdx >= 4) {
        if (activeIdx === 4) {
          const orbT = easeOutCubic(Math.min(t * 1.3, 1));
          const orbY = THREE.MathUtils.lerp(16, 5.5, orbT);
          orbGroup.position.set(0, orbY, 0);

          const orbScale = easeOutBack(Math.min(t * 1.2, 1));
          orbGroup.scale.set(orbScale, orbScale, orbScale);

          const pulse = 1.0 + Math.sin(time * 0.008) * 0.25;
          orbPointLight.position.copy(orbGroup.position);
          orbPointLight.intensity = 2.6 * pulse * t;

          // Onda de choque luminosa
          if (t > 0.45) {
            const shockT = (t - 0.45) / 0.55;
            const shockScale = THREE.MathUtils.lerp(0.8, 15.5, easeOutCubic(shockT));
            shockwaveRing.position.set(0, 0.06, 0);
            shockwaveRing.scale.set(shockScale, shockScale, shockScale);
            ringMat.opacity = Math.sin(shockT * Math.PI) * 0.95;
          }
        } else {
          orbGroup.position.set(0, 5.5, 0);
          orbGroup.scale.set(1, 1, 1);
          orbPointLight.intensity = 2.2;
          ringMat.opacity = 0;
        }
      }

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
          indoorLight.intensity = openT * 3.8;
        } else {
          leftDoorPivot.rotation.y = -Math.PI * 0.52;
          rightDoorPivot.rotation.y = Math.PI * 0.52;
          indoorLight.intensity = 3.8;
        }
      }

      // Interpolação suave de Câmera
      const targetCam = new THREE.Vector3(...currentStage.cameraPos);
      const targetLook = new THREE.Vector3(...currentStage.targetPos);

      if (activeIdx === 5) {
        targetCam.z = THREE.MathUtils.lerp(7.6, 0.4, easeOutCubic(t));
        targetCam.y = THREE.MathUtils.lerp(3.6, 1.8, easeOutCubic(t));
      }

      // Aplicar rotação manual se o usuário estiver arrastando a tela (Modo Órbita Livre)
      if (cameraModeRef.current === "free") {
        const radius = 13.5;
        const theta = orbitAngleRef.current.theta;
        const phi = Math.max(0.2, Math.min(Math.PI / 2.2, orbitAngleRef.current.phi));
        targetCam.x = radius * Math.sin(phi) * Math.sin(theta);
        targetCam.y = radius * Math.cos(phi) + 1.5;
        targetCam.z = radius * Math.sin(phi) * Math.cos(theta);
        targetLook.set(0, 2.0, 0);
      }

      currentCamTarget.lerp(targetCam, 0.045);
      lookTarget.lerp(targetLook, 0.045);

      camera.position.copy(currentCamTarget);
      camera.lookAt(lookTarget);

      // Progresso percentual
      const totalStages = STAGES.length - 1;
      const overallPercent = Math.min(
        Math.round(((activeIdx + t) / totalStages) * 100),
        100
      );
      setStageProgress(overallPercent);

      // Avançar para próximo estágio
      if (autoPlay && !isPausedRef.current && t >= 1 && activeIdx < STAGES.length - 1) {
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

    // Eventos de Órbita Interativa Manual (Mouse e Touch)
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMousePosRef.current.x;
      const dy = clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: clientX, y: clientY };

      // Alterna automaticamente para o modo livre ao arrastar
      if (cameraModeRef.current !== "free") {
        setCameraMode("free");
      }

      orbitAngleRef.current.theta += dx * 0.008;
      orbitAngleRef.current.phi -= dy * 0.008;
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    dom.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // ResizeObserver
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

    // Limpeza de recursos
    return () => {
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();

      dom.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      dom.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);

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

  const handleSkip = () => {
    setCurrentStageIndex(STAGES.length - 1);
    stageIndexRef.current = STAGES.length - 1;
    setIsCompleted(true);
    onSkip?.();
  };

  const handleRestart = () => {
    setCurrentStageIndex(0);
    stageIndexRef.current = 0;
    stageStartTimeRef.current = performance.now();
    setIsDiving(false);
    setIsCompleted(false);
    setIsPaused(false);
    setCameraMode("director");
    orbitAngleRef.current = { theta: 0, phi: 0 };
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
  };

  const activeStage = STAGES[currentStageIndex];

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#F6C945]/20 bg-[#090B0C] shadow-2xl ${className}`}
      style={{
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 50px -10px rgba(246, 201, 69, 0.18)",
      }}
    >
      {/* Canvas Three.js com suporte a arrastar para orbitar */}
      <div
        ref={mountRef}
        className="w-full h-[440px] sm:h-[520px] md:h-[560px] cursor-grab active:cursor-grabbing select-none"
        title="Clique e arraste para explorar o casario em 360°"
      />

      {/* Dica de interação 360° no canto inferior do canvas */}
      <div className="absolute top-20 right-4 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141719]/80 border border-white/20 text-[10px] text-white/80 font-mono backdrop-blur-sm z-10">
        <Compass className="w-3 h-3 text-[#F6C945]" />
        <span>Arraste para girar em 360°</span>
      </div>

      {/* Vinheta Dark Luxury Superior com Nome do Negócio & Controles */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-[#090B0C]/95 via-[#090B0C]/70 to-transparent flex items-center justify-between pointer-events-none z-20"
        style={{ color: "#FFF4ED" }}
      >
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
            <div
              className="text-[11px] font-mono tracking-widest uppercase flex items-center gap-1.5"
              style={{ color: "#F6C945" }}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>CARAÍVA REALTIME WORLD BUILDER 3D</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: "#FFF4ED" }}>
              {businessName}
            </h2>
          </div>
        </div>

        {/* Controles de Câmera, Áudio e Velocidade */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Alternar Modo de Câmera */}
          <button
            onClick={() => setCameraMode((m) => (m === "director" ? "free" : "director"))}
            className="px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: cameraMode === "free" ? "rgba(246, 201, 69, 0.2)" : "rgba(20, 23, 25, 0.85)",
              borderColor: cameraMode === "free" ? "#F6C945" : "rgba(255, 255, 255, 0.15)",
              color: cameraMode === "free" ? "#F6C945" : "#FFF4ED",
            }}
            title="Alternar entre Câmera Cine-Diretor e Inspeção 360°"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{cameraMode === "free" ? "360° Livre" : "Cine-Tour"}</span>
          </button>

          {/* Pausar / Continuar */}
          {!isCompleted && (
            <button
              onClick={togglePause}
              className="p-2.5 rounded-xl border transition-colors"
              style={{
                backgroundColor: "rgba(20, 23, 25, 0.85)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#FFF4ED",
              }}
              title={isPaused ? "Continuar Construção" : "Pausar Construção"}
            >
              {isPaused ? <Play className="w-4 h-4 text-[#F6C945]" /> : <Pause className="w-4 h-4 text-white/80" />}
            </button>
          )}

          {/* Áudio Sensorial */}
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-2.5 rounded-xl border transition-colors"
            style={{
              backgroundColor: "rgba(20, 23, 25, 0.85)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFF4ED",
            }}
            title={isMuted ? "Ativar Áudio Sensorial" : "Silenciar Áudio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-[#F6C945]" />}
          </button>

          {/* Velocidade */}
          <button
            onClick={() => setSpeedMultiplier((s) => (s === 1 ? 1.6 : 1))}
            className="px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors flex items-center gap-1.5"
            style={{
              backgroundColor: "rgba(20, 23, 25, 0.85)",
              borderColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFF4ED",
            }}
            title="Acelerar Animação"
          >
            <FastForward className="w-3.5 h-3.5 text-[#F6C945]" />
            <span>{speedMultiplier === 1 ? "1x" : "1.6x"}</span>
          </button>

          {!isCompleted && (
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all"
              style={{
                backgroundColor: "rgba(246, 201, 69, 0.18)",
                borderColor: "rgba(246, 201, 69, 0.5)",
                color: "#F6C945",
              }}
            >
              Pular
            </button>
          )}
        </div>
      </div>

      {/* Flash Dourado no Mergulho (dive_in) */}
      <div
        className={`absolute inset-0 bg-[#F6C945] pointer-events-none transition-opacity duration-700 z-30 ${
          isDiving ? "opacity-30" : "opacity-0"
        }`}
      />

      {/* Painel Inferior: Barra de Progresso Dourada, Marcadores e Frase Sensorial */}
      <div
        className="absolute bottom-0 inset-x-0 p-4 sm:p-5 backdrop-blur-md border-t z-20"
        style={{
          backgroundColor: "rgba(14, 18, 21, 0.96)",
          borderColor: "rgba(246, 201, 69, 0.3)",
          color: "#FFF4ED",
        }}
      >
        {/* Barra de Progresso Dourada */}
        <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }}>
          <div
            className="h-full bg-gradient-to-r from-[#D97706] via-[#F6C945] to-[#FFE57F] transition-all duration-300 rounded-full"
            style={{
              width: `${stageProgress}%`,
              boxShadow: "0 0 12px rgba(246, 201, 69, 0.5)",
            }}
          />
        </div>

        {/* Marcadores de Estágios com Alto Contraste */}
        <div className="hidden sm:flex items-center justify-between mb-3 text-xs font-mono">
          {STAGES.slice(0, 6).map((stage, idx) => (
            <span
              key={stage.id}
              className="transition-colors"
              style={{
                color: currentStageIndex >= idx ? "#F6C945" : "rgba(255, 244, 237, 0.45)",
                fontWeight: currentStageIndex >= idx ? "bold" : "normal",
              }}
            >
              {idx + 1}. {stage.label}
            </span>
          ))}
        </div>

        {/* Frase Poética de Caraíva e Estado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F6C945] animate-ping" />
            <p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: "#FFF4ED" }}>
              {activeStage.phrase}
            </p>
          </div>

          {/* Botões na Conclusão */}
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5"
                style={{
                  backgroundColor: "#141719",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFF4ED",
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rever Construção</span>
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
            <div
              className="text-xs font-mono font-bold self-end sm:self-auto flex items-center gap-1.5 px-3 py-1 rounded-lg border"
              style={{
                color: "#F6C945",
                backgroundColor: "rgba(246, 201, 69, 0.15)",
                borderColor: "rgba(246, 201, 69, 0.4)",
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F6C945]" />
              <span>{stageProgress}% CONSTRUÍDO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
