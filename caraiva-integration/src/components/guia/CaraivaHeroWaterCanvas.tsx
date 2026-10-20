import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createWaterShaderMaterial } from "./live-map/engine/WaterShaderMaterial";

export interface CaraivaHeroWaterCanvasProps {
  isLight?: boolean;
}

/**
 * Camada 3D WebGL ao Vivo no Hero da Home:
 * - Superfície do Rio Caraíva com Shader GLSL de Equação de Onda de Kelvin (United Carriers Style)
 * - Canoa da Travessia navegando suavemente com lampião aceso e esteira de espuma dourada
 * - Interatividade com o Mouse/Toque: passar o cursor na água também gera rastro físico
 */
export const CaraivaHeroWaterCanvas: React.FC<CaraivaHeroWaterCanvasProps> = ({
  isLight = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();

    // Câmera angulada rasante sobre as águas do Rio Caraíva
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.5, 300);
    camera.position.set(0, 14, 34);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Iluminação Dourada de Fim de Tarde em Caraíva
    const ambientLight = new THREE.AmbientLight(0xffedd5, isLight ? 1.3 : 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf6c945, 1.8);
    sunLight.position.set(35, 50, 20);
    scene.add(sunLight);

    // Superfície do Rio Caraíva com alta densidade poligonal para o Wake Shader
    const riverGeo = new THREE.PlaneGeometry(110, 65, 128, 96);
    const riverMat = createWaterShaderMaterial(false);
    if (isLight && riverMat.uniforms) {
      riverMat.uniforms.uWaterColor.value.setHex(0x0d9488);
      riverMat.uniforms.uShallowColor.value.setHex(0x2dd4bf);
    }
    const riverMesh = new THREE.Mesh(riverGeo, riverMat);
    riverMesh.rotation.x = -Math.PI / 2;
    riverMesh.position.set(0, -1.5, 0);
    scene.add(riverMesh);

    // Construção da Canoa da Travessia de Caraíva
    const boatGroup = new THREE.Group();

    const hullGeo = new THREE.CylinderGeometry(0.75, 0.55, 5.4, 10);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.55,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.z = Math.PI / 2;
    hull.scale.set(0.6, 1, 1.35);
    boatGroup.add(hull);

    // Faixa artesanal dourada e terracota
    const stripeGeo = new THREE.CylinderGeometry(0.77, 0.77, 0.45, 10);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xf6c945,
      roughness: 0.35,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.z = Math.PI / 2;
    stripe.scale.set(0.61, 1, 1.36);
    boatGroup.add(stripe);

    // Bancos internos de madeira
    [-1.3, 0, 1.3].forEach((bx) => {
      const benchGeo = new THREE.BoxGeometry(0.22, 0.08, 1.0);
      const benchMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(bx, 0.18, 0);
      boatGroup.add(bench);
    });

    // Lampião aceso na proa
    const lampGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.position.set(2.45, 0.45, 0);
    boatGroup.add(lamp);

    const lampLight = new THREE.PointLight(0xf6c945, 2.2, 14);
    lampLight.position.set(2.45, 0.65, 0);
    boatGroup.add(lampLight);

    // Barqueiro Nativo com Chapéu de Palha e Remo
    const boatman = new THREE.Group();
    const torsoGeo = new THREE.CylinderGeometry(0.2, 0.26, 0.7, 8);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.55, 0);
    boatman.add(torso);

    const hatGeo = new THREE.ConeGeometry(0.52, 0.18, 10);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 1.0, 0);
    boatman.add(hat);

    const oarGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.1, 6);
    const oarMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const oar = new THREE.Mesh(oarGeo, oarMat);
    oar.position.set(0.25, 0.35, 0.65);
    oar.rotation.x = 0.55;
    oar.rotation.z = -0.25;
    boatman.add(oar);

    boatman.position.set(-1.5, 0, 0);
    boatGroup.add(boatman);

    boatGroup.position.set(-22, -1.1, 4);
    boatGroup.scale.set(1.25, 1.25, 1.25);
    scene.add(boatGroup);

    // Interação de Mouse sobre o Hero para perturbar a água
    let pointerInfluence = 0;
    let pointerWorldX = 0;
    let pointerDirX = 1;
    let lastPointerX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const worldX = (relX - 0.5) * 44;
      pointerDirX = worldX >= lastPointerX ? 1 : -1;
      lastPointerX = worldX;
      pointerWorldX = worldX;
      pointerInfluence = 1.0;
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });

    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (riverMat.uniforms?.uTime) {
        riverMat.uniforms.uTime.value = t;
      }

      // Ciclo contínuo de travessia da canoa no Hero (22 segundos)
      const period = 22;
      const progress = (t % period) / period;

      let boatX = -22;
      let boatSpeed = 1.6;
      let heading = 1;

      if (progress < 0.45) {
        const p = progress / 0.45;
        const smooth = p * p * (3 - 2 * p);
        boatX = -22 + smooth * 44; // -22 até +22
        boatSpeed = Math.sin(p * Math.PI) * 2.1;
        heading = 1;
        boatGroup.rotation.y = 0;
      } else if (progress < 0.5) {
        boatX = 22;
        boatSpeed = 0.2;
        heading = 1;
      } else if (progress < 0.95) {
        const p = (progress - 0.5) / 0.45;
        const smooth = p * p * (3 - 2 * p);
        boatX = 22 - smooth * 44; // +22 até -22
        boatSpeed = Math.sin(p * Math.PI) * 2.1;
        heading = -1;
        boatGroup.rotation.y = Math.PI;
      } else {
        boatX = -22;
        boatSpeed = 0.2;
        heading = -1;
      }

      const bob = Math.sin(t * 2.8) * 0.08;
      const roll = Math.sin(t * 2.1) * 0.04;
      boatGroup.position.set(boatX, -1.15 + bob, 4);
      boatGroup.rotation.z = roll;

      // Animação suave da remada do barqueiro
      oar.rotation.z = -0.25 + Math.sin(t * 3.8) * 0.28;

      // Decai influência do mouse
      pointerInfluence *= 0.95;

      // Atualiza Uniforms do Wake Shader (Canoa ou Toque do Usuário)
      if (riverMat.uniforms) {
        if (pointerInfluence > 0.25) {
          riverMat.uniforms.uBoatPos.value.set(pointerWorldX, -1.5, 4);
          riverMat.uniforms.uBoatDir.value.set(pointerDirX, 0);
          riverMat.uniforms.uBoatSpeed.value = 2.2 * pointerInfluence;
        } else {
          riverMat.uniforms.uBoatPos.value.set(boatX, -1.5, 4);
          riverMat.uniforms.uBoatDir.value.set(heading, 0);
          riverMat.uniforms.uBoatSpeed.value = boatSpeed;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
      riverGeo.dispose();
      riverMat.dispose();
      hullGeo.dispose();
      hullMat.dispose();
      stripeGeo.dispose();
      stripeMat.dispose();
      renderer.dispose();
    };
  }, [isLight]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 h-[68%] z-[1] opacity-85 pointer-events-auto cursor-crosshair"
      title="Passe o mouse para agitar as águas do Rio Caraíva"
    />
  );
};
