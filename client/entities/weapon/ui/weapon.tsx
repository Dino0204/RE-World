import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";
import { CameraMode } from "../../player/model/player";
import { Weapon as WeaponType } from "../model/weapon";

interface WeaponProps {
  cameraMode: CameraMode;
  weapon: WeaponType;
}

export default function Weapon({ cameraMode, weapon }: WeaponProps) {
  const { scene } = useGLTF(`/models/${weapon.model}.glb`);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (cameraMode === "FIRST_PERSON") {
      const camera = state.camera;

      const offset = new THREE.Vector3(0.1, -0.15, -0.25);
      offset.applyQuaternion(camera.quaternion);

      const targetWorldPos = camera.position.clone().add(offset);

      const targetWorldQuat = camera.quaternion.clone();

      const correctionQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      );

      targetWorldQuat.multiply(correctionQuat);

      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;
        const localPos = targetWorldPos.clone();
        parent.worldToLocal(localPos);
        meshRef.current.position.copy(localPos);
      } else {
        meshRef.current.position.copy(targetWorldPos);
      }

      meshRef.current.quaternion.copy(targetWorldQuat);
    } else if (cameraMode === "THIRD_PERSON") {
      const camera = state.camera;

      const targetWorldQuat = camera.quaternion.clone();

      targetWorldQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI
        )
      );

      meshRef.current.position.set(0.3, 0.5, 0.5);

      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;
        const parentWorldQuat = new THREE.Quaternion();
        parent.getWorldQuaternion(parentWorldQuat);

        meshRef.current.quaternion.copy(
          parentWorldQuat.invert().multiply(targetWorldQuat)
        );
      } else {
        meshRef.current.quaternion.copy(targetWorldQuat);
      }
    }
  });

  return <primitive object={scene} ref={meshRef} scale={1} />;
}
