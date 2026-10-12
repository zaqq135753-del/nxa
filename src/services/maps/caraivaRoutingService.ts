import { type LatLngLiteral } from './types';
import { calculateHaversineDistanceMeters, estimateWalkingMinutes, formatDistance } from './geolocation';
import { type Business } from '../../data/caraivaDigitalData';

export interface RouteLandmark {
  id: string;
  name: string;
  coords: LatLngLiteral;
  description: string;
  icon: string; // emoji ou identificador
}

export interface RouteStepPOV {
  instruction: string;
  landmarkNear?: string;
  tip: string;
  distanceMeters: number;
  coords: LatLngLiteral;
  heading: number; // Ângulo para a câmera olhar (0 = Norte, 90 = Leste)
}

export interface VillageRoute {
  originName: string;
  originCoords: LatLngLiteral;
  destinationBusiness: Business;
  totalDistanceMeters: number;
  totalWalkingMinutes: number;
  formattedDistance: string;
  pathCoordinates: LatLngLiteral[]; // Linha completa da rota para desenhar no mapa
  steps: RouteStepPOV[];
}

// 1. Marcos Principais da Vila de Caraíva (Nós de Partida e Referência)
export const CARAIVA_KEY_ORIGINS: RouteLandmark[] = [
  {
    id: 'porto-barcos',
    name: 'Porto dos Barcos (Desembarque no Rio)',
    coords: { lat: -16.8128, lng: -39.1498 },
    description: 'Chegada tradicional das canoas e barcos que cruzam o rio',
    icon: '⛵',
  },
  {
    id: 'praca-igreja',
    name: 'Igrejinha de São Sebastião (Centrinho)',
    coords: { lat: -16.8145, lng: -39.1485 },
    description: 'Coração histórico de Caraíva com o cruzeiro e amendoeiras',
    icon: '⛪',
  },
  {
    id: 'campo-futebol',
    name: 'Campo de Futebol da Vila',
    coords: { lat: -16.8158, lng: -39.1472 },
    description: 'Ponto de encontro central entre o rio e as praias do sul',
    icon: '⚽',
  },
  {
    id: 'ponta-da-barra',
    name: 'Ponta da Barra (Encontro Rio e Mar)',
    coords: { lat: -16.8105, lng: -39.1458 },
    description: 'Extremo da península onde a água doce do rio abraça o oceano',
    icon: '🌊',
  },
  {
    id: 'praia-principal',
    name: 'Praia de Caraíva (Pé na Areia)',
    coords: { lat: -16.8130, lng: -39.1442 },
    description: 'Faixa litorânea com barracas de praia e coqueirais',
    icon: '🏖️',
  },
];

// 2. Grafo de Esquinas e Vielas de Areia Conectando a Vila
interface StreetNode {
  id: string;
  name: string;
  coords: LatLngLiteral;
  connections: string[];
}

const VILLAGE_NETWORK: Record<string, StreetNode> = {
  n_porto: {
    id: 'n_porto',
    name: 'Rua do Porto / Beira-Rio',
    coords: { lat: -16.8128, lng: -39.1498 },
    connections: ['n_beco_beira_rio', 'n_igreja'],
  },
  n_beco_beira_rio: {
    id: 'n_beco_beira_rio',
    name: 'Beco do Rio / Restaurantes',
    coords: { lat: -16.8135, lng: -39.1492 },
    connections: ['n_porto', 'n_igreja', 'n_sete_setembro'],
  },
  n_igreja: {
    id: 'n_igreja',
    name: 'Praça da Igreja / Rua do Cruzeiro',
    coords: { lat: -16.8145, lng: -39.1485 },
    connections: ['n_porto', 'n_beco_beira_rio', 'n_sete_setembro', 'n_campo', 'n_caminho_praia'],
  },
  n_sete_setembro: {
    id: 'n_sete_setembro',
    name: 'Rua Sete de Setembro',
    coords: { lat: -16.8142, lng: -39.1478 },
    connections: ['n_beco_beira_rio', 'n_igreja', 'n_caminho_praia'],
  },
  n_caminho_praia: {
    id: 'n_caminho_praia',
    name: 'Trilha da Praia / Amendoeiras',
    coords: { lat: -16.8132, lng: -39.1460 },
    connections: ['n_igreja', 'n_sete_setembro', 'n_barra', 'n_praia_frente'],
  },
  n_barra: {
    id: 'n_barra',
    name: 'Caminho da Barra / Ponta da Areia',
    coords: { lat: -16.8110, lng: -39.1460 },
    connections: ['n_caminho_praia', 'n_porto'],
  },
  n_praia_frente: {
    id: 'n_praia_frente',
    name: 'Frente do Mar / Coqueirais',
    coords: { lat: -16.8130, lng: -39.1442 },
    connections: ['n_caminho_praia', 'n_campo_praia'],
  },
  n_campo: {
    id: 'n_campo',
    name: 'Alameda do Campo / Área Residencial',
    coords: { lat: -16.8158, lng: -39.1472 },
    connections: ['n_igreja', 'n_campo_praia', 'n_sul_trilha'],
  },
  n_campo_praia: {
    id: 'n_campo_praia',
    name: 'Travessa do Campo até o Mar',
    coords: { lat: -16.8152, lng: -39.1450 },
    connections: ['n_campo', 'n_praia_frente'],
  },
  n_sul_trilha: {
    id: 'n_sul_trilha',
    name: 'Trilha do Sul / Pousadas do Bosque',
    coords: { lat: -16.8175, lng: -39.1465 },
    connections: ['n_campo'],
  },
};

