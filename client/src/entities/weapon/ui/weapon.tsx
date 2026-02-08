import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import type { CameraMode, Weapon as WeaponType } from "re-world-shared";

interface WeaponProps {
  cameraMode: CameraMode;
  weapon: WeaponType;
  isAiming: boolean;
  visible: boolean;
}

export default function Weapon({
  cameraMode,
  weapon,
  isAiming,
  visible,
}: WeaponProps) {
  const { scene } = useGLTF(`/models/${weapon.model}.glb`);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current || !visible) return;

    if (cameraMode === "FIRST_PERSON") {
      const camera = state.camera;

      const hipFireOffset = new THREE.Vector3(0.1, -0.15, -0.25);
      const adsOffset = new THREE.Vector3(0, -0.17, -0.15);
      const targetOffset = isAiming ? adsOffset : hipFireOffset;
      const currentOffset = new THREE.Vector3().copy(targetOffset);

      currentOffset.applyQuaternion(camera.quaternion);

      const targetWorldPos = camera.position.clone().add(currentOffset);

      const targetWorldQuat = camera.quaternion.clone();

      const correctionQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI,
      );

      targetWorldQuat.multiply(correctionQuat);

      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;
        const localPos = targetWorldPos.clone();
        parent.worldToLocal(localPos);
        meshRef.current.position.lerp(localPos, 0.2);
      } else {
        meshRef.current.position.lerp(targetWorldPos, 0.2);
      }

      meshRef.current.quaternion.slerp(targetWorldQuat, 0.2);
    } else if (cameraMode === "THIRD_PERSON") {
      const camera = state.camera;

      const targetWorldQuat = camera.quaternion.clone();

      targetWorldQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI,
        ),
      );

      meshRef.current.position.set(0.3, 0.5, 0.5);

      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;
        const parentWorldQuat = new THREE.Quaternion();
        parent.getWorldQuaternion(parentWorldQuat);

        meshRef.current.quaternion.copy(
          parentWorldQuat.invert().multiply(targetWorldQuat),
        );
      } else {
        meshRef.current.quaternion.copy(targetWorldQuat);
      }
    }
  });

  return <primitive object={scene} ref={meshRef} scale={1} visible={visible} />;
}
