import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Eye, Compass, Waves, Church, Navigation, Sparkles } from "lucide-react";
import type { LiveMapEngineProps, LiveMapPoint } from "../../../services/maps/liveMapModel";
import { CARAIVA_CENTER_COORDS } from "../../../services/maps/types";
import { createCaraivaTerrain } from "./engine/TerrainMesh";
import { createWaterShaderMaterial } from "./engine/WaterShaderMaterial";
import { buildColonialHouse } from "./engine/ColonialBuildingFactory";
import { buildHistoricalChurch } from "./engine/HistoricalChurchModel";
import { buildNavigationTrail, latLngToWorld } from "./engine/NavigationTrailMesh";
import "./cartoon-map.css";

// Mapeamento das coordenadas 2D do Guia para o Espaço 3D de Caraíva
function toWorldCoords(point: LiveMapPoint): { x: number; z: number } {
  const b = point.business;
  if (b.coordinates && typeof b.coordinates.x === "number" && typeof b.coordinates.y === "number") {
    const x = (b.coordinates.x - 50) * 1.6;
    const z = (b.coordinates.y - 50) * 2.1;
    return { x, z };
  }
  const x = (point.position.lng - CARAIVA_CENTER_COORDS.lng) * 20000;
  const z = (point.position.lat - CARAIVA_CENTER_COORDS.lat) * -22000;
  return { x, z };
}

