import { useRef } from "react";
import { usePlayerStore } from "@/entities/player/model/player.store";
import { OrthographicCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 카메라 절두체 반경 (플레이어 기준 ±N 유닛)
const FRUSTUM_HALF = 100;

const vertexShader = /* glsl */ `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// fwidth()로 픽셀 밀도에 따라 선 굵기를 보정 → 끊김 없는 격자
const fragmentShader = /* glsl */ `
  uniform vec3 uLineColor;
  uniform vec3 uBgColor;
  uniform float uCellSize;

  varying vec3 vWorldPos;

  void main() {
    vec2 coord = vWorldPos.xz / uCellSize;
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
    float alpha = 1.0 - smoothstep(0.0, 1.5, line);
    gl_FragColor = vec4(mix(uBgColor, uLineColor, alpha), 1.0);
  }
`;

const GRID_UNIFORMS = {
  uLineColor: { value: new THREE.Color("#4a6080") },
  uBgColor: { value: new THREE.Color("#0a1628") },
  uCellSize: { value: 10 },
};

// ── 직교 카메라: 플레이어 위에 고정 ────────────────────────────
function MinimapCamera() {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const { position } = usePlayerStore();

  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(position.x, 100, position.z);
    cameraRef.current.lookAt(position.x, 0, position.z);
  });

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      manual
      near={0.1}
      far={500}
      left={-FRUSTUM_HALF}
      right={FRUSTUM_HALF}
      top={FRUSTUM_HALF}
      bottom={-FRUSTUM_HALF}
      position={[0, 100, 0]}
    />
  );
}

// ── ShaderMaterial 격자 ──────────────────────────────────────────
function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <shaderMaterial
        uniforms={GRID_UNIFORMS}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

// ── 플레이어 마커 ───────────────────────────────────────────────
function PlayerMarker() {
  const markerRef = useRef<THREE.Group>(null);
  const { position, rotation } = usePlayerStore();

  useFrame(() => {
    if (!markerRef.current) return;
    markerRef.current.position.set(position.x, 0, position.z);
    const angle = Math.atan2(rotation.x, rotation.z);
    markerRef.current.rotation.y = angle;
  });

  return (
    <group ref={markerRef}>
      {/* 원형 베이스 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#00e5ff" />
      </mesh>
      {/* 방향 삼각형 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, -2.2]}>
        <coneGeometry args={[0.7, 1.8, 3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

// ── 미니맵 씬 ────────────────────────────────────────────────────
export function Minimap() {
  return (
    <>
      <MinimapCamera />
      <color attach="background" args={["#0a1628"]} />
      <GridPlane />
      <PlayerMarker />
    </>
  );
}
