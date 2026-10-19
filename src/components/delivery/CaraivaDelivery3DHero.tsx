import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Sparkles,
  Rotate3d,
  Flame,
  ShieldCheck,
  ArrowUpRight,
  Clock,
} from "lucide-react";

export interface CaraivaDelivery3DHeroProps {
  activeCategory: string;
  activeTabColor: string;
  selectedZoneName: string;
  selectedZoneEta: string;
  onOrderFeatured: () => void;
  onOpenTracker: () => void;
}

const CATEGORY_3D_THEMES: Record<
  string,
  {
    title: string;
    subtitle: string;
    badge: string;
    priceLabel: string;
    brothColor: string;
    rimColor: string;
    accentHex: string;
  }
> = {
  todos: {
    title: "Moqueca Real de Camarão no Barro",
    subtitle: "Culinária Central • Dendê artesanal, leite de coco fresco & banana da terra",
    badge: "DESTAQUE ESPACIAL 3D • ENTREGA GRÁTIS",
    priceLabel: "R$ 168,00",
    brothColor: "#ea580c",
    rimColor: "#F6C945",
    accentHex: "#EA1D2C",
  },
  moquecas: {
    title: "Moqueca de Camarão & Polvo na Brasa",
    subtitle: "Panela de barro curada mantendo 85°C até a portaria da sua pousada",
    badge: "PANELA TÉRMICA LACRADA • 22 MIN",
    priceLabel: "R$ 168,00",
    brothColor: "#ea580c",
    rimColor: "#FF7043",
    accentHex: "#FF7043",
  },
  petiscos: {
    title: "Combo Pastéis de Arraia & Camarão",
    subtitle: "Boteco do Pará • Receita patrimônio da Beira-Rio crocante na hora",
    badge: "MAIS PEDIDO NA PRAIA • 15 MIN",
    priceLabel: "R$ 68,00",
    brothColor: "#d97706",
    rimColor: "#F59E0B",
    accentHex: "#F59E0B",
  },
  pizzas: {
    title: "Pizza Napolitana Burrata & Pesto",
    subtitle: "Forneria Estrela do Mar • Fermentação natural 48h em forno a lenha",
    badge: "FORNO A LENHA • MASSA AERADA",
    priceLabel: "R$ 112,00",
    brothColor: "#dc2626",
    rimColor: "#EF4444",
    accentHex: "#EF4444",
  },
  acai: {
    title: "Bowl Açaí Puro do Pará & Mel de Cacau",
    subtitle: "Cacau Caraíva • Embalagem térmica ultra-fria com granola artesanal",
    badge: "ENTREGA TÉRMICA 12 MIN",
    priceLabel: "R$ 42,00",
    brothColor: "#581c87",
    rimColor: "#A855F7",
    accentHex: "#A855F7",
  },
  bebidas: {
    title: "Kit Sunset Drinks Cacau & Maracujá",
    subtitle: "Adega Beira-Rio 24h • Gin botânico, espuma cítrica e gelo de água de coco",
    badge: "TRINCANDO EM 10 MIN",
    priceLabel: "R$ 64,00",
    brothColor: "#059669",
    rimColor: "#22C55E",
    accentHex: "#22C55E",
  },
  vegetariano: {
    title: "Moqueca Vegana de Palmito & Banana",
    subtitle: "Cantinho da Duca • 100% orgânico com farofa crocante de coco queimado",
    badge: "COZINHA AFETIVA VEG • ORGÂNICO",
    priceLabel: "R$ 118,00",
    brothColor: "#10b981",
    rimColor: "#10B981",
    accentHex: "#10B981",
  },
};

