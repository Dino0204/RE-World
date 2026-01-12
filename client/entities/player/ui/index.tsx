import { useEffect, useReducer, useRef } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerState, PlayerAction } from "../model/player";

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
    default:
      return state;
  }
};

const initialState: PlayerState = {
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
};

export default function Player() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const rbRef = useRef<RapierRigidBody>(null);
  const keysPressed = useRef(new Set<string>());

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

    const speed = 5;

    // 카메라가 보는 방향 계산
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // y축 제거 (수평 이동만)
    direction.normalize();

    // 카메라 오른쪽 방향 계산
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // 입력에 따라 이동 방향 계산
    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(direction, -state.direction.z); // 앞/뒤
    moveDirection.addScaledVector(right, -state.direction.x); // 좌/우

    const velocity = {
      x: moveDirection.x * speed,
      y: rbRef.current.linvel().y, // 기존 y 속도 유지 (중력)
      z: moveDirection.z * speed,
    };

    rbRef.current.setLinvel(velocity, true);

    // 카메라를 플레이어 위치로 이동 (1인칭 시점)
    const position = rbRef.current.translation();
    camera.position.set(position.x, position.y + 0.5, position.z); // 캡슐 중간 높이
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody ref={rbRef} lockRotations>
        <mesh>
          <capsuleGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>
    </>
  );
}
