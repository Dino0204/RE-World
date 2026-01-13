import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { CameraMode } from "../../player/model/player";

interface AR15Props {
  cameraMode: CameraMode;
}

export default function AR15({ cameraMode }: AR15Props) {
  // GLB 파일 로드 (텍스처와 재질이 자동으로 포함됨)
  const { scene } = useGLTF("/models/Rifle.glb");
  const meshRef = useRef<THREE.Group>(null);

  // 디버깅: GLB 구조 확인
  useEffect(() => {
    console.log("=== GLB Scene Structure ===");
    console.log("Scene:", scene);
    scene.traverse((child) => {
      console.log("Child:", child.name, child.type);
    });
  }, [scene]);

  // GLB는 재질이 이미 포함되어 있어서 useEffect 불필요
  // 필요시 재질 수정은 아래 주석 참고

  useFrame((state) => {
    if (!meshRef.current) return;

    // 디버깅: 현재 회전값 출력
    console.log("Rotation:", meshRef.current.rotation);

    if (cameraMode === "FIRST_PERSON") {
      const camera = state.camera;

      // Target World Position: Camera Pos + Offset (relative to camera view)
      const offset = new THREE.Vector3(0.1, -0.15, -0.25); // Adjusted for better view
      offset.applyQuaternion(camera.quaternion);
      const targetWorldPos = camera.position.clone().add(offset);

      // Target World Rotation: Match Camera (Gun pointing forward) + Correction
      const targetWorldQuat = camera.quaternion.clone();

      // 추가 회전 적용 (Y축 180도)
      const correctionQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      );
      targetWorldQuat.multiply(correctionQuat);

      // Position 설정
      if (meshRef.current.parent) {
        const parent = meshRef.current.parent;
        const localPos = targetWorldPos.clone();
        parent.worldToLocal(localPos);
        meshRef.current.position.copy(localPos);
      } else {
        meshRef.current.position.copy(targetWorldPos);
      }

      // Rotation 직접 설정 (quaternion 대신)
      meshRef.current.quaternion.copy(targetWorldQuat);
    } else {
      // THIRD_PERSON
      const camera = state.camera;

      // 1. Calculate Target Rotation (Look at Camera Direction)
      const targetWorldQuat = camera.quaternion.clone();

      // Apply the same correction as 1st person
      targetWorldQuat.multiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.PI // 180도 회전
        )
      );

      // 2. Position the gun relative to the player
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
        meshRef.current.quaternion.copy(targetWorldQuat);
      }
    }
  });

  return <primitive object={scene} ref={meshRef} scale={1} />; // Adjust scale as needed
}

// 프리로드 (선택사항 - 로딩 성능 향상)
useGLTF.preload("/models/Rifle.glb");

// 재질 수정이 필요한 경우 아래 코드를 useEffect로 추가:
/*
import { useEffect } from "react";

useEffect(() => {
  scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      
      // 기존 재질 속성 수정
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.roughness = 0.3;
        mat.metalness = 0.9;
        mat.needsUpdate = true;
      }
      
      // 그림자 설정
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
}, [scene]);
*/
