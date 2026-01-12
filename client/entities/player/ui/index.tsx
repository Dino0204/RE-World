import { useEffect, useReducer, useRef, useState } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerState, PlayerAction, CameraMode } from "../model/player";

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

  useFrame(() => {
    if (!rbRef.current) return;

    // 카메라가 보는 방향 계산
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // 카메라 오른쪽 방향 계산
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // 입력에 따라 이동 방향 계산
    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(direction, -state.direction.z);
    moveDirection.addScaledVector(right, -state.direction.x);

    // 현재 y 속도 가져오기
    let yVelocity = rbRef.current.linvel().y;

    // 점프 처리
    if (state.isJumping) {
      if (isOnFloor.current) {
        // 바닥에 있으면 점프 실행
        yVelocity = initialState.jumpForce;
        isOnFloor.current = false;
      }
      // 바닥에 있든 없든 점프 입력 소비 (공중 점프 입력 무시)
      dispatch({ type: "RESET_JUMP" });
    }

    const velocity = {
      x: moveDirection.x * initialState.speed,
      y: yVelocity,
      z: moveDirection.z * initialState.speed,
    };

    rbRef.current.setLinvel(velocity, true);

    // 카메라를 플레이어 위치로 이동 (1인칭 시점)
    const position = rbRef.current.translation();
    if (cameraMode === "FIRST_PERSON") {
      camera.position.set(position.x, position.y + 0.5, position.z);
    } else {
      camera.position.set(position.x + 5, position.y + 5, position.z);
      camera.lookAt(position.x, position.y + 0.5, position.z);
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
        <mesh>
          <capsuleGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>
    </>
  );
}
