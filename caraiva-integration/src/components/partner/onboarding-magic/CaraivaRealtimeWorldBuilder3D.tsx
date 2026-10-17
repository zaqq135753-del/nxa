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

export const CARAIVA_CATEGORY_COLORS: Record<string, string> = {
  restaurantes: "#F59E0B",
  bares: "#EF4444",
  cafes: "#10B981",
  praias: "#06B6D4",
  passeios: "#2563EB",
  hospedagens: "#8B5CF6",
  noite: "#EC4899",
  lojas: "#F97316",
  pontos: "#EAB308",
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
    label: "Pedestal & Areia",
    phrase: "Elevando o pedestal de galeria e a ilha de areia de Caraíva...",
    durationMs: 3000,
    cameraPos: [0, 8.5, 17.0],
    targetPos: [0, 1.2, 0],
  },
  {
    id: "walls",
    label: "Estrutura & Varanda",
    phrase: "Modelando a estrutura de jacarandá nobre e a varanda colonial...",
    durationMs: 3200,
    cameraPos: [7.2, 5.8, 13.8],
    targetPos: [0, 1.6, 0],
  },
  {
    id: "roof",
    label: "Telhado de Cerâmica",
    phrase: "Assentando as telhas artesanais e acendendo os lampiões de latão...",
    durationMs: 3400,
    cameraPos: [5.6, 6.5, 11.8],
    targetPos: [0, 2.2, 0],
  },
  {
    id: "facade_sign",
    label: "Placa em Ouro",
    phrase: "Entalhando o nome em madeira nobre e letras folheadas a ouro...",
    durationMs: 3000,
    cameraPos: [0, 3.4, 8.8],
    targetPos: [0, 2.5, 1.8],
  },
  {
    id: "orb_blessing",
    label: "Luz Interior & Orb",
    phrase: "Acendendo as luzes da casa e coroando com o Living Orb solar...",
    durationMs: 3800,
    cameraPos: [0, 6.0, 14.0],
    targetPos: [0, 2.6, 0],
  },
  {
    id: "dive_in",
    label: "Mergulho de Gala",
    phrase: "Aproximando da varanda iluminada e inaugurando o espaço...",
    durationMs: 2500,
    cameraPos: [0, 1.9, 0.6],
    targetPos: [0, 1.9, -3.8],
  },
  {
    id: "completed",
    label: "Exposição Inaugurada",
    phrase: "Diorama Dark Luxury inaugurado no ecossistema Caraíva Digital!",
    durationMs: 0,
    cameraPos: [0, 4.2, 11.2],
    targetPos: [0, 2.0, 0],
  },
];

