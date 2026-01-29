import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { GameMessage } from "@/entities/player/model/player";

type OtherPlayerProps = Pick<GameMessage, "position" | "rotation">;

export default function OtherPlayer({ position, rotation }: OtherPlayerProps) {
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
