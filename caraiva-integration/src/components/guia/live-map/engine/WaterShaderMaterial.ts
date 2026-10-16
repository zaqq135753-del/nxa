import * as THREE from 'three';

export interface WaterShaderUniforms {
  uTime: { value: number };
  uWaterColor: { value: THREE.Color };
  uShallowColor: { value: THREE.Color };
  uSunColor: { value: THREE.Color };
  uSunPosition: { value: THREE.Vector3 };
  uTideHeight: { value: number };
  uWaveSpeed: { value: number };
}

const vertexShader = `
uniform float uTime;
uniform float uWaveSpeed;
uniform float uTideHeight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec3 pos = position;
  // Dinâmica de micro-ondas suaves tropicais
  float wave = sin(pos.x * 0.15 + uTime * uWaveSpeed) * 0.18 + cos(pos.y * 0.12 + uTime * (uWaveSpeed * 0.8)) * 0.14;
  pos.z += wave + (uTideHeight * 0.4);

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

void main() {
  // Ondulação procedural na superfície
  float wavePattern = sin(vUv.x * 32.0 + uTime * 1.5) * cos(vUv.y * 24.0 + uTime * 1.2);
  wavePattern = (wavePattern + 1.0) * 0.5;

  // Vetores de reflexão solar
  vec3 lightDir = normalize(uSunPosition - vPosition);
  vec3 viewDir = normalize(cameraPosition - vPosition);
  vec3 reflectDir = reflect(-lightDir, vNormal);

  // Brilho especular dourado baiano
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), 28.0);

  // Interpolação suave entre água profunda e margem rasa
  vec3 waterBase = mix(uWaterColor, uShallowColor, wavePattern * 0.45);
  vec3 finalColor = waterBase + (uSunColor * spec * 0.65);

  gl_FragColor = vec4(finalColor, 0.86);
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
    uWaveSpeed: { value: isOcean ? 1.6 : 1.1 }
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
}
