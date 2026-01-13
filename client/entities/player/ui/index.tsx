import { useEffect, useReducer, useRef, useState } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerState, PlayerAction, CameraMode } from "../model/player";
import { useBulletStore } from "../../bullet/model/store";

const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case "SET_DIRECTION":
      return {
        ...state,
        isMoving: action.direction.x !== 0 || action.direction.z !== 0,
        direction: action.direction,
      };
    case "JUMP":
      return {
        ...state,
        isJumping: true,
      };
    case "RESET_JUMP":
      return {
        ...state,
        isJumping: false,
      };
    case "EQUIP_ITEM":
      return {
        ...state,
        equippedItem: action.item,
      };
    default:
      return state;
  }
};

const initialState: PlayerState = {
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  speed: 5,
  jumpForce: 6,
  equippedItem: null,
};

export default function Player() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("FIRST_PERSON");
  const rbRef = useRef<RapierRigidBody>(null);
  const keysPressed = useRef(new Set<string>());
  const isOnFloor = useRef(true);

  useEffect(() => {
    const updateDirection = () => {
      const keys = keysPressed.current;
      const direction = {
        x: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
        z: (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0),
      };
      dispatch({ type: "SET_DIRECTION", direction });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        keysPressed.current.add(key);
        updateDirection();
      } else if (key === " ") {
        dispatch({ type: "JUMP" });
      } else if (key === "v") {
        setCameraMode((prev) =>
          prev === "FIRST_PERSON" ? "THIRD_PERSON" : "FIRST_PERSON"
        );
      } else if (key === "1") {
        dispatch({ type: "EQUIP_ITEM", item: "AR15" });
      } else if (key === "2") {
        dispatch({ type: "EQUIP_ITEM", item: null });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        keysPressed.current.delete(key);
        updateDirection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const addBullet = useBulletStore((state) => state.addBullet);

  useEffect(() => {
    const handleMouseDown = () => {
      if (!rbRef.current) return;
      if (state.equippedItem !== "AR15") return;

      const position = rbRef.current.translation();
      const cameraWorldDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraWorldDirection);

      const bulletVelocity = cameraWorldDirection.clone().multiplyScalar(20); // 속도 20

      // 총알 발사 위치: 플레이어 위치 + 카메라 방향으로 조금 앞 + 눈 높이
      // 3인칭의 경우 카메라 위치 고려 로직이 추가될 수 있으나, 일단 플레이어 몸체 기준으로 발사
      const spawnPos = new THREE.Vector3(
        position.x,
        position.y + 0.5,
        position.z
      ).add(cameraWorldDirection.clone().multiplyScalar(1.0));

      addBullet({
        id: Math.random().toString(36).substr(2, 9),
        position: spawnPos,
        velocity: bulletVelocity,
      });
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [addBullet, camera, state.equippedItem]);

  /* New Ref for Mesh Rotation */
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!rbRef.current) return;

    // 카메라가 보는 방향 계산 (월드 기준)
    const cameraWorldDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraWorldDirection);
    cameraWorldDirection.y = 0;
    cameraWorldDirection.normalize();

    // 카메라 오른쪽 방향 계산
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, cameraWorldDirection).normalize();

    // 입력에 따라 이동 방향(Velocity) 계산
    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(cameraWorldDirection, -state.direction.z);
    moveDirection.addScaledVector(right, -state.direction.x);

    // 현재 y 속도 가져오기
    let yVelocity = rbRef.current.linvel().y;

    // 점프 처리
    if (state.isJumping) {
      if (isOnFloor.current) {
        yVelocity = initialState.jumpForce;
        isOnFloor.current = false;
      }
      dispatch({ type: "RESET_JUMP" });
    }

    const velocity = {
      x: moveDirection.x * initialState.speed,
      y: yVelocity,
      z: moveDirection.z * initialState.speed,
    };

    rbRef.current.setLinvel(velocity, true);

    const position = rbRef.current.translation();

    // 캐릭터 메쉬 회전 처리 (이동 방향 바라보기)
    if (meshRef.current) {
      // 이동 중일 때만 회전 업데이트
      if (state.isMoving && (moveDirection.x !== 0 || moveDirection.z !== 0)) {
        // RigidBody는 회전이 잠겨있으므로, 내부 Mesh를 회전시킵니다.
        // moveDirection은 월드 기준 이동 방향입니다.
        // Local Space에서의 Target Point를 계산합니다 (RB Rotation이 Identity라고 가정).
        const lookTarget = new THREE.Vector3(
          moveDirection.x,
          0,
          moveDirection.z
        );

        // 부드러운 회전을 위해 slerp 사용
        const currentQuaternion = meshRef.current.quaternion.clone();
        meshRef.current.lookAt(lookTarget);
        const targetQuaternion = meshRef.current.quaternion.clone();

        meshRef.current.quaternion.copy(currentQuaternion); // 원래대로 돌리고
        meshRef.current.quaternion.slerp(targetQuaternion, 0.2); // 0.2 factor로 부드럽게 보간
      }
    }

    // 카메라 처리
    if (cameraMode === "FIRST_PERSON") {
      camera.position.set(position.x, position.y + 0.5, position.z);
    } else {
      // 3인칭 (PUBG 스타일)
      // 카메라는 마우스 회전(PointerLockControls) 값인 quaternion을 따릅니다.
      // 플레이어 위치를 기준으로 카메라의 quaternion 방향 '뒤쪽'으로 일정 거리만큼 떨어뜨립니다.

      const cameraDistance = 3;
      const cameraHeight = 1.6; // 캐릭터 어깨/머리 높이

      // 카메라의 후방 벡터 계산 (Z축이 후방)
      // 단, PointerLockControls가 카메라 회전을 제어하므로 camera.quaternion을 사용
      const backVector = new THREE.Vector3(0, 0, 1).applyQuaternion(
        camera.quaternion
      );

      // 타겟 위치 (플레이어) + 높이 오프셋 + 후방 거리 오프셋
      const targetPos = new THREE.Vector3(
        position.x,
        position.y + cameraHeight,
        position.z
      );
      const cameraPos = targetPos
        .clone()
        .add(backVector.multiplyScalar(cameraDistance));

      // 벽 뚫기 방지 (Raycast) 등을 추후 추가할 수 있음. 현재는 단순 거리 유지.

      camera.position.copy(cameraPos);

      // 카메라는 이미 PointerLockControls에 의해 회전이 제어되므로 lookAt을 호출할 필요가 없습니다.
      // 하지만 위치만 옮기면 됩니다.
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody
        ref={rbRef}
        lockRotations
        onCollisionEnter={() => {
          isOnFloor.current = true;
        }}
      >
        <mesh ref={meshRef}>
          <capsuleGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>
    </>
  );
}
