import * as THREE from 'three';
import type { LiveMapPoint } from '../../../../services/maps/liveMapModel';

export const HOUSE_COLORS: { [key: string]: number } = {
  restaurantes: 0xf59e0b, // Amarelo mostarda
  bares: 0xef4444,        // Vermelho terracota
  cafes: 0x10b981,        // Verde menta
  praias: 0x06b6d4,       // Azul turquesa
  passeios: 0x3b82f6,     // Azul marinho
  hospedagens: 0x8b5cf6,   // Lavanda colonial
  noite: 0xec4899,        // Rosa bougainville
  lojas: 0xf97316,        // Laranja nativo
  pontos: 0xf8fafc,       // Branco cal histórico
};

export const CATEGORY_EMOJIS: { [key: string]: string } = {
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

export function createMarkerSprite(title: string, emoji: string, isSelected: boolean): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.shadowColor = isSelected ? "rgba(246, 201, 69, 0.85)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = isSelected ? 18 : 10;
    ctx.shadowOffsetY = 4;

    const grad = ctx.createLinearGradient(16, 20, 240, 80);
    if (isSelected) {
      grad.addColorStop(0, "#F6C945");
      grad.addColorStop(1, "#D97706");
    } else {
      grad.addColorStop(0, "rgba(20, 23, 25, 0.94)");
      grad.addColorStop(1, "rgba(30, 41, 59, 0.94)");
    }

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

    ctx.lineWidth = isSelected ? 3.5 : 2;
    ctx.strokeStyle = isSelected ? "#FFF4ED" : "rgba(255, 255, 255, 0.22)";
    ctx.stroke();

    ctx.shadowColor = "transparent";

    ctx.font = "26px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 32, 48);

    ctx.font = "bold 20px 'Segoe UI', system-ui, sans-serif";
    ctx.fillStyle = isSelected ? "#090B0C" : "#FFF4ED";
    const truncated = title.length > 14 ? title.substring(0, 13) + "…" : title;
    ctx.fillText(truncated, 72, 49);

    ctx.beginPath();
    ctx.moveTo(120, 80);
    ctx.lineTo(136, 80);
    ctx.lineTo(128, 96);
    ctx.closePath();
    ctx.fillStyle = isSelected ? "#D97706" : "rgba(20, 23, 25, 0.94)";
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

export function buildColonialHouse(point: LiveMapPoint, isSelected: boolean): THREE.Group {
  const b = point.business;
  const houseContainer = new THREE.Group();

  const wallColor = HOUSE_COLORS[b.category] || 0xf59e0b;
  const roofColor = 0xc2410c; // Terracota baiano

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
    color: isSelected ? 0xf6c945 : roofColor,
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

  // Janelas Coloniais Azuis
  const winGeo = new THREE.BoxGeometry(0.85, 0.95, 0.15);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
  const winLeft = new THREE.Mesh(winGeo, winMat);
  winLeft.position.set(-1.3, 1.6, houseDepth / 2 + 0.08);
  const winRight = new THREE.Mesh(winGeo, winMat);
  winRight.position.set(1.3, 1.6, houseDepth / 2 + 0.08);
  houseContainer.add(winLeft);
  houseContainer.add(winRight);

  // Lamparina Noturna com Luz Suave
  const lampGeo = new THREE.SphereGeometry(0.2, 6, 6);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xf6c945 });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.set(0, 2.4, houseDepth / 2 + 0.4);
  houseContainer.add(lamp);

  // Anel de Seleção Dourado
  if (isSelected) {
    const ringGeo = new THREE.RingGeometry(3.6, 4.4, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf6c945,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    houseContainer.add(ring);
  }

  // Sprite Flutuante
  const emoji = CATEGORY_EMOJIS[b.category] || "📍";
  const sprite = createMarkerSprite(b.name, emoji, isSelected);
  sprite.position.set(0, 6.4, 0);
  houseContainer.add(sprite);

  return houseContainer;
}
