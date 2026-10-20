import * as THREE from 'three';

export interface WaterShaderUniforms {
  uTime: { value: number };
  uWaterColor: { value: THREE.Color };
  uShallowColor: { value: THREE.Color };
  uSunColor: { value: THREE.Color };
  uSunPosition: { value: THREE.Vector3 };
  uTideHeight: { value: number };
  uWaveSpeed: { value: number };
  uBoatPos: { value: THREE.Vector3 };
  uBoatDir: { value: THREE.Vector2 };
  uBoatSpeed: { value: number };
}

const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uTideHeight;
uniform vec3 uBoatPos;
uniform vec2 uBoatDir;
uniform float uBoatSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vWakeElevation;
varying float vWakeFoam;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // Calcula posição mundial do vértice
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

  // 1. Dinâmica de micro-ondas suaves tropicais de base
  float baseWave = sin(worldPos.x * 0.15 + uTime * uWaveSpeed) * 0.18 + cos(worldPos.z * 0.12 + uTime * (uWaveSpeed * 0.8)) * 0.14;
  float totalDisplacement = baseWave + (uTideHeight * 0.4);

  // 2. Simulação Física de Rastro de Embarcação (Kelvin Wake Dispersion)
  float wakeElev = 0.0;
  float wakeFoam = 0.0;

  if (uBoatSpeed > 0.001) {
    vec2 toVertex = worldPos.xz - uBoatPos.xz;
    vec2 dir = normalize(uBoatDir);
    
    // Projeção ao longo da direção do barco (s < 0 é atrás da popa)
    float s = dot(toVertex, dir);
    // Distância perpendicular lateral (w)
    float w = abs(toVertex.x * dir.y - toVertex.y * dir.x);

    if (s < 0.0 && s > -28.0) {
      float distBehind = -s;
      // Ângulo clássico de Kelvin: ~19.47 graus (tan ≈ 0.353)
      float wakeHalfWidth = distBehind * 0.36 + 1.2;

      if (w <= wakeHalfWidth) {
        float falloff = exp(-distBehind * 0.12) * smoothstep(wakeHalfWidth, 0.0, w);
        
        // Ondas transversais + divergentes em V
        float transverse = cos(distBehind * 3.2 - uTime * 6.5);
        float divergent = cos(8.0 * (w - 0.36 * distBehind));
        
        wakeElev = (transverse * 0.45 + divergent * 0.55) * falloff * uBoatSpeed * 0.45;

        // Espuma na esteira imediata
        float sternFoam = exp(-distBehind * 0.35) * exp(-w * 1.4);
        float vCrests = smoothstep(0.15, 0.45, wakeElev);
        wakeFoam = clamp(sternFoam * 1.5 + vCrests * 0.8, 0.0, 1.0) * falloff;
      }
    }
  }

  vWakeElevation = wakeElev;
  vWakeFoam = wakeFoam;

  vec3 pos = position;
  pos.z += totalDisplacement + wakeElev;

  vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uWaterColor;
uniform vec3 uShallowColor;
uniform vec3 uSunColor;
uniform vec3 uSunPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vWakeElevation;
varying float vWakeFoam;

void main() {
  // Ondulação procedural na superfície
  float wavePattern = sin(vUv.x * 32.0 + uTime * 1.5) * cos(vUv.y * 24.0 + uTime * 1.2);
  wavePattern = (wavePattern + 1.0) * 0.5;

  // Vetores de reflexão solar
  vec3 lightDir = normalize(uSunPosition - vPosition);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  
  // Perturbação da normal pelo rastro da canoa
  vec3 perturbedNormal = normalize(vNormal + vec3(vWakeElevation * 1.8, 0.0, vWakeElevation * 1.5));
  vec3 reflectDir = reflect(-lightDir, perturbedNormal);

  // Brilho especular dourado baiano com corte aveludado
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

  // Interpolação suave entre água profunda e margem rasa
  vec3 waterBase = mix(uWaterColor, uShallowColor, wavePattern * 0.45);
  vec3 finalColor = waterBase + (uSunColor * spec * 0.72);

  // Blend com espuma do rastro físico (branco-pérola com reflexo solar dourado)
  vec3 foamColor = vec3(0.94, 0.98, 1.0) + (uSunColor * 0.35);
  finalColor = mix(finalColor, foamColor, clamp(vWakeFoam * 0.82, 0.0, 0.95));

  gl_FragColor = vec4(finalColor, 0.88);
}
`;

export function createWaterShaderMaterial(isOcean: boolean = false): THREE.ShaderMaterial {
  const uniforms: WaterShaderUniforms = {
    uTime: { value: 0 },
    uWaterColor: {
      value: isOcean
        ? new THREE.Color(0x0284c7) // Azul Oceano Atlântico
        : new THREE.Color(0x0fa3a5) // Verde Turquesa Rio Caraíva
    },
    uShallowColor: {
      value: isOcean
        ? new THREE.Color(0x38bdf8)
        : new THREE.Color(0x5eead4)
    },
    uSunColor: {
      value: new THREE.Color(0xf6c945) // Dourado Sol da Bahia
    },
    uSunPosition: {
      value: new THREE.Vector3(60, 90, 50)
    },
    uTideHeight: { value: 0 },
    uWaveSpeed: { value: isOcean ? 1.6 : 1.1 },
    uBoatPos: { value: new THREE.Vector3(-60, 0, -18) },
    uBoatDir: { value: new THREE.Vector2(1, 0) },
    uBoatSpeed: { value: 0 }
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
}