/**
 * Calcula o azimute/heading entre dois pontos geográficos em graus (0° a 360°)
 */
export function calculateBearing(from: LatLngLiteral, to: LatLngLiteral): number {
  const y = Math.sin((to.lng - from.lng) * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180);
  const x =
    Math.cos(from.lat * Math.PI / 180) * Math.sin(to.lat * Math.PI / 180) -
    Math.sin(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.cos((to.lng - from.lng) * Math.PI / 180);
  const deg = (Math.atan2(y, x) * 180) / Math.PI;
  return (deg + 360) % 360;
}

/**
 * Encontra o nó da rede de ruas de Caraíva mais próximo de um ponto dado
 */
function findClosestNode(coords: LatLngLiteral): StreetNode {
  let closest: StreetNode = VILLAGE_NETWORK.n_igreja;
  let minDistance = Infinity;

  for (const node of Object.values(VILLAGE_NETWORK)) {
    const dist = calculateHaversineDistanceMeters(coords, node.coords);
    if (dist < minDistance) {
      minDistance = dist;
      closest = node;
    }
  }
  return closest;
}

/**
 * Algoritmo de roteamento pedonal na areia de Caraíva (Dijkstra)
 */
export function calculateVillageWalkingRoute(
  origin: { name: string; coords: LatLngLiteral },
  destinationBusiness: Business
): VillageRoute {
  const destCoords: LatLngLiteral = {
    lat: destinationBusiness.latitude,
    lng: destinationBusiness.longitude,
  };

  const startNode = findClosestNode(origin.coords);
  const endNode = findClosestNode(destCoords);

  // Dijkstra simples no grafo de ruas
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  for (const key of Object.keys(VILLAGE_NETWORK)) {
    distances[key] = Infinity;
    previous[key] = null;
    unvisited.add(key);
  }

  distances[startNode.id] = 0;

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let shortest = Infinity;

    for (const id of unvisited) {
      if (distances[id] < shortest) {
        shortest = distances[id];
        currentId = id;
      }
    }

    if (!currentId || shortest === Infinity) break;
    if (currentId === endNode.id) break;

    unvisited.delete(currentId);
    const current = VILLAGE_NETWORK[currentId];

    for (const neighborId of current.connections) {
      if (!unvisited.has(neighborId)) continue;
      const neighbor = VILLAGE_NETWORK[neighborId];
      const edgeDist = calculateHaversineDistanceMeters(current.coords, neighbor.coords);
      const alt = distances[currentId] + edgeDist;

      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentId;
      }
    }
  }

  // Reconstrução do caminho
  const nodePath: StreetNode[] = [];
  let curr: string | null = endNode.id;

  while (curr) {
    nodePath.unshift(VILLAGE_NETWORK[curr]);
    curr = previous[curr];
  }

  // Se o início e fim são o mesmo nó
  if (nodePath.length === 0) {
    nodePath.push(startNode);
  }

  // Montagem das coordenadas completas (Origem -> Nós da vila -> Destino final)
  const fullCoordinates: LatLngLiteral[] = [origin.coords];
  for (const node of nodePath) {
    fullCoordinates.push(node.coords);
  }
  fullCoordinates.push(destCoords);

  // Calcula distância total acumulada
  let totalMeters = 0;
  for (let i = 0; i < fullCoordinates.length - 1; i++) {
    totalMeters += calculateHaversineDistanceMeters(fullCoordinates[i], fullCoordinates[i + 1]);
  }

  // Gera os passos interativos POV com instruções locais de Caraíva
  const steps: RouteStepPOV[] = [];

  for (let i = 0; i < fullCoordinates.length - 1; i++) {
    const from = fullCoordinates[i];
    const to = fullCoordinates[i + 1];
    const segDist = calculateHaversineDistanceMeters(from, to);
    const heading = calculateBearing(from, to);

    let instruction = '';
    let tip = '';

    if (i === 0) {
      instruction = `Inicie sua caminhada saindo de ${origin.name}`;
      tip = 'Mantenha-se no caminho de areia batida, calçando chinelo ou pé na areia.';
    } else if (i === fullCoordinates.length - 2) {
      instruction = `Aproxime-se da entrada de ${destinationBusiness.name}`;
      tip = destinationBusiness.locationReference
        ? `Referência local: ${destinationBusiness.locationReference}`
        : 'Procure pela placa decorativa de madeira nativa.';
    } else {
      const currentNode = nodePath[i - 1];
      instruction = `Siga por ${currentNode ? currentNode.name : 'pelas ruas de areia da vila'}`;
      tip = 'Observe as casas coloridas e os coqueirais à sua volta.';
    }

    steps.push({
      instruction,
      tip,
      distanceMeters: segDist,
      coords: from,
      heading,
    });
  }

  // Passo final de chegada
  steps.push({
    instruction: `Você chegou a ${destinationBusiness.name}! 🏝️`,
    tip: 'Desfrute da hospitalidade e do ritmo desacelerado de Caraíva.',
    distanceMeters: 0,
    coords: destCoords,
    heading: steps.length > 0 ? steps[steps.length - 1].heading : 0,
  });

  const walkingMinutes = estimateWalkingMinutes(totalMeters);

  return {
    originName: origin.name,
    originCoords: origin.coords,
    destinationBusiness,
    totalDistanceMeters: totalMeters,
    totalWalkingMinutes: walkingMinutes,
    formattedDistance: formatDistance(totalMeters),
    pathCoordinates: fullCoordinates,
    steps,
  };
}
