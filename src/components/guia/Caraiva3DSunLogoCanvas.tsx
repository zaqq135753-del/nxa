import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Caraiva3DSunLogoCanvasProps {
  progress: number; // 0 a 100
  onCanvasReady?: () => void;
}

/**
 * CARAÍVA 3D CINEMATIC LOGO (ESTRELA SOLAR & ENCONTRO DAS ÁGUAS)
 * 
 * Fidelidade Absoluta com a Marca Oficial de Caraíva:
 * - O Sol de Caraíva em cúpula volumétrica pura (sem anéis esquisitos ou cilindros artificiais)
 * - Gradiente quente de ouro baiano (#FFF1B8 -> #F6C945 -> #C2410C)
 * - As duas curvas fluidas do Rio Caraíva e do Mar em escultura 3D com refração de água viva
 * - Iluminação volumétrica cinematográfica com halo solar (God Rays) e poeira solar dourada
 */
export const Caraiva3DSunLogoCanvas: React.FC<Caraiva3DSunLogoCanvasProps> = ({
  progress,
  onCanvasReady,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 340;

    // 1. CENA & CÂMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    container.appendChild(renderer.domElement);

    // 2. ILUMINAÇÃO CINEMATOGRÁFICA
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    // Luz principal do núcleo do sol
    const sunCoreLight = new THREE.PointLight(0xffd15c, 5.0, 20);
    sunCoreLight.position.set(0, 0.4, 2.5);
    scene.add(sunCoreLight);

    // Luz de borda azul/ciano do encontro das águas
    const rimLightRiver = new THREE.DirectionalLight(0x7ad3dd, 2.8);
    rimLightRiver.position.set(4, -3, 3);
    scene.add(rimLightRiver);

    // Luz de contra (ouro quente)
    const backGlow = new THREE.DirectionalLight(0xf59e0b, 2.2);
    backGlow.position.set(0, 4, -2);
    scene.add(backGlow);

    // 3. GRUPO PRINCIPAL DA LOGO
    const logoGroup = new THREE.Group();
    logoGroup.position.set(0, 0.25, 0);
    scene.add(logoGroup);

    // --- A. O SOL VOLUMÉTRICO AUTÊNTICO DE CARAÍVA ---
    // Forma exata: semi-círculo perfeito no topo com base reta no horizonte
    // Shape simétrico e elegante de -1.7 a 1.7 no X, altura 1.6
    const sunShape = new THREE.Shape();
    const sunRadius = 1.65;
    sunShape.moveTo(-sunRadius, 0);
    // Arco superior perfeito
    sunShape.absarc(0, 0, sunRadius, Math.PI, 0, true);
    sunShape.lineTo(-sunRadius, 0);

    const sunExtrudeSettings = {
      steps: 2,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.28,
      bevelSize: 0.22,
      bevelSegments: 20,
    };

    const sunGeom = new THREE.ExtrudeGeometry(sunShape, sunExtrudeSettings);
    sunGeom.center();
    // Reajustar centro para que a base do horizonte fique próxima do Y = -0.2
    sunGeom.translate(0, 0.35, 0);

    // Material de Ouro Solar com Verniz Líquido Nobre
    const sunMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf6c945),
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    logoGroup.add(sunMesh);

    // --- B. GLOW / CORONA VOLUMÉTRICA DO SOL (Aura Atmosférica) ---
    // Sprite suave de brilho no núcleo do sol (estilo cinema)
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, "rgba(255, 241, 184, 0.85)");
      gradient.addColorStop(0.35, "rgba(246, 201, 69, 0.45)");
      gradient.addColorStop(0.7, "rgba(245, 158, 11, 0.15)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const glowTexture = new THREE.CanvasTexture(canvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    });
    const sunGlowSprite = new THREE.Sprite(glowMat);
    sunGlowSprite.scale.set(5.2, 5.2, 1);
    sunGlowSprite.position.set(0, 0.6, -0.2);
    logoGroup.add(sunGlowSprite);

    // --- C. AS DUAS ONDAS DO RIO & MAR (Curvas Fluidas da Logo) ---
    // Onda 1: O Rio Caraíva (Curva elegante esmeralda/turquesa sobreposta ao horizonte)
    const waveCurve1 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-2.1, -0.15, 0.5),
      new THREE.Vector3(-0.6, 0.45, 0.65),
      new THREE.Vector3(0.6, -0.65, 0.55),
      new THREE.Vector3(2.1, -0.05, 0.5)
    );
    const waveGeom1 = new THREE.TubeGeometry(waveCurve1, 80, 0.16, 20, false);
    const waveMat1 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x38bdf8),
      emissive: new THREE.Color(0x0e7490),
      emissiveIntensity: 0.4,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.333,
      thickness: 0.6,
      clearcoat: 1.0,
    });
    const waveMesh1 = new THREE.Mesh(waveGeom1, waveMat1);
    logoGroup.add(waveMesh1);

    // Onda 2: O Mar (Curva de profundidade inferior)
    const waveCurve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.8, -0.55, 0.65),
      new THREE.Vector3(-0.4, -0.2, 0.75),
      new THREE.Vector3(0.8, -0.95, 0.65),
      new THREE.Vector3(1.8, -0.45, 0.65)
    );
    const waveGeom2 = new THREE.TubeGeometry(waveCurve2, 80, 0.13, 20, false);
    const waveMat2 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0f766e),
      emissive: new THREE.Color(0x042f2e),
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.65,
      ior: 1.333,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    const waveMesh2 = new THREE.Mesh(waveGeom2, waveMat2);
    logoGroup.add(waveMesh2);

    // --- D. POEIRA DOURADA & VAGALUMES DA BAHIA (Fótons Solares Flutuantes) ---
    const particlesCount = 45;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 1.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) + 0.3;
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0xffd15c,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    logoGroup.add(particleSystem);

    onCanvasReady?.();

    // 4. LOOP DE ANIMAÇÃO CINEMATOGRÁFICA
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentProgress = progressRef.current / 100;

      // O Sol emerge do horizonte conforme a barra de progresso enche
      const targetY = 0.15 + currentProgress * 0.15;
      const targetZ = (currentProgress - 1) * 2.5;
      sunMesh.position.y += (targetY - sunMesh.position.y) * 0.08;
      sunMesh.position.z += (targetZ - sunMesh.position.z) * 0.08;

      // Ondulação Orgânica do Rio e do Mar
      waveMesh1.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      waveMesh1.rotation.z = Math.sin(elapsedTime * 1.0) * 0.02;
      waveMesh2.position.y = Math.cos(elapsedTime * 1.3) * 0.035;

      // Respiração Luminosa do Sol
      const pulse = 4.5 + Math.sin(elapsedTime * 2.5) * 1.2;
      sunCoreLight.intensity = pulse * (0.5 + 0.5 * currentProgress);
      sunGlowSprite.scale.set(
        5.2 + Math.sin(elapsedTime * 2) * 0.4,
        5.2 + Math.sin(elapsedTime * 2) * 0.4,
        1
      );

      // Órbita sutil das partículas
      particleSystem.rotation.y = elapsedTime * 0.12;

      // Balanço giroscópico suave e premium
      logoGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.08;
      logoGroup.rotation.x = Math.cos(elapsedTime * 0.6) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 5. RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 380;
      const newHeight = container.clientHeight || 340;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // 6. CLEANUP GPU
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      sunGeom.dispose();
      sunMat.dispose();
      glowTexture.dispose();
      glowMat.dispose();
      waveGeom1.dispose();
      waveMat1.dispose();
      waveGeom2.dispose();
      waveMat2.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onCanvasReady]);

  return (
    <div
      ref={mountRef}
      className="relative w-72 h-64 sm:w-84 sm:h-72 mx-auto flex items-center justify-center pointer-events-none"
    />
  );
};

export default Caraiva3DSunLogoCanvas;
