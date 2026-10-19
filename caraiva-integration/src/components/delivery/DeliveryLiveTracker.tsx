import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CheckCircle2,
  ChefHat,
  Bike,
  MapPin,
  ShieldCheck,
  Star,
  MessageCircle,
  PhoneCall,
  Sparkles,
  FastForward,
  RotateCcw,
  Clock,
  Receipt,
  Rotate3d,
} from "lucide-react";
import type { ActiveDeliveryOrder, DeliveryOrderStatus } from "./delivery.types";
import { playRiderTacticalSound } from "../../services/riderDispatchService";

interface DeliveryLiveTrackerProps {
  order: ActiveDeliveryOrder;
  onUpdateStatus: (nextStatus: DeliveryOrderStatus, nextProgress: number) => void;
}

const STATUS_STEPS: {
  key: DeliveryOrderStatus;
  label: string;
  subtitle: string;
  progress: number;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    key: "CONFIRMED",
    label: "Confirmado",
    subtitle: "O restaurante recebeu seu pedido e validou o Pix.",
    progress: 18,
    icon: CheckCircle2,
  },
  {
    key: "PREPARING",
    label: "No Preparo",
    subtitle: "Chef preparando seu prato na bancada térmica.",
    progress: 48,
    icon: ChefHat,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "A Caminho",
    subtitle: "Entregador deslocando pelas trilhas de areia até você.",
    progress: 82,
    icon: Bike,
  },
  {
    key: "DELIVERED",
    label: "Entregue",
    subtitle: "Código de segurança validado na portaria da pousada.",
    progress: 100,
    icon: MapPin,
  },
];

