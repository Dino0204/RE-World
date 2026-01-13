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
      const camera = state.camera;

      // 1. Calculate Target Rotation (Look at Camera Direction)
      // We want the gun to point where the camera is looking.
      const targetWorldQuat = camera.quaternion.clone();

      // Apply the same correction as 1st person (assuming model needs 90 deg rotation to point forward)
      targetWorldQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI / 2
        )
      );

      // 2. Position the gun relative to the player
      // Ideally, we want the gun to be at the player's side/hand.
      // Since meshRef is child of RigidBody (which doesn't rotate with camera),
      // we need to set World Position relative to RigidBody but accounting for offset.

      // Let's assume a fixed offset from the player center for now.
      // Note: This position will rotate with the RigidBody if the RigidBody rotates.
      // But RB rotation is locked? No, mesh rotates. AR15 is sibling of mesh.
      // So AR15 position (0.2, 0.2, 0.5) is in RB local space (which is effectively World Space but translated).
      // Wait, RB has lockRotations=true, so its rotation is always (0,0,0,1) roughly.
      // So Local Space axes align with World Space axes.

      // However, visually we want the gun to be near the player model.
      // The player model (sibling mesh) rotates to face movement.
      // If we just attach gun to RB, it stays at fixed world offset relative to RB center.
      // It won't follow the player model's rotation (facing movement).

      // BUT, the requirement is "Aim at crosshair".
      // If the player model faces movement (e.g. running left), but user looks forward,
      // the gun should point forward (towards crosshair).
      // If we attach it to the player model (which faces left), the gun would point left.
      // So keeping it independent of player model rotation might be better for "aiming where looking".

      // So, let's update rotation to match camera, and position it slightly offset from center.

      meshRef.current.position.set(0.3, 0.5, 0.5); // Right, Up, Forward from center

      // 3. Apply Rotation (accounting for parent if needed)
      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;

        // Convert Target World Rotation to Local Rotation
        const parentWorldQuat = new THREE.Quaternion();
        parent.getWorldQuaternion(parentWorldQuat);

        meshRef.current.quaternion.copy(
          parentWorldQuat.invert().multiply(targetWorldQuat)
        );
      } else {
        meshRef.current.rotation.set(0, Math.PI, 0); // Fallback
        meshRef.current.quaternion.copy(targetWorldQuat);
      }
    }
  });

  return <primitive object={obj} ref={meshRef} scale={0.02} />; // Adjust scale as needed
}