// Placa de Madeira Nobre com Entalhe em Ouro
function createDioramaSignTexture(businessName: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Madeira Escura de Jacarandá da Bahia
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#190e06");
    grad.addColorStop(0.3, "#28160a");
    grad.addColorStop(0.7, "#1c0f07");
    grad.addColorStop(1, "#120803");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Veios da madeira
    ctx.save();
    ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      const y = (i * canvas.height) / 40;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(
        256,
        y + Math.sin(i * 0.7) * 14,
        768,
        y - Math.cos(i * 0.5) * 16,
        canvas.width,
        y + Math.sin(i * 1.1) * 10
      );
      ctx.strokeStyle = i % 2 === 0 ? "rgba(10, 5, 2, 0.6)" : "rgba(65, 35, 16, 0.35)";
      ctx.stroke();
    }
    ctx.restore();

    // Moldura chanfrada com filete de ouro polido
    const pad = 24;
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(10, 5, 2, 0.95)";
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(246, 201, 69, 0.75)";
    ctx.strokeRect(pad + 10, pad + 10, canvas.width - (pad + 10) * 2, canvas.height - (pad + 10) * 2);

    // Parafusos de latão dourado
    const corners = [
      [pad + 22, pad + 22],
      [canvas.width - pad - 22, pad + 22],
      [pad + 22, canvas.height - pad - 22],
      [canvas.width - pad - 22, canvas.height - pad - 22],
    ];
    corners.forEach(([cx, cy]) => {
      const boltGrad = ctx.createRadialGradient(cx - 2, cy - 2, 2, cx, cy, 10);
      boltGrad.addColorStop(0, "#FFF3B0");
      boltGrad.addColorStop(0.7, "#F6C945");
      boltGrad.addColorStop(1, "#78350F");
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = boltGrad;
      ctx.fill();
    });

    // Cabeçalho
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 26px 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "rgba(246, 201, 69, 0.9)";
    ctx.letterSpacing = "6px";
    ctx.fillText("• CARAÍVA • BAHIA •", canvas.width / 2, pad + 55);

    // Nome do Negócio
    const displayName = (businessName || "Casario Colonial").toUpperCase();
    const fontSize = displayName.length > 22 ? 44 : displayName.length > 15 ? 52 : 62;
    ctx.font = `900 ${fontSize}px 'Playfair Display', 'Cinzel', Georgia, serif`;
    ctx.letterSpacing = "4px";

    ctx.fillStyle = "#0A0502";
    ctx.fillText(displayName, canvas.width / 2 + 2, canvas.height / 2 + 4);

    const goldGrad = ctx.createLinearGradient(0, canvas.height / 2 - 35, 0, canvas.height / 2 + 35);
    goldGrad.addColorStop(0, "#FFFBEB");
    goldGrad.addColorStop(0.3, "#F6C945");
    goldGrad.addColorStop(0.7, "#D97706");
    goldGrad.addColorStop(1, "#92400E");
    ctx.fillStyle = goldGrad;
    ctx.fillText(displayName, canvas.width / 2, canvas.height / 2);

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.strokeText(displayName, canvas.width / 2, canvas.height / 2);

    // Rodapé
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillStyle = "rgba(255, 244, 237, 0.7)";
    ctx.fillText("ECOSSISTEMA DIGITAL & TAPTABLE", canvas.width / 2, canvas.height - pad - 45);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// Criação do Diorama Dark Luxury: Pedestal Preto de Galeria + Maquete
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

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isDiving, setIsDiving] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<"director" | "free">("director");

  const audioCtxRef = useRef<AudioContext | null>(null);

  const reqIdRef = useRef<number>(0);
  const stageStartTimeRef = useRef<number>(performance.now());
  const stageIndexRef = useRef<number>(0);
  const speedRef = useRef<number>(1);
  const isMutedRef = useRef<boolean>(true);
  const isPausedRef = useRef<boolean>(false);
  const cameraModeRef = useRef<"director" | "free">("director");

  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitAngleRef = useRef<{ theta: 0; phi: number }>({ theta: 0, phi: 0 });

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

  const playSensorySound = useCallback((type: "thud" | "wood" | "blessing" | "whoosh" | "chime") => {
    if (isMutedRef.current) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        gain.gain.setValueAtTime(0.2, now);
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
          gain.gain.setValueAtTime(0.18, now + idx * 0.08);
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
      // Audio autoplay policy guard
    }
  }, []);

  const themeColor = customColor || CARAIVA_CATEGORY_COLORS[category] || "#F59E0B";

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 540;

    // 1. Galeria Noturna Dark Luxury (Câmara Escura)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07080a);
    scene.fog = new THREE.FogExp2(0x07080a, 0.022);

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 8.5, 17.0);
    camera.lookAt(0, 1.2, 0);

    // 3. Renderer de Alta Performance e Pós-Processamento ACES
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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Iluminação Dramática de Museu / Galeria (Museum Pin-Spots)
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.35);
    scene.add(ambientLight);

    // Spot 1: Foco Principal Esquerdo (3200K Quente)
    const spotLeft = new THREE.SpotLight(0xfff0d4, 4.2, 35, 0.42, 0.75, 1.5);
    spotLeft.position.set(-8, 16, 9);
    spotLeft.target.position.set(0, 1.5, 0);
    spotLeft.castShadow = true;
    spotLeft.shadow.mapSize.width = 1024;
    spotLeft.shadow.mapSize.height = 1024;
    spotLeft.shadow.bias = -0.0005;
    scene.add(spotLeft);
    scene.add(spotLeft.target);

    // Spot 2: Foco de Contorno Direito (Dourado Suave)
    const spotRight = new THREE.SpotLight(0xffdfa0, 3.8, 35, 0.45, 0.75, 1.5);
    spotRight.position.set(8, 16, 8);
    spotRight.target.position.set(0, 1.5, 0);
    spotRight.castShadow = true;
    spotRight.shadow.mapSize.width = 1024;
    spotRight.shadow.mapSize.height = 1024;
    spotRight.shadow.bias = -0.0005;
    scene.add(spotRight);
    scene.add(spotRight.target);

    // Rim light traseira sutil azul meia-noite
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(0, 12, -14);
    scene.add(rimLight);

    // Cones Volumétricos de Luz de Galeria (Efeito feixe de luz descendo do teto)
    const coneGeo = new THREE.CylinderGeometry(0.2, 4.8, 18, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xffebd0,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const coneMeshLeft = new THREE.Mesh(coneGeo, coneMat);
    coneMeshLeft.position.set(-4, 9, 4.5);
    coneMeshLeft.rotation.z = 0.35;
    scene.add(coneMeshLeft);

    const coneMeshRight = new THREE.Mesh(coneGeo, coneMat);
    coneMeshRight.position.set(4, 9, 4.0);
    coneMeshRight.rotation.z = -0.35;
    scene.add(coneMeshRight);

    // --- GRUPO 1: PEDESTAL PRETO OBSIDIANA & ILHA DE AREIA ---
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    // Pedestal monolítico de museu (Plinth)
    const plinthW = 12.0;
    const plinthD = 9.5;
    const plinthH = 1.6;
    const plinthGeo = new THREE.BoxGeometry(plinthW, plinthH, plinthD);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x121518, // Preto obsidiana acetinado
      roughness: 0.45,
      metalness: 0.65,
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = -plinthH / 2;
    plinthMesh.receiveShadow = true;
    pedestalGroup.add(plinthMesh);

    // Filete chanfrado de latão dourado escovado no topo do pedestal
    const trimGeo = new THREE.BoxGeometry(plinthW + 0.08, 0.04, plinthD + 0.08);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf6c945,
      metalness: 0.95,
      roughness: 0.25,
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = 0.01;
    pedestalGroup.add(trimMesh);

    // Ilha de areia de Caraíva em relevo suave sobre o pedestal
    const sandGeo = new THREE.BoxGeometry(plinthW - 0.4, 0.18, plinthD - 0.4);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xd9b384, // Areia dourada quente de Caraíva
      roughness: 0.95,
      metalness: 0.02,
    });
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.y = 0.1;
    sandMesh.receiveShadow = true;
    pedestalGroup.add(sandMesh);

    // Caminho de pedras rústicas de basalto até a varanda
    const stonesGroup = new THREE.Group();
    pedestalGroup.add(stonesGroup);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3d3835, roughness: 0.9 });
    for (let i = 0; i < 7; i++) {
      const stoneGeo = new THREE.BoxGeometry(0.85, 0.06, 0.45);
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(0, 0.2, 1.2 + i * 0.55);
      stone.rotation.y = (Math.random() - 0.5) * 0.15;
      stone.receiveShadow = true;
      stonesGroup.add(stone);
    }

    // Vegetação tropical de restinga e bromélias em miniatura ao redor da maquete
    const vegGroup = new THREE.Group();
    pedestalGroup.add(vegGroup);
    const vegMat = new THREE.MeshStandardMaterial({ color: 0x27592f, roughness: 0.75 });
    const leafGeo = new THREE.ConeGeometry(0.12, 0.65, 5);
    for (let b = 0; b < 16; b++) {
      const angle = (b / 16) * Math.PI * 2;
      const rx = (plinthW / 2 - 0.7) * Math.cos(angle);
      const rz = (plinthD / 2 - 0.7) * Math.sin(angle);
      const plantGroup = new THREE.Group();
      plantGroup.position.set(rx, 0.2, rz);
      for (let l = 0; l < 6; l++) {
        const leaf = new THREE.Mesh(leafGeo, vegMat);
        leaf.rotation.z = 0.5 + Math.random() * 0.3;
        leaf.rotation.y = (l / 6) * Math.PI * 2;
        plantGroup.add(leaf);
      }
      vegGroup.add(plantGroup);
    }

    // Partículas de poeira dourada flutuando sob os spots de museu
    const dustCount = 140;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 1] = 0.5 + Math.random() * 7;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffdf8e,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // --- GRUPO 2: CASARIO COLONIAL DE COLECIONADOR & VARANDA ---
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);

    const houseW = 5.2;
    const houseH = 3.0;
    const houseD = 4.0;
    const verandaD = 1.6;

    // Paredes de cal branca rústica
    const wallGeo = new THREE.BoxGeometry(houseW, houseH, houseD);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfaf6ee,
      roughness: 0.88,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, houseH / 2 + 0.2, -verandaD / 2);
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    houseGroup.add(wallMesh);

    // Deck de madeira de jacarandá da varanda frontal
    const deckGeo = new THREE.BoxGeometry(houseW + 0.4, 0.16, verandaD + 0.3);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x3d2111,
      roughness: 0.85,
    });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(0, 0.28, (houseD / 2 - verandaD / 2) + 0.1);
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    houseGroup.add(deckMesh);

    // Degraus da varanda
    const stairGeo = new THREE.BoxGeometry(1.6, 0.12, 0.4);
    const stair = new THREE.Mesh(stairGeo, deckMat);
    stair.position.set(0, 0.2, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.35);
    stair.receiveShadow = true;
    houseGroup.add(stair);

    // Pilares torneados de jacarandá da varanda
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x361c0d, roughness: 0.75 });
    const pillarGeo = new THREE.BoxGeometry(0.14, houseH, 0.14);
    const pillarXCoords = [-houseW / 2 + 0.2, -houseW / 6, houseW / 6, houseW / 2 - 0.2];
    pillarXCoords.forEach((px) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, houseH / 2 + 0.28, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.1);
      p.castShadow = true;
      houseGroup.add(p);
    });

    // Parapeito / Guarda-corpo artesanal de madeira na varanda
    const railMat = new THREE.MeshStandardMaterial({ color: 0x442412, roughness: 0.85 });
    const topRailGeo = new THREE.BoxGeometry((houseW / 2) - 0.8, 0.08, 0.08);

    const railLeft = new THREE.Mesh(topRailGeo, railMat);
    railLeft.position.set(-houseW / 3.4, 0.85, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.1);
    houseGroup.add(railLeft);

    const railRight = new THREE.Mesh(topRailGeo, railMat);
    railRight.position.set(houseW / 3.4, 0.85, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.1);
    houseGroup.add(railRight);

    // Rede artesanal pendurada na varanda
    const hammockGeo = new THREE.TorusGeometry(0.9, 0.06, 8, 24, Math.PI);
    const hammockMat = new THREE.MeshStandardMaterial({ color: 0xe2d7c5, roughness: 0.95 });
    const hammock = new THREE.Mesh(hammockGeo, hammockMat);
    hammock.rotation.x = Math.PI / 2;
    hammock.position.set(-1.4, 1.0, 0.8);
    houseGroup.add(hammock);

    // Janelas coloniais iluminadas por dentro (Glow âmbar acolhedor)
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(themeColor),
      roughness: 0.5,
      metalness: 0.1,
    });
    const windowGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffa034, // Luz âmbar quente de querosene acesa no interior
    });

    const winCoords = [-1.6, 1.6];
    winCoords.forEach((wx) => {
      const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.12), windowFrameMat);
      wFrame.position.set(wx, 1.8, houseD / 2 - verandaD / 2 + 0.06);
      houseGroup.add(wFrame);

      const wGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.9), windowGlowMat);
      wGlow.position.set(wx, 1.8, houseD / 2 - verandaD / 2 + 0.13);
      houseGroup.add(wGlow);
    });

    // Porta frontal aberta revelando a luz acolhedora
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.3, 0.14), windowFrameMat);
    doorFrame.position.set(0, 1.35, houseD / 2 - verandaD / 2 + 0.06);
    houseGroup.add(doorFrame);

    const doorInteriorGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.1), windowGlowMat);
    doorInteriorGlow.position.set(0, 1.35, houseD / 2 - verandaD / 2 + 0.13);
    houseGroup.add(doorInteriorGlow);

    // Luz interna real que se projeta para a varanda
    const interiorLight = new THREE.PointLight(0xffa83b, 2.4, 9, 1.6);
    interiorLight.position.set(0, 1.6, 0.4);
    scene.add(interiorLight);

    // Lampiões de latão dourado pendurados na cumeeira da varanda
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf6c945, metalness: 0.9, roughness: 0.25 });
    const lanternLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.18, 8), brassMat);
    lanternLeft.position.set(-1.8, 2.8, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.1);
    houseGroup.add(lanternLeft);

    const lanternRight = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.18, 8), brassMat);
    lanternRight.position.set(1.8, 2.8, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.1);
    houseGroup.add(lanternRight);

    // --- GRUPO 3: TELHADO COLONIAL EM CERÂMICA REAL ---
    const roofGroup = new THREE.Group();
    scene.add(roofGroup);

    const roofW = houseW + 0.8;
    const roofD = houseD + verandaD + 0.4;
    const roofH = 1.8;
    const slopeAngle = 0.54;

    // Duas águas de terracota artesanal
    const roofSlopeGeo = new THREE.BoxGeometry(roofW / 2 + 0.4, 0.14, roofD);
    const roofSlopeMat = new THREE.MeshStandardMaterial({
      color: 0xa83b16, // Terracota cerâmica de colecionador
      roughness: 0.82,
      metalness: 0.05,
    });

    const leftSlope = new THREE.Mesh(roofSlopeGeo, roofSlopeMat);
    leftSlope.position.set(-roofW / 4 + 0.06, houseH + roofH / 2 + 0.2, 0);
    leftSlope.rotation.z = slopeAngle;
    leftSlope.castShadow = true;
    leftSlope.receiveShadow = true;
    roofGroup.add(leftSlope);

    const rightSlope = new THREE.Mesh(roofSlopeGeo, roofSlopeMat);
    rightSlope.position.set(roofW / 4 - 0.06, houseH + roofH / 2 + 0.2, 0);
    rightSlope.rotation.z = -slopeAngle;
    rightSlope.castShadow = true;
    rightSlope.receiveShadow = true;
    roofGroup.add(rightSlope);

    // Cumeeira de barro no cume
    const ridgeGeo = new THREE.CylinderGeometry(0.12, 0.12, roofD + 0.2, 9);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.85 });
    const ridgeMesh = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridgeMesh.rotation.x = Math.PI / 2;
    ridgeMesh.position.set(0, houseH + roofH + 0.25, 0);
    ridgeMesh.castShadow = true;
    roofGroup.add(ridgeMesh);

    // Empena frontal triangular
    const pedimentShape = new THREE.Shape();
    pedimentShape.moveTo(-houseW / 2, 0);
    pedimentShape.lineTo(0, roofH);
    pedimentShape.lineTo(houseW / 2, 0);
    pedimentShape.closePath();
    const pedimentFront = new THREE.Mesh(new THREE.ShapeGeometry(pedimentShape), wallMat);
    pedimentFront.position.set(0, houseH + 0.2, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.08);
    roofGroup.add(pedimentFront);

    // --- GRUPO 4: PLACA DE MADEIRA COM ENTALHE FOLHEADO A OURO ---
    const signGroup = new THREE.Group();
    scene.add(signGroup);

    const woodTexture = createDioramaSignTexture(businessName);
    const signGeo = new THREE.BoxGeometry(2.5, 1.25, 0.08);
    const signMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x180d05, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x180d05, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x180d05, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x180d05, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: woodTexture, roughness: 0.55, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x180d05, roughness: 0.9 }),
    ];
    const signMesh = new THREE.Mesh(signGeo, signMaterials);
    signMesh.castShadow = true;
    signGroup.add(signMesh);

    // Correntes de ferro fundido sustentando a placa
    const chainMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.85 });
    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6);
    const chainLeft = new THREE.Mesh(chainGeo, chainMat);
    chainLeft.position.set(-0.9, 0.75, 0);
    signGroup.add(chainLeft);

    const chainRight = new THREE.Mesh(chainGeo, chainMat);
    chainRight.position.set(0.9, 0.75, 0);
    signGroup.add(chainRight);

    const signFinalPos = new THREE.Vector3(0, 3.5, (houseD / 2 - verandaD / 2) + verandaD / 2 + 0.25);
    signGroup.position.copy(signFinalPos);

    // Spot focal dedicado para a placa
    const plaqueSpot = new THREE.SpotLight(0xfff3d6, 2.5, 12, 0.35, 0.8);
    plaqueSpot.position.set(0, 5.5, signFinalPos.z + 3.2);
    plaqueSpot.target.position.copy(signFinalPos);
    scene.add(plaqueSpot);
    scene.add(plaqueSpot.target);

    // --- GRUPO 5: CARAÍVA LIVING ORB CELESTIAL & ENXAME SOLAR ---
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    const orbCoreGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const orbCoreMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      emissive: 0xf6c945,
      emissiveIntensity: 3.2,
      roughness: 0.1,
      metalness: 0.95,
    });
    const orbCore = new THREE.Mesh(orbCoreGeo, orbCoreMat);
    orbGroup.add(orbCore);

    // 160 partículas douradas de stardust
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.0 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd97d,
      size: 0.14,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particlePoints);

    // Anel de choque dourado (Shockwave)
    const ringGeo = new THREE.RingGeometry(0.4, 0.9, 48);
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

    // Luz pontual do Orb
    const orbPointLight = new THREE.PointLight(0xf6c945, 0, 24);
    scene.add(orbPointLight);

    // Posicionamento inicial para animação procedural:
    pedestalGroup.position.y = -4.0; // Pedestal sobe da escuridão
    houseGroup.scale.set(1, 0.001, 1);
    roofGroup.position.y = 12; // Telhado desce dos céus
    signGroup.scale.set(0.001, 0.001, 0.001);
    orbGroup.position.set(0, 16, 0);
    orbGroup.scale.set(0.001, 0.001, 0.001);

    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easeOutBack = (x: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    const currentCamTarget = new THREE.Vector3(0, 8.5, 17.0);
    const lookTarget = new THREE.Vector3(0, 1.2, 0);

    let stageSoundPlayed = -1;

    // Loop de Renderização do Diorama
    const animate = (time: number) => {
      reqIdRef.current = requestAnimationFrame(animate);

      // Tremor suave e acolhedor da luz interior
      const flicker = 2.2 + Math.sin(time * 0.01) * 0.2 + Math.sin(time * 0.024) * 0.1;
      interiorLight.intensity = flicker;

      // Poeira estelar flutuando sob a luz da galeria
      dustPoints.rotation.y = time * 0.00015;

      const activeIdx = stageIndexRef.current;
      const currentStage = STAGES[activeIdx];
      const elapsed = time - stageStartTimeRef.current;
      const duration = currentStage.durationMs / speedRef.current;

      let t = duration > 0 ? Math.min(elapsed / duration, 1) : 1;

      if (stageSoundPlayed !== activeIdx) {
        stageSoundPlayed = activeIdx;
        if (currentStage.id === "sand") playSensorySound("thud");
        else if (currentStage.id === "walls") playSensorySound("wood");
        else if (currentStage.id === "roof") playSensorySound("chime");
        else if (currentStage.id === "facade_sign") playSensorySound("wood");
        else if (currentStage.id === "orb_blessing") playSensorySound("blessing");
        else if (currentStage.id === "dive_in") playSensorySound("whoosh");
      }

      // 1. ESTÁGIO 'sand': Pedestal sobe da escuridão e se estabiliza
      if (activeIdx === 0) {
        const py = THREE.MathUtils.lerp(-4.0, 0, easeOutCubic(t));
        pedestalGroup.position.y = py;
      } else {
        pedestalGroup.position.y = 0;
      }

      // 2. ESTÁGIO 'walls': Varanda de jacarandá e paredes sobem
      if (activeIdx >= 1) {
        if (activeIdx === 1) {
          const sy = easeOutCubic(t);
          houseGroup.scale.set(1, Math.max(sy, 0.001), 1);
        } else {
          houseGroup.scale.set(1, 1, 1);
        }
      }

      // 3. ESTÁGIO 'roof': Telhado de cerâmica desce e acopla com elegância
      if (activeIdx >= 2) {
        if (activeIdx === 2) {
          const py = THREE.MathUtils.lerp(10, 0, easeOutBack(t));
          roofGroup.position.y = py;
        } else {
          roofGroup.position.y = 0;
        }
      }

      // 4. ESTÁGIO 'facade_sign': Placa em madeira e ouro surge com oscilação
      if (activeIdx >= 3) {
        if (activeIdx === 3) {
          const s = easeOutBack(t);
          signGroup.scale.set(s, s, s);
          signGroup.rotation.x = Math.sin(time * 0.006) * 0.08 * (1 - t);
        } else {
          signGroup.scale.set(1, 1, 1);
          signGroup.rotation.x = 0;
        }
      }

      // 5. ESTÁGIO 'orb_blessing': Living Orb celestial abençoa a cumeeira
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

          if (t > 0.45) {
            const shockT = (t - 0.45) / 0.55;
            const shockScale = THREE.MathUtils.lerp(0.8, 15.0, easeOutCubic(shockT));
            shockwaveRing.position.set(0, 0.25, 0);
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

      // 6. ESTÁGIO 'dive_in': Câmera aproxima da varanda acolhedora
      const targetCam = new THREE.Vector3(...currentStage.cameraPos);
      const targetLook = new THREE.Vector3(...currentStage.targetPos);

      if (activeIdx === 5) {
        targetCam.z = THREE.MathUtils.lerp(8.8, 0.6, easeOutCubic(t));
        targetCam.y = THREE.MathUtils.lerp(3.4, 1.9, easeOutCubic(t));
      }

      // Rotação Manual 360° no Modo Livre
      if (cameraModeRef.current === "free") {
        const radius = 13.5;
        const theta = orbitAngleRef.current.theta;
        const phi = Math.max(0.2, Math.min(Math.PI / 2.2, orbitAngleRef.current.phi));
        targetCam.x = radius * Math.sin(phi) * Math.sin(theta);
        targetCam.y = radius * Math.cos(phi) + 1.2;
        targetCam.z = radius * Math.sin(phi) * Math.cos(theta);
        targetLook.set(0, 1.8, 0);
      }

      currentCamTarget.lerp(targetCam, 0.045);
      lookTarget.lerp(targetLook, 0.045);

      camera.position.copy(currentCamTarget);
      camera.lookAt(lookTarget);

      const totalStages = STAGES.length - 1;
      const overallPercent = Math.min(
        Math.round(((activeIdx + t) / totalStages) * 100),
        100
      );
      setStageProgress(overallPercent);

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

    // Eventos de Órbita Interativa 360° (Mouse e Touch)
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
      id="caraiva-world-builder-card"
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border bg-[#07080a] shadow-2xl ${className}`}
      style={{
        borderColor: "rgba(246, 201, 69, 0.3)",
        boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.98), 0 0 60px -10px rgba(246, 201, 69, 0.22)",
      }}
    >
      {/* Canvas Three.js Diorama */}
      <div
        ref={mountRef}
        className="w-full h-[450px] sm:h-[530px] md:h-[570px] cursor-grab active:cursor-grabbing select-none"
        title="Clique e arraste para explorar a maquete em 360°"
      />

      {/* Dica de interação 360° no canto inferior do canvas */}
      <div
        className="absolute top-20 right-4 pointer-events-none hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono backdrop-blur-md z-10"
        style={{
          backgroundColor: "rgba(18, 21, 24, 0.85)",
          borderColor: "rgba(246, 201, 69, 0.25)",
          color: "rgba(255, 244, 237, 0.85)",
        }}
      >
        <Compass className="w-3.5 h-3.5 text-[#F6C945]" />
        <span>Arraste para girar em 360°</span>
      </div>

      {/* Vinheta Dark Luxury Superior com Nome do Negócio & Controles */}
      <div
        className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-[#07080a]/95 via-[#07080a]/75 to-transparent flex items-center justify-between pointer-events-none z-20"
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
              <span>CARAÍVA DIORAMA DARK LUXURY</span>
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
              backgroundColor: cameraMode === "free" ? "rgba(246, 201, 69, 0.25)" : "rgba(20, 23, 26, 0.9)",
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
                backgroundColor: "rgba(20, 23, 26, 0.9)",
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
              backgroundColor: "rgba(20, 23, 26, 0.9)",
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
              backgroundColor: "rgba(20, 23, 26, 0.9)",
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
          isDiving ? "opacity-35" : "opacity-0"
        }`}
      />

      {/* Painel Inferior: Barra de Progresso Dourada, Marcadores e Frase Sensorial */}
      <div
        className="absolute bottom-0 inset-x-0 p-4 sm:p-5 backdrop-blur-md border-t z-20"
        style={{
          backgroundColor: "rgba(10, 12, 15, 0.96)",
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
              boxShadow: "0 0 14px rgba(246, 201, 69, 0.55)",
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
                <span>Rever Maquete</span>
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
              <span>{stageProgress}% ESCULPIDO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
