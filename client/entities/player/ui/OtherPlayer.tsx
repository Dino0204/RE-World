import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OtherPlayerProperties {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

export default function OtherPlayer({
  position,
  rotation,
}: OtherPlayerProperties) {
  const meshReference = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshReference.current) {
      meshReference.current.position.lerp(
        new THREE.Vector3(position.x, position.y, position.z),
        0.1,
      );
      meshReference.current.quaternion.slerp(
        new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w),
        0.1,
      );
    }
  });

  return (
    <mesh ref={meshReference}>
      <capsuleGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}