export const CaraivaDelivery3DHero: React.FC<CaraivaDelivery3DHeroProps> = ({
  activeCategory,
  activeTabColor,
  selectedZoneName,
  selectedZoneEta,
  onOrderFeatured,
  onOpenTracker,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglFallback, setWebglFallback] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const theme = CATEGORY_3D_THEMES[activeCategory] ?? CATEGORY_3D_THEMES.todos;

  // Refs para atualização dinâmica de cores sem recriar o contexto WebGL
  const brothMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const wakeUpRenderRef = useRef<((durationMs?: number) => void) | null>(null);

  useEffect(() => {
    if (brothMatRef.current) {
      brothMatRef.current.color.set(theme.brothColor);
      brothMatRef.current.emissive.set(theme.brothColor);
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.set(activeTabColor || theme.rimColor);
    }
    if (ringMatRef.current) {
      ringMatRef.current.color.set(theme.rimColor);
    }
    wakeUpRenderRef.current?.(2200);
  }, [activeCategory, activeTabColor, theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let isVisible = true;
    let activeUntil = performance.now() + 3500; // Renderiza suavemente nos primeiros 3.5s e hiberna

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
      textures: THREE.Texture[];
    } = {
      geometries: [],
      materials: [],
      textures: [],
    };

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposables.materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      disposables.textures.push(t);
      return t;
    };

    try {
      const width = container.clientWidth || 380;
      const height = container.clientHeight || 280;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
      camera.position.set(0, 3.1, 6.2);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 5;
      controls.maxPolarAngle = Math.PI / 2.25;
      controls.target.set(0, 0.35, 0);

      // Iluminação de Estúdio Apple VisionOS / Dark Luxury
      const hemiLight = new THREE.HemisphereLight("#FFF4ED", "#090B0C", 1.9);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight("#FFD9A1", 3.2);
      keyLight.position.set(4, 7, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0002;
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight("#38BDF8", 1.1);
      fillLight.position.set(-5, 3, -3);
      scene.add(fillLight);

      const rimLight = new THREE.PointLight(theme.rimColor, 6, 9, 1.8);
      rimLight.position.set(0, 2.2, -2.5);
      scene.add(rimLight);
      rimLightRef.current = rimLight;

      // Grupo Principal do Prato 3D
      const dishGroup = new THREE.Group();
      scene.add(dishGroup);

      // 1. Pedestal Monolítico de Obsidiana & Ouro Escovado
      const baseGeo = trackGeo(new THREE.CylinderGeometry(2.15, 2.35, 0.24, 48));
      const baseMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#121619",
          roughness: 0.2,
          metalness: 0.75,
          clearcoat: 0.9,
          clearcoatRoughness: 0.15,
        })
      );
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -0.55;
      baseMesh.receiveShadow = true;
      dishGroup.add(baseMesh);

      // Anel Dourado Chanfrado no Pedestal
      const goldRingGeo = trackGeo(new THREE.TorusGeometry(2.22, 0.035, 16, 64));
      const goldRingMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#F6C945",
          emissive: "#F59E0B",
          emissiveIntensity: 0.22,
          roughness: 0.15,
          metalness: 0.92,
          clearcoat: 1.0,
        })
      );
      const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
      goldRing.rotation.x = Math.PI / 2;
      goldRing.position.y = -0.44;
      dishGroup.add(goldRing);

      // 2. Panela de Barro Artesanal de Caraíva (Corpo + Borda + Alças)
      const potOuterGeo = trackGeo(new THREE.CylinderGeometry(1.55, 1.15, 0.78, 44));
      const clayMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#3E1F14",
          roughness: 0.42,
          metalness: 0.12,
          clearcoat: 0.35,
          clearcoatRoughness: 0.4,
        })
      );
      const potMesh = new THREE.Mesh(potOuterGeo, clayMat);
      potMesh.position.y = 0.02;
      potMesh.castShadow = true;
      potMesh.receiveShadow = true;
      dishGroup.add(potMesh);

      const potRimGeo = trackGeo(new THREE.TorusGeometry(1.52, 0.11, 20, 48));
      const potRim = new THREE.Mesh(potRimGeo, clayMat);
      potRim.rotation.x = Math.PI / 2;
      potRim.position.y = 0.4;
      potRim.castShadow = true;
      dishGroup.add(potRim);

      // Alças Laterais da Panela de Barro
      const handleGeo = trackGeo(new THREE.TorusGeometry(0.28, 0.075, 14, 24, Math.PI));
      const leftHandle = new THREE.Mesh(handleGeo, clayMat);
      leftHandle.position.set(-1.55, 0.25, 0);
      leftHandle.rotation.z = Math.PI / 2;
      leftHandle.rotation.y = Math.PI / 4;
      dishGroup.add(leftHandle);

      const rightHandle = new THREE.Mesh(handleGeo, clayMat);
      rightHandle.position.set(1.55, 0.25, 0);
      rightHandle.rotation.z = -Math.PI / 2;
      rightHandle.rotation.y = -Math.PI / 4;
      dishGroup.add(rightHandle);

      // 3. Caldo Borbulhante de Dendê / Recheio Principal
      const brothGeo = trackGeo(new THREE.CylinderGeometry(1.42, 1.35, 0.12, 40));
      const brothMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: theme.brothColor,
          emissive: theme.brothColor,
          emissiveIntensity: 0.28,
          roughness: 0.12,
          metalness: 0.1,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08,
        })
      );
      brothMatRef.current = brothMat;
      const brothMesh = new THREE.Mesh(brothGeo, brothMat);
      brothMesh.position.y = 0.36;
      dishGroup.add(brothMesh);

      // 4. Ingredientes Esculpidos em 3D (Camarões / Rodelas de Banana da Terra / Ervas)
      const garnishGroup = new THREE.Group();
      garnishGroup.position.y = 0.43;
      dishGroup.add(garnishGroup);

      const prawnMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#FF785A",
          emissive: "#EA1D2C",
          emissiveIntensity: 0.12,
          roughness: 0.25,
          clearcoat: 0.85,
        })
      );
      const plantainMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#F6C945",
          emissive: "#D97706",
          emissiveIntensity: 0.15,
          roughness: 0.3,
          clearcoat: 0.6,
        })
      );
      const herbMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: "#22C55E",
          roughness: 0.4,
        })
      );

      const prawnGeo = trackGeo(new THREE.TorusGeometry(0.22, 0.085, 14, 24, Math.PI * 1.35));
      const plantainGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.09, 20));
      const herbGeo = trackGeo(new THREE.DodecahedronGeometry(0.09, 0));

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.68;

        const prawn = new THREE.Mesh(prawnGeo, prawnMat);
        prawn.position.set(Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius);
        prawn.rotation.set(Math.PI / 2.3, angle, 0.3);
        prawn.castShadow = true;
        garnishGroup.add(prawn);

        const plantain = new THREE.Mesh(plantainGeo, plantainMat);
        const pAngle = angle + Math.PI / 5;
        plantain.position.set(
          Math.cos(pAngle) * (radius * 0.95),
          0.02,
          Math.sin(pAngle) * (radius * 0.95)
        );
        plantain.rotation.set(0.2, pAngle, 0.15);
        plantain.castShadow = true;
        garnishGroup.add(plantain);
      }

      // Centro com Coentro Fresco e Pimenta Biquinho
      for (let i = 0; i < 7; i++) {
        const herb = new THREE.Mesh(herbGeo, herbMat);
        const r = i === 0 ? 0 : 0.24;
        const a = (i / 6) * Math.PI * 2;
        herb.position.set(Math.cos(a) * r, 0.08, Math.sin(a) * r);
        herb.scale.set(1.2, 0.5, 0.9);
        garnishGroup.add(herb);
      }

      // 5. Anel Orbital Holográfico de Telemetria
      const orbitRingGeo = trackGeo(new THREE.RingGeometry(2.55, 2.59, 64));
      const orbitRingMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: theme.rimColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        })
      );
      ringMatRef.current = orbitRingMat;
      const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
      orbitRing.rotation.x = Math.PI / 2;
      orbitRing.position.y = -0.35;
      dishGroup.add(orbitRing);

      // 6. Partículas de Vapor Quente & Especiarias Douradas
      const particleCount = 42;
      const positions = new Float32Array(particleCount * 3);
      const phases = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const r = Math.random() * 1.15;
        const theta = Math.random() * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = 0.45 + Math.random() * 1.6;
        positions[i * 3 + 2] = Math.sin(theta) * r;
        phases[i] = Math.random() * Math.PI * 2;
      }

      const steamGeo = trackGeo(new THREE.BufferGeometry());
      steamGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = 64;
      dotCanvas.height = 64;
      const ctx = dotCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
        grad.addColorStop(0, "rgba(255, 244, 237, 0.95)");
        grad.addColorStop(0.5, "rgba(246, 201, 69, 0.45)");
        grad.addColorStop(1, "rgba(246, 201, 69, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const dotTex = trackTex(new THREE.CanvasTexture(dotCanvas));

      const steamMat = trackMat(
        new THREE.PointsMaterial({
          size: 0.28,
          map: dotTex,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      const steamPoints = new THREE.Points(steamGeo, steamMat);
      dishGroup.add(steamPoints);

      // Funções de Renderização Sob Demanda (Dirty-Flag + Burst)
      const wakeUpRender = (durationMs = 2000) => {
        const nextTarget = performance.now() + durationMs;
        if (nextTarget > activeUntil) {
          activeUntil = nextTarget;
        }
        if (frameId === 0 && isVisible && !document.hidden) {
          frameId = requestAnimationFrame(animate);
        }
      };
      wakeUpRenderRef.current = wakeUpRender;

      const onControlStart = () => {
        setIsInteracting(true);
        wakeUpRender(4000);
      };
      const onControlChange = () => {
        wakeUpRender(1200);
      };
      const onControlEnd = () => {
        setIsInteracting(false);
        wakeUpRender(1800);
      };

      controls.addEventListener("start", onControlStart);
      controls.addEventListener("change", onControlChange);
      controls.addEventListener("end", onControlEnd);

      const animate = (now: number) => {
        frameId = 0;
        if (!renderer || !isVisible || document.hidden) return;

        const t = now * 0.001;
        dishGroup.rotation.y += 0.0045;
        garnishGroup.position.y = 0.43 + Math.sin(t * 2.4) * 0.015;

        // Anima vapor subindo suavemente
        const posAttr = steamGeo.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          let y = posAttr.getY(i) + 0.008;
          if (y > 2.1) y = 0.45;
          posAttr.setY(i, y);
          posAttr.setX(i, posAttr.getX(i) + Math.sin(t * 1.5 + phases[i]) * 0.0015);
        }
        posAttr.needsUpdate = true;

        controls.update();
        renderer.render(scene, camera);

        if (now < activeUntil) {
          frameId = requestAnimationFrame(animate);
        }
      };

      // Context Lost & Restored Handlers
      const canvasEl = renderer.domElement;
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
        setWebglFallback(true);
      };
      const handleContextRestored = () => {
        setWebglFallback(false);
        wakeUpRender(2500);
      };
      canvasEl.addEventListener("webglcontextlost", handleContextLost, false);
      canvasEl.addEventListener("webglcontextrestored", handleContextRestored, false);

      // Resize & Visibility Observers
      const resizeObserver = new ResizeObserver(() => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 380;
        const h = container.clientHeight || 280;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        wakeUpRender(800);
      });
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
          if (isVisible) wakeUpRender(1500);
        },
        { threshold: 0.05 }
      );
      intersectionObserver.observe(container);

      const handleVisibility = () => {
        if (!document.hidden && isVisible) {
          wakeUpRender(1500);
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);

      // Dispara render inicial
      frameId = requestAnimationFrame(animate);

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        controls.removeEventListener("start", onControlStart);
        controls.removeEventListener("change", onControlChange);
        controls.removeEventListener("end", onControlEnd);
        controls.dispose();

        disposables.geometries.forEach((g) => g.dispose());
        disposables.materials.forEach((m) => m.dispose());
        disposables.textures.forEach((t) => t.dispose());
        scene.clear();

        if (renderer) {
          canvasEl.removeEventListener("webglcontextlost", handleContextLost);
          canvasEl.removeEventListener("webglcontextrestored", handleContextRestored);
          renderer.dispose();
          renderer.forceContextLoss();
          canvasEl.remove();
        }
      };
    } catch {
      setWebglFallback(true);
      return undefined;
    }
  }, []);

  return (
    <section
      aria-label="Vitrine Espacial 3D Caraíva Delivery"
      className="relative overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-br from-[#141719] via-[#0D1013] to-[#090B0C] p-5 sm:p-7 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)]"
    >
      {/* Ambient Radial Highlight synced with active tab/category */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: theme.rimColor }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-15 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: activeTabColor }}
      />

      <div className="relative z-10 grid items-center gap-6 lg:grid-cols-12">
        {/* Left Column: Apple/Google Spatial Typography & Actions */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F6C945]/35 bg-[#F6C945]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[#F6C945] uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {theme.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75">
              <Clock className="h-3 w-3 text-emerald-400" />
              {selectedZoneName} • {selectedZoneEta}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl lg:leading-[1.12]">
            {theme.title}
          </h1>

          <p className="max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
            {theme.subtitle}. Acompanhe o preparo no KDS em tempo real e receba com código de segurança de 4 dígitos.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onOrderFeatured}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#EA1D2C] px-5 py-3 text-xs font-extrabold text-white shadow-lg shadow-[#EA1D2C]/30 transition hover:bg-[#d81927] active:scale-[0.99] sm:text-sm"
            >
              <Flame className="h-4 w-4" />
              <span>Pedir Agora • {theme.priceLabel}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={onOpenTracker}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:border-[#F6C945]/50 hover:bg-white/[0.08] sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Rastrear Pedido ao Vivo</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Three.js 3D Culinary Viewport */}
        <div className="relative lg:col-span-5">
          <div
            onMouseEnter={() => wakeUpRenderRef.current?.(2500)}
            onTouchStart={() => wakeUpRenderRef.current?.(3000)}
            className="relative h-64 w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-black/40 sm:h-72"
          >
            {webglFallback ? (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80"
                  alt={theme.title}
                  className="h-40 w-40 rounded-2xl object-cover shadow-lg"
                />
                <span className="mt-2 text-xs font-bold text-[#F6C945]">
                  {theme.title}
                </span>
              </div>
            ) : (
              <div
                ref={mountRef}
                className="h-full w-full cursor-grab active:cursor-grabbing"
                title="Arraste para girar o prato em 360°"
              />
            )}

            {/* Floating 360° Interactive Hint Pill */}
            <div className="pointer-events-none absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/65 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur-md">
              <span className="flex items-center gap-1.5 font-semibold">
                <Rotate3d
                  className={`h-3.5 w-3.5 text-[#F6C945] ${
                    isInteracting ? "animate-spin" : ""
                  }`}
                />
                Palco Three.js 360° Interativo
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-400">
                WebGL On-Demand
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