export default function CaraivaCartoon3DMap(props: LiveMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Shaders de Água (Rio e Mar)
  const riverMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const oceanMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const crossingBoatRef = useRef<THREE.Group | null>(null);

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

  // 1. INICIALIZAÇÃO DA CENA THREE.JS COM MODULARIDADE DO ENGINE
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Cena com atmosfera Dark Luxury Baiana de entardecer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e1726); // Céu crepuscular tropical
    scene.fog = new THREE.FogExp2(0x101b2b, 0.005);

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

    // OrbitControls com limites ergonômicos
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.08; // Impede visualização abaixo da areia
    controls.minDistance = 15;
    controls.maxDistance = 190;
    controls.target.set(0, 0, 0);

    // ILUMINAÇÃO SENSORIAL TROPICAL
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf6c945, 1.5);
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

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0xf6c945, 0.5);
    scene.add(hemiLight);

    // 1. TERRENO E BECOS (Modularizado via TerrainMesh.ts)
    const { sandMesh, pathsGroup, foamMesh } = createCaraivaTerrain();
    scene.add(sandMesh);
    scene.add(pathsGroup);
    scene.add(foamMesh);

    // 2. RIO CARAÍVA COM CUSTOM SHADER (Kelvin Wake Simulation)
    const riverGeo = new THREE.PlaneGeometry(75, 260, 96, 96);
    const riverMat = createWaterShaderMaterial(false);
    riverMaterialRef.current = riverMat;
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.position.set(-68, -0.2, 0);
    scene.add(riverMesh);

    // Trapiche / Píer Rústico
    const pierGeo = new THREE.BoxGeometry(14, 0.6, 3.5);
    const pierMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
    const pierMesh = new THREE.Mesh(pierGeo, pierMat);
    pierMesh.position.set(-36, 0.4, -18);
    pierMesh.castShadow = true;
    pierMesh.receiveShadow = true;
    scene.add(pierMesh);

    // Canoas Coloridas de Caraíva Atracadas na Margem
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
    createCanoe(-34, -24, 0.3, 0xef4444);
    createCanoe(-35, -12, -0.2, 0xf6c945);
    createCanoe(-33, 5, 0.45, 0x0284c7);

    // CANOA DA TRAVESSIA DO RIO CARAÍVA (VIVA COM FÍSICA DE ESTEIRA/WAKE)
    const crossingBoat = new THREE.Group();
    // Casco tradicional de cedro naval
    const crossingHullGeo = new THREE.CylinderGeometry(0.82, 0.62, 5.2, 8);
    const crossingHullMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.65 });
    const crossingHull = new THREE.Mesh(crossingHullGeo, crossingHullMat);
    crossingHull.rotation.z = Math.PI / 2;
    crossingHull.scale.set(0.62, 1, 1.35);
    crossingHull.castShadow = true;
    crossingBoat.add(crossingHull);

    // Faixa amarela e terracota baiana
    const crossingStripeGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.4, 8);
    const crossingStripeMat = new THREE.MeshStandardMaterial({ color: 0xf6c945, roughness: 0.4 });
    const crossingStripe = new THREE.Mesh(crossingStripeGeo, crossingStripeMat);
    crossingStripe.rotation.z = Math.PI / 2;
    crossingStripe.scale.set(0.63, 1, 1.36);
    crossingBoat.add(crossingStripe);

    // Bancos de madeira para passageiros
    [-1.2, 0, 1.2].forEach((bx) => {
      const benchGeo = new THREE.BoxGeometry(0.2, 0.08, 1.05);
      const benchMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.85 });
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(bx, 0.2, 0);
      crossingBoat.add(bench);
    });

    // Lampião acolhedor na proa com luz quente
    const lampGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.28, 6);
    const lampMat = new THREE.MeshStandardMaterial({ 
      color: 0xfef08a, 
      emissive: 0xf59e0b, 
      emissiveIntensity: 0.9 
    });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(2.35, 0.42, 0);
    crossingBoat.add(lamp);

    const lampLight = new THREE.PointLight(0xf59e0b, 0.75, 8);
    lampLight.position.set(2.35, 0.55, 0);
    crossingBoat.add(lampLight);

    // Silhueta do Barqueiro nativo
    const boatman = new THREE.Group();
    const torsoGeo = new THREE.CylinderGeometry(0.2, 0.26, 0.65, 6);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.52, 0);
    boatman.add(torso);

    const hatGeo = new THREE.ConeGeometry(0.5, 0.16, 8);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 0.98, 0);
    boatman.add(hat);

    const oarGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 4);
    const oarMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const oar = new THREE.Mesh(oarGeo, oarMat);
    oar.position.set(0.3, 0.4, 0.55);
    oar.rotation.x = 0.52;
    oar.rotation.z = -0.3;
    boatman.add(oar);

    boatman.position.set(-1.4, 0, 0);
    crossingBoat.add(boatman);

    crossingBoat.position.set(-84, 0.25, -18);
    scene.add(crossingBoat);
    crossingBoatRef.current = crossingBoat;

    // 3. OCEANO ATLÂNTICO COM CUSTOM SHADER
    const oceanGeo = new THREE.PlaneGeometry(90, 260, 48, 48);
    const oceanMat = createWaterShaderMaterial(true);
    oceanMaterialRef.current = oceanMat;
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.set(82, -0.3, 0);
    scene.add(oceanMesh);

    // 4. VEGETAÇÃO TROPICAL (Coqueiros & Amendoeiras)
    const natureGroup = new THREE.Group();
    const createPalmTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.85 });
      let currY = 0;
      let currX = 0;
      for (let s = 0; s < 5; s++) {
        const segGeo = new THREE.CylinderGeometry(0.35 * (1 - s * 0.08), 0.45 * (1 - s * 0.08), 1.6, 6);
        const segMesh = new THREE.Mesh(segGeo, trunkMat);
        currX += Math.sin(s * 0.3) * 0.2;
        segMesh.position.set(currX, currY + 0.8, 0);
        segMesh.rotation.z = -Math.sin(s * 0.3) * 0.15;
        segMesh.castShadow = true;
        tree.add(segMesh);
        currY += 1.5;
      }
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      for (let l = 0; l < 7; l++) {
        const leafAngle = (l / 7) * Math.PI * 2;
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
      tree.position.set(x, 0, z);
      tree.scale.set(scale, scale, scale);
      natureGroup.add(tree);
    };

    const palmPositions: [number, number, number][] = [
      [-36, -65, 1.2], [-35, -45, 1.0], [-33, -15, 1.3], [-32, 25, 1.1], [-35, 60, 1.2],
      [38, -60, 1.1], [40, -35, 1.3], [42, 5, 1.2], [41, 40, 1.0], [39, 70, 1.2],
      [-10, -50, 0.9], [12, -30, 1.1], [-5, 35, 1.0], [22, 10, 0.9], [0, 80, 1.3]
    ];
    palmPositions.forEach(([px, pz, pScale]) => createPalmTree(px, pz, pScale));

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
    createAlmondTree(5, -8, 4.2);
    createAlmondTree(25, -22, 3.8);
    createAlmondTree(-12, 45, 3.5);

    scene.add(natureGroup);

    // Adiciona grupos dinâmicos na cena
    scene.add(markersGroupRef.current);
    scene.add(routeGroupRef.current);
    scene.add(avatarGroupRef.current);

    // 5. LOOP DE ANIMAÇÃO 60 FPS COM SHADER TIME UNIFORM
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Atualiza uniformes dos shaders GLSL de água
      if (riverMaterialRef.current?.uniforms?.uTime) {
        riverMaterialRef.current.uniforms.uTime.value = elapsedTime;
      }
      if (oceanMaterialRef.current?.uniforms?.uTime) {
        oceanMaterialRef.current.uniforms.uTime.value = elapsedTime;
      }

      // Física da Canoa da Travessia e Wake Shader Kelvin
      const crossingBoat = crossingBoatRef.current;
      if (crossingBoat && riverMaterialRef.current?.uniforms) {
        const cyclePeriod = 26; // Ciclo de 26 segundos de travessia
        const cycleProgress = (elapsedTime % cyclePeriod) / cyclePeriod;
        
        let targetX = -84;
        let boatSpeed = 0;
        let boatHeadingX = 1;

        if (cycleProgress < 0.38) {
          // Travessia: Continente -> Píer de Caraíva
          const p = cycleProgress / 0.38;
          const smoothP = p * p * (3 - 2 * p);
          targetX = -84 + smoothP * 46; // de -84 a -38
          boatSpeed = Math.sin(p * Math.PI) * 1.7;
          boatHeadingX = 1;
          crossingBoat.rotation.y = 0;
        } else if (cycleProgress < 0.50) {
          // Desembarque no Píer de Caraíva
          targetX = -38;
          boatSpeed = 0;
          boatHeadingX = 1;
        } else if (cycleProgress < 0.88) {
          // Travessia: Píer de Caraíva -> Continente
          const p = (cycleProgress - 0.50) / 0.38;
          const smoothP = p * p * (3 - 2 * p);
          targetX = -38 - smoothP * 46; // de -38 a -84
          boatSpeed = Math.sin(p * Math.PI) * 1.7;
          boatHeadingX = -1;
          crossingBoat.rotation.y = Math.PI;
        } else {
          // Embarque no Continente
          targetX = -84;
          boatSpeed = 0;
          boatHeadingX = -1;
        }

        const bob = Math.sin(elapsedTime * 2.8) * 0.05;
        const roll = Math.sin(elapsedTime * 2.2) * 0.03;
        const pitch = Math.sin(elapsedTime * 1.8) * 0.02;

        crossingBoat.position.set(targetX, 0.25 + bob, -18);
        crossingBoat.rotation.z = roll;
        crossingBoat.rotation.x = pitch;

        // Injeção de Telemetria no Shader de Água
        if (riverMaterialRef.current.uniforms.uBoatPos) {
          riverMaterialRef.current.uniforms.uBoatPos.value.set(targetX, 0, -18);
        }
        if (riverMaterialRef.current.uniforms.uBoatDir) {
          riverMaterialRef.current.uniforms.uBoatDir.value.set(boatHeadingX, 0);
        }
        if (riverMaterialRef.current.uniforms.uBoatSpeed) {
          riverMaterialRef.current.uniforms.uBoatSpeed.value = boatSpeed;
        }
      }

      // Ondulação suave da espuma
      foamMesh.position.x = 44 + Math.sin(elapsedTime * 1.2) * 0.6;

      // Animação de flutuação dos marcadores (Bobbing)
      markersGroupRef.current.children.forEach((child, index) => {
        child.position.y = 6.4 + Math.sin(elapsedTime * 2.5 + index * 0.6) * 0.45;
      });

      // Animação do Avatar ao longo do trajeto
      if (avatarGroupRef.current.children.length > 0) {
        avatarGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 8)) * 0.35;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    callbacksRef.current.onReady();

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

  // 2. CONSTRUÇÃO MODULAR DAS CASINHAS E PONTOS HISTÓRICOS
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

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

      let houseContainer: THREE.Group;

      if (b.id === "igreja-sao-sebastiao" || b.category === "pontos") {
        houseContainer = buildHistoricalChurch(point, isSelected);
      } else {
        houseContainer = buildColonialHouse(point, isSelected);
      }

      houseContainer.position.set(x, 0, z);
      interactiveHousesRef.current.set(houseContainer, point);
      housesGroup.add(houseContainer);
    });

    scene.add(housesGroup);

    return () => {
      scene.remove(housesGroup);
    };
  }, [props.points, props.selectedId]);

  // 3. ROTA PEDONAL ILUMINADA & AVATAR VIA NavigationTrailMesh.ts
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    while (routeGroupRef.current.children.length > 0) {
      routeGroupRef.current.remove(routeGroupRef.current.children[0]);
    }
    while (avatarGroupRef.current.children.length > 0) {
      avatarGroupRef.current.remove(avatarGroupRef.current.children[0]);
    }

    const routeCoords = props.activeRouteCoordinates;
    if (!routeCoords || routeCoords.length < 2) return;

    const { routeGroup, avatarGroup, startPoint } = buildNavigationTrail(routeCoords);
    
    // Adiciona os nós na cena
    routeGroupRef.current.add(routeGroup);
    avatarGroupRef.current.add(avatarGroup);

    // Ajusta a câmera caso seja POV do trajeto
    if (startPoint && cameraRef.current && controlsRef.current) {
      controlsRef.current.target.set(startPoint.x, 1.5, startPoint.z);
      cameraRef.current.position.set(startPoint.x, 6, startPoint.z + 14);
    }
  }, [props.activeRouteCoordinates]);

  // 4. RAYCASTER DE INTERAÇÃO ERGONÔMICA
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
          if (controlsRef.current) {
            const targetPos = hitObj.position;
            controlsRef.current.target.set(targetPos.x, 2, targetPos.z);
          }
        }
      }
    }
  }, []);

  // 5. PRESETS CINEMATOGRÁFICOS DE CÂMERA
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
        camera.position.set(-48, 16, 8);
        controls.target.set(-61, 1, -18);
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

  // Suporte a comandos externos do LiveMap
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
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090B0C]" data-lenis-prevent="true">
      {/* CANVAS THREE.JS CONTAINER */}
      <div
        ref={containerRef}
        data-lenis-prevent="true"
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* BARRA SUPERIOR DE PONTOS DE VISTA (PRESETS 3D) - DARK LUXURY */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-[#141719]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl max-w-[94vw] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => applyPreset("geral")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activePreset === "geral"
              ? "bg-[#F6C945] text-[#090B0C] shadow-md font-bold"
              : "text-[#FFF4ED]/80 hover:text-[#FFF4ED] hover:bg-white/5"
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
              ? "bg-[#F6C945] text-[#090B0C] shadow-md font-bold"
              : "text-[#FFF4ED]/80 hover:text-[#FFF4ED] hover:bg-white/5"
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
              ? "bg-[#F6C945] text-[#090B0C] shadow-md font-bold"
              : "text-[#FFF4ED]/80 hover:text-[#FFF4ED] hover:bg-white/5"
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
              ? "bg-[#F6C945] text-[#090B0C] shadow-md font-bold"
              : "text-[#FFF4ED]/80 hover:text-[#FFF4ED] hover:bg-white/5"
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
              ? "bg-emerald-400 text-[#090B0C] shadow-md font-bold"
              : "text-[#FFF4ED]/80 hover:text-[#FFF4ED] hover:bg-white/5"
          }`}
          title="Visão pedestre dentro da vila de Caraíva"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>POV Na Areia</span>
        </button>
      </div>

      {/* BADGE DE CARTOON 3D NO CANTO */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090B0C]/85 backdrop-blur-md border border-white/10 text-[#FFF4ED]/90 text-[11px] shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-[#F6C945] animate-pulse" />
        <span>Vila Cartoon 3D · Toque numa casinha para explorar</span>
      </div>

      {/* INDICADOR SE ROTA ATIVA ESTIVER RENDERIZANDO */}
      {props.activeRouteCoordinates && props.activeRouteCoordinates.length > 0 && (
        <div className="absolute top-16 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700/90 text-[#FFF4ED] text-xs font-bold shadow-xl border border-emerald-400/30 animate-in fade-in duration-300">
          <Navigation className="w-3.5 h-3.5 animate-bounce" />
          <span>Rota 3D na Areia Ativa</span>
        </div>
      )}
    </div>
  );
}
