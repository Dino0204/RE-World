import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { CameraMode } from "../../player/model/player";

interface AR15Props {
  cameraMode: CameraMode;
}

export default function AR15({ cameraMode }: AR15Props) {
  const obj = useLoader(OBJLoader, "/models/ar15.obj");
  const meshRef = useRef<THREE.Group>(null);

  // Material setup (if model lacks materials)
  useEffect(() => {
    obj.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#2f3542",
          roughness: 0.5,
          metalness: 0.8,
        });
      }
    });
  }, [obj]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (cameraMode === "FIRST_PERSON") {
      const camera = state.camera;

      // Target World Position: Camera Pos + Offset (relative to camera view)
      const offset = new THREE.Vector3(0.15, -0.1, -0.3); // Adjusted for better view
      offset.applyQuaternion(camera.quaternion);
      const targetWorldPos = camera.position.clone().add(offset);

      // Target World Rotation: Match Camera (Gun pointing forward) + Correction
      const targetWorldQuat = camera.quaternion.clone();
      targetWorldQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI / 2
        )
      );

      if (meshRef.current.parent) {
        // Convert World to Local Position
        const parent = meshRef.current.parent;
        const localPos = targetWorldPos.clone();
        parent.worldToLocal(localPos);
        meshRef.current.position.copy(localPos);

        // Convert World to Local Rotation
        const parentWorldQuat = new THREE.Quaternion();
        parent.getWorldQuaternion(parentWorldQuat);
        // childLocal = parentWorldInverse * childWorld
        meshRef.current.quaternion.copy(
          parentWorldQuat.invert().multiply(targetWorldQuat)
        );
      } else {
        // Fallback if no parent (shouldn't happen if mounted correctly)
        meshRef.current.position.copy(targetWorldPos);
        meshRef.current.quaternion.copy(targetWorldQuat);
      }
    } else {
      // THIRD_PERSON
      // Attach to player body
      meshRef.current.position.set(0.2, 0.2, 0.5); // Right side, chest height
      meshRef.current.rotation.set(0, Math.PI, 0); // Point forward (assuming model points -Z or +Z)
    }
  });

  return <primitive object={obj} ref={meshRef} scale={0.02} />; // Adjust scale as needed
}
