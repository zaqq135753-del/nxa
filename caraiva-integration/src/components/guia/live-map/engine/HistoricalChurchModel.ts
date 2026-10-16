import * as THREE from 'three';
import { createMarkerSprite } from './ColonialBuildingFactory';
import type { LiveMapPoint } from '../../../../services/maps/liveMapModel';

export function buildHistoricalChurch(point: LiveMapPoint, isSelected: boolean): THREE.Group {
  const houseContainer = new THREE.Group();

  // Corpo Principal da Igreja Colonial (Branco Cal)
  const churchBodyGeo = new THREE.BoxGeometry(6.5, 5.5, 9);
  const churchMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
  const churchBody = new THREE.Mesh(churchBodyGeo, churchMat);
  churchBody.position.y = 2.75;
  churchBody.castShadow = true;
  churchBody.receiveShadow = true;
  houseContainer.add(churchBody);

  // Telhado Colonial Terracota
  const churchRoofGeo = new THREE.ConeGeometry(5.2, 3.2, 4);
  const churchRoofMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
  const churchRoof = new THREE.Mesh(churchRoofGeo, churchRoofMat);
  churchRoof.position.y = 6.6;
  churchRoof.rotation.y = Math.PI / 4;
  churchRoof.castShadow = true;
  houseContainer.add(churchRoof);

  // Torre Sineira
  const belfryGeo = new THREE.BoxGeometry(2, 3.5, 2);
  const belfry = new THREE.Mesh(belfryGeo, churchMat);
  belfry.position.set(0, 7.5, 2.5);
  belfry.castShadow = true;
  houseContainer.add(belfry);

  // Cruz de Madeira Maciça
  const crossGeoH = new THREE.BoxGeometry(1.4, 0.25, 0.25);
  const crossGeoV = new THREE.BoxGeometry(0.25, 1.8, 0.25);
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
  const crossH = new THREE.Mesh(crossGeoH, crossMat);
  const crossV = new THREE.Mesh(crossGeoV, crossMat);
  crossH.position.set(0, 9.8, 2.5);
  crossV.position.set(0, 9.6, 2.5);
  houseContainer.add(crossH);
  houseContainer.add(crossV);

  // Porta da Igreja em Arco
  const doorGeo = new THREE.BoxGeometry(1.8, 2.8, 0.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 1.4, 4.55);
  houseContainer.add(door);

  // Anel de Seleção Dourado
  if (isSelected) {
    const ringGeo = new THREE.RingGeometry(4.8, 5.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf6c945,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    houseContainer.add(ring);
  }

  // Sprite de Marcador Histórico
  const sprite = createMarkerSprite(point.business.name || "Igreja de São Sebastião", "⛪", isSelected);
  sprite.position.set(0, 11.2, 2.5);
  houseContainer.add(sprite);

  return houseContainer;
}
