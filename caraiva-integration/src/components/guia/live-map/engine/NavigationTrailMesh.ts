import * as THREE from 'three';
import type { LatLngLiteral } from '../../../../services/maps/types';
import { CARAIVA_CENTER_COORDS } from '../../../../services/maps/types';

export function latLngToWorld(lat: number, lng: number): { x: number; z: number } {
  const x = (lng - CARAIVA_CENTER_COORDS.lng) * 22000;
  const z = (lat - CARAIVA_CENTER_COORDS.lat) * -24000;
  return { x, z };
}

export interface NavigationTrailComponents {
  routeGroup: THREE.Group;
  avatarGroup: THREE.Group;
  startPoint: THREE.Vector3 | null;
}

export function buildNavigationTrail(routeCoords: LatLngLiteral[]): NavigationTrailComponents {
  const routeGroup = new THREE.Group();
  const avatarGroup = new THREE.Group();

  if (!routeCoords || routeCoords.length < 2) {
    return { routeGroup, avatarGroup, startPoint: null };
  }

  const points3D = routeCoords.map((c) => {
    const { x, z } = latLngToWorld(c.lat, c.lng);
    return new THREE.Vector3(x, 0.35, z);
  });

  // Tubo de Luz Fluorescente Esmeralda na Areia
  const curve = new THREE.CatmullRomCurve3(points3D);
  const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.4, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.65,
    roughness: 0.3,
  });
  const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
  routeGroup.add(tubeMesh);

  // Pegadas de Luz ao longo da Trilha
  for (let i = 0; i < points3D.length; i += 2) {
    const p = points3D[i];
    const markerGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 12);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xf6c945 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(p);
    marker.position.y = 0.2;
    routeGroup.add(marker);
  }

  // Avatar Nativo de Caraíva (Viajante de Chapéu de Palha)
  const avatar = new THREE.Group();
  const startPoint = points3D[0];
  avatar.position.copy(startPoint);

  // Camisa Floral Verde Água
  const shirtGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.5, 8);
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0fa3a5, roughness: 0.6 });
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

  // Chapéu de Palha Baiano
  const hatBrimGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 16);
  const hatMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 });
  const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
  hatBrim.position.y = 2.68;
  avatar.add(hatBrim);

  const hatTopGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.55, 12);
  const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
  hatTop.position.y = 2.95;
  avatar.add(hatTop);

  // Mochila Laranja de Aventura
  const bagGeo = new THREE.BoxGeometry(0.55, 0.8, 0.35);
  const bagMat = new THREE.MeshStandardMaterial({ color: 0xea580c });
  const bag = new THREE.Mesh(bagGeo, bagMat);
  bag.position.set(0, 1.4, -0.45);
  avatar.add(bag);

  avatarGroup.add(avatar);

  return { routeGroup, avatarGroup, startPoint };
}
