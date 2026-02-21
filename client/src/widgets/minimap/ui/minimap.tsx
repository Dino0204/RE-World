// features/minimap/ui/Minimap.tsx
// drei의 <View>를 사용해 별도 Canvas 뷰포트로 미니맵을 렌더링합니다.
// 메인 씬과 완전히 독립된 씬을 구성하므로 레이어 분리가 필요 없습니다.

import { useRef } from "react";
import { usePlayerStore } from "@/entities/player/model/player.store";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── 직교 카메라: 플레이어 위에 고정 ────────────────────────────
function MinimapCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { position } = usePlayerStore();

  useFrame(() => {
    if (!cameraRef.current) return;
    // 플레이어 X/Z를 따라 카메라가 이동 (항상 플레이어 중앙)
    cameraRef.current.position.set(position.x, 100, position.z);
    cameraRef.current.lookAt(position.x, 0, position.z);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      near={0.1}
      far={500}
      position={[0, 100, 0]}
    />
  );
}

// ── 플레이어 마커 ───────────────────────────────────────────────
function PlayerMarker() {
  const markerRef = useRef<THREE.Group>(null);
  const { position, rotation } = usePlayerStore();

  useFrame(() => {
    if (!markerRef.current) return;
    markerRef.current.position.set(position.x, 0, position.z);
    // rotation은 카메라 방향 Vector3 → XZ 평면 기준 각도
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
      <ambientLight intensity={2} />
      <color attach="background" args={["#0a1628"]} />

      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <gridHelper
        args={[500, 50, "#ffffff", "#888888"]}
        position={[0, -5, 0]}
      />

      {/* 내 플레이어 마커 */}
      <PlayerMarker />
    </>
  );
}