export const DeliveryLiveTracker: React.FC<DeliveryLiveTrackerProps> = ({
  order,
  onUpdateStatus,
}) => {
  const [chatMessageSent, setChatMessageSent] = useState<string | null>(null);
  const mapMountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(order.courier.progressPct);
  const wakeUpMapRef = useRef<((ms?: number) => void) | null>(null);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const activeStep = STATUS_STEPS[currentStepIndex] ?? STATUS_STEPS[0];

  useEffect(() => {
    progressRef.current = order.courier.progressPct;
    wakeUpMapRef.current?.(2200);
  }, [order.courier.progressPct, order.status]);

  // Motor Three.js 3D para o Mapa Tático de Entrega na Areia
  useEffect(() => {
    const container = mapMountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let activeUntil = performance.now() + 3000;

    const disposables: {
      geometries: THREE.BufferGeometry[];
      materials: THREE.Material[];
    } = { geometries: [], materials: [] };

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposables.materials.push(m);
      return m;
    };

    try {
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 256;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#070B0E");
      scene.fog = new THREE.FogExp2("#070B0E", 0.055);

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
      camera.position.set(0, 5.2, 7.8);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 5;
      controls.maxPolarAngle = Math.PI / 2.4;
      controls.target.set(0, 0, 0);

      const hemiLight = new THREE.HemisphereLight("#FFF4ED", "#090B0C", 1.8);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight("#F6C945", 2.4);
      dirLight.position.set(5, 8, 4);
      scene.add(dirLight);

      // 1. Terreno Topográfico da Península de Areia (Caraíva)
      const sandGeo = trackGeo(new THREE.PlaneGeometry(14, 8, 40, 24));
      const pos = sandGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dune =
          Math.sin(x * 0.55) * 0.16 +
          Math.cos(y * 0.8) * 0.12 -
          (y > 1.6 ? 0.35 : 0);
        pos.setZ(i, dune);
      }
      sandGeo.computeVertexNormals();

      const sandMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: "#0F1316",
          roughness: 0.72,
          metalness: 0.2,
          wireframe: false,
        })
      );
      const sandMesh = new THREE.Mesh(sandGeo, sandMat);
      sandMesh.rotation.x = -Math.PI / 2;
      sandMesh.receiveShadow = true;
      scene.add(sandMesh);

      // 2. Rio Caraíva ao Fundo (Água Turquesa Translúcida de Caraíva)
      const riverGeo = trackGeo(new THREE.PlaneGeometry(14, 2.8, 32, 12));
      const riverMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#0284C7",
          emissive: "#0369A1",
          emissiveIntensity: 0.35,
          roughness: 0.08,
          metalness: 0.1,
          transmission: 0.65,
          ior: 1.33,
          clearcoat: 1.0,
        })
      );
      const riverMesh = new THREE.Mesh(riverGeo, riverMat);
      riverMesh.rotation.x = -Math.PI / 2;
      riverMesh.position.set(0, -0.12, -2.4);
      scene.add(riverMesh);

      // 3. Curva 3D da Trilha de Areia (Restaurante -> Pousada)
      const routeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.2, 0.22, 1.3),
        new THREE.Vector3(-1.8, 0.28, 0.2),
        new THREE.Vector3(0.4, 0.25, 0.85),
        new THREE.Vector3(2.3, 0.3, -0.35),
        new THREE.Vector3(4.1, 0.24, -0.6),
      ]);

      const fullTubeGeo = trackGeo(
        new THREE.TubeGeometry(routeCurve, 64, 0.065, 12, false)
      );
      const fullTubeMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: "#EA1D2C",
          emissive: "#EA1D2C",
          emissiveIntensity: 0.55,
          roughness: 0.25,
        })
      );
      const routeTube = new THREE.Mesh(fullTubeGeo, fullTubeMat);
      scene.add(routeTube);

      // Pino de Origem (Restaurante #EA1D2C)
      const originGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 24));
      const originMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: "#EA1D2C",
          emissive: "#EA1D2C",
          emissiveIntensity: 0.7,
        })
      );
      const originPin = new THREE.Mesh(originGeo, originMat);
      originPin.position.copy(routeCurve.getPointAt(0));
      scene.add(originPin);

      // Pino de Destino (Pousada #22C55E)
      const destGeo = trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24));
      const destMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: "#22C55E",
          emissive: "#22C55E",
          emissiveIntensity: 0.8,
        })
      );
      const destPin = new THREE.Mesh(destGeo, destMat);
      destPin.position.copy(routeCurve.getPointAt(1));
      scene.add(destPin);

      // 4. Entregador 3D Beacon (Esfera Dourada + Halo Pulsante)
      const courierGroup = new THREE.Group();
      const riderSphereGeo = trackGeo(new THREE.SphereGeometry(0.24, 24, 24));
      const riderSphereMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: "#F6C945",
          emissive: "#F59E0B",
          emissiveIntensity: 0.9,
          roughness: 0.1,
          clearcoat: 1,
        })
      );
      const riderSphere = new THREE.Mesh(riderSphereGeo, riderSphereMat);
      riderSphere.position.y = 0.16;
      courierGroup.add(riderSphere);

      const haloGeo = trackGeo(new THREE.RingGeometry(0.32, 0.48, 32));
      const haloMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: "#F6C945",
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        })
      );
      const haloRing = new THREE.Mesh(haloGeo, haloMat);
      haloRing.rotation.x = Math.PI / 2;
      haloRing.position.y = 0.04;
      courierGroup.add(haloRing);

      const riderLight = new THREE.PointLight("#F6C945", 4, 3.5);
      riderLight.position.y = 0.5;
      courierGroup.add(riderLight);

      scene.add(courierGroup);

      let displayedT = Math.max(0.05, Math.min(1, progressRef.current / 100));

      const wakeUpMap = (ms = 1800) => {
        const target = performance.now() + ms;
        if (target > activeUntil) activeUntil = target;
        if (frameId === 0 && !document.hidden) {
          frameId = requestAnimationFrame(animate);
        }
      };
      wakeUpMapRef.current = wakeUpMap;

      controls.addEventListener("change", () => wakeUpMap(1200));

      const animate = (now: number) => {
        frameId = 0;
        if (!renderer || document.hidden) return;

        const targetT = Math.max(0.05, Math.min(1, progressRef.current / 100));
        displayedT += (targetT - displayedT) * 0.08;

        const pt = routeCurve.getPointAt(displayedT);
        courierGroup.position.set(pt.x, pt.y, pt.z);

        const pulse = 1 + Math.sin(now * 0.006) * 0.18;
        haloRing.scale.set(pulse, pulse, 1);

        controls.update();
        renderer.render(scene, camera);

        if (now < activeUntil || Math.abs(targetT - displayedT) > 0.002) {
          frameId = requestAnimationFrame(animate);
        }
      };

      const resizeObs = new ResizeObserver(() => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 600;
        const h = container.clientHeight || 256;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        wakeUpMap(800);
      });
      resizeObs.observe(container);

      frameId = requestAnimationFrame(animate);

      return () => {
        if (frameId) cancelAnimationFrame(frameId);
        resizeObs.disconnect();
        controls.dispose();
        disposables.geometries.forEach((g) => g.dispose());
        disposables.materials.forEach((m) => m.dispose());
        scene.clear();
        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        }
      };
    } catch {
      return undefined;
    }
  }, []);

  const handleAdvanceStep = () => {
    const nextIdx = (currentStepIndex + 1) % STATUS_STEPS.length;
    const next = STATUS_STEPS[nextIdx];
    playRiderTacticalSound(next.key === "DELIVERED" ? "cash_register" : "geofence_ping");
    onUpdateStatus(next.key, next.progress);
  };

  const handleQuickMessage = (msg: string) => {
    setChatMessageSent(msg);
    setTimeout(() => setChatMessageSent(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Live Status Banner with Three.js 3D Tactical Route Map */}
      <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#141719] shadow-2xl">
        <div
          onMouseEnter={() => wakeUpMapRef.current?.(2000)}
          onTouchStart={() => wakeUpMapRef.current?.(2500)}
          className="relative h-64 w-full overflow-hidden bg-[#070B0E]"
        >
          <div
            ref={mapMountRef}
            className="h-full w-full cursor-grab active:cursor-grabbing"
            title="Arraste para orbitar o Mapa 3D da entrega em Caraíva"
          />

          {/* Top Left Order Badge */}
          <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <span className="text-[#F6C945]">#{order.orderId}</span>
            <span className="text-white/40">•</span>
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Previsão {order.zone.estimatedMinutes}</span>
          </div>

          {/* Interactive Step Simulator Button */}
          <button
            type="button"
            onClick={handleAdvanceStep}
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-[#F6C945]/50 bg-[#090B0C]/90 px-3.5 py-1.5 text-xs font-bold text-[#F6C945] shadow-lg backdrop-blur-md transition hover:bg-[#F6C945] hover:text-black"
          >
            {order.status === "DELIVERED" ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar Simulação 3D
              </>
            ) : (
              <>
                <FastForward className="h-3.5 w-3.5" />
                Avançar Etapa 3D
              </>
            )}
          </button>

          {/* Bottom Map Telemetry Overlay */}
          <div className="pointer-events-none absolute right-4 bottom-3 left-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/80">
            <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/70 px-3 py-1 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#EA1D2C]" />
              Origem: <strong className="text-white">{order.merchantName}</strong>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/70 px-3 py-1 backdrop-blur-md">
              <Rotate3d className="h-3.5 w-3.5 text-[#F6C945]" />
              <span>Rota 3D Interativa ({order.courier.progressPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/70 px-3 py-1 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Destino: <strong className="text-emerald-400">{order.pousadaOrAddress}</strong>
            </span>
          </div>
        </div>

        {/* 4-Stage iFood Progress Timeline */}
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#EA1D2C] uppercase">
                Telemetria em Tempo Real • Three.js Spatial Track
              </span>
              <h3 className="text-lg font-extrabold text-white">
                {activeStep.label} — {activeStep.subtitle}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => {
                    playRiderTacticalSound(
                      step.key === "DELIVERED" ? "cash_register" : "geofence_ping"
                    );
                    onUpdateStatus(step.key, step.progress);
                  }}
                  className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                    isCurrent
                      ? "border-[#EA1D2C] bg-[#EA1D2C]/15 shadow-lg shadow-[#EA1D2C]/15 ring-1 ring-[#EA1D2C]/30"
                      : isCompleted
                      ? "border-emerald-500/40 bg-emerald-500/10 shadow-sm"
                      : "border-white/[0.06] bg-[#090B0C]/60 opacity-60 hover:opacity-90"
                  }`}
                >
                  <div className="mb-2 flex w-full items-center justify-between">
                    <Icon
                      className={`h-4 w-4 ${
                        isCurrent
                          ? "text-[#EA1D2C]"
                          : isCompleted
                          ? "text-emerald-400"
                          : "text-white/40"
                      }`}
                    />
                    <span className="font-mono text-[10px] font-bold text-white/45">
                      0{index + 1}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">{step.label}</span>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCurrent
                          ? "w-full bg-[#EA1D2C]"
                          : isCompleted
                          ? "w-full bg-emerald-400"
                          : "w-0"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security PIN + Courier Telemetry Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* iFood 4-Digit Confirmation Code Card */}
        <div className="flex flex-col justify-between rounded-[28px] border border-[#F6C945]/30 bg-gradient-to-br from-[#141719] to-[#090B0C] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6C945]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#F6C945] uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                Código de Entrega iFood Caraíva
              </span>
              <h4 className="mt-2 text-sm font-bold text-white">
                Informe este código ao entregador
              </h4>
              <p className="mt-0.5 text-xs text-white/60">
                Garante que seu pedido lacrado seja entregue em mãos na sua pousada.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#090B0C] px-4 py-3">
            <span className="text-xs font-semibold text-white/60">PIN de 4 dígitos:</span>
            <div className="flex gap-2">
              {order.confirmationPin.split("").map((digit, i) => (
                <span
                  key={i}
                  className="flex h-10 w-9 items-center justify-center rounded-xl border border-[#F6C945]/50 bg-[#F6C945]/10 font-mono text-lg font-black text-[#F6C945]"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Courier Telemetry Card */}
        <div className="flex flex-col justify-between rounded-[28px] border border-white/10 bg-[#141719] p-5">
          <div className="flex items-center gap-3.5">
            <img
              src={order.courier.avatar}
              alt={order.courier.name}
              className="h-14 w-14 rounded-2xl border border-[#F6C945]/50 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold text-white">
                  {order.courier.name}
                </span>
                <span className="flex items-center gap-0.5 rounded-md bg-[#F6C945]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#F6C945]">
                  <Star className="h-3 w-3 fill-[#F6C945]" />
                  {order.courier.rating}
                </span>
              </div>
              <p className="text-xs text-emerald-400">{order.courier.modal}</p>
              <p className="truncate text-[11px] text-white/50">
                Ref: {order.referencePoint}
              </p>
            </div>
          </div>

          {chatMessageSent ? (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
              ✓ Mensagem enviada ao entregador: &ldquo;{chatMessageSent}&rdquo;
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickMessage("Estou aguardando na portaria da pousada!")
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs font-semibold text-white transition hover:border-[#F6C945]/40"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#F6C945]" />
                &ldquo;Estou na portaria&rdquo;
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickMessage("Pode deixar na recepção da pousada, obrigado!")
                }
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#090B0C] px-3 py-2 text-xs font-semibold text-white transition hover:border-emerald-400/40"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                Avisar Recepção
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Receipt Summary */}
      <div className="rounded-[28px] border border-white/10 bg-[#141719] p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={order.merchantLogo}
              alt={order.merchantName}
              className="h-9 w-9 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{order.merchantName}</h4>
              <p className="text-[11px] text-white/50">
                Pedido #{order.orderId} • {order.createdAt}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
            <Receipt className="h-4 w-4" />
            R$ {order.total.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {order.items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between text-xs text-white/80"
            >
              <span>
                <strong className="text-white">{item.quantity}x</strong>{" "}
                {item.menuItem.name}
              </span>
              <span className="font-semibold">
                R$ {item.lineTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-[11px] text-white/60">
          <Sparkles className="h-3.5 w-3.5 text-[#F6C945]" />
          Integrado ao KDS TapTable & Frota Nativa de Caraíva em tempo real.
        </div>
      </div>
    </div>
  );
};
