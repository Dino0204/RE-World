import { useEffect, useReducer, useRef } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

// TODO: Player의 상태 타입 정의
interface PlayerState {
  // 예: isMoving, direction, velocity 등
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  velocity: { x: number; y: number; z: number };
}

// TODO: Player의 액션 타입 정의
type PlayerAction =
  | { type: 'MOVE_FORWARD' }
  | { type: 'MOVE_BACKWARD' }
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'JUMP' }
  | { type: 'STOP' };

// 다른 액션들 추가...

// TODO: Reducer 함수 구현
const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  // console.log(action.type);
  switch (action.type) {
    case 'MOVE_FORWARD':
      return {
        ...state,
        isMoving: true,
        direction: {
          ...state.direction,
          z: -1  // 앞으로 (z축 음수)
        }
      };
    case 'MOVE_BACKWARD':
      return {
        ...state,
        isMoving: true,
        direction: {
          ...state.direction,
          z: 1  // 뒤로 (z축 양수)
        }
      };
    case 'MOVE_LEFT':
      return {
        ...state,
        isMoving: true,
        direction: {
          ...state.direction,
          x: -1  // 왼쪽 (x축 음수)
        }
      };
    case 'MOVE_RIGHT':
      return {
        ...state,
        isMoving: true,
        direction: {
          ...state.direction,
          x: 1  // 오른쪽 (x축 양수)
        }
      };
    case 'JUMP':
      return {
        ...state,
        isJumping: true
      };
    case 'STOP':
      return {
        ...state,
        isMoving: false,
        direction: { x: 0, z: 0 }
      };
    default:
      return state;
  }
}

// TODO: 초기 상태 정의
const initialState: PlayerState = {
  // 초기값 설정
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
};

export default function Player() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const rbRef = useRef<RapierRigidBody>(null);
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // TODO: 키보드 입력 처리 (useEffect + addEventListener)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // console.log(event.key);
      switch (event.key) {
        case 'w':
          dispatch({ type: 'MOVE_FORWARD' });
          break;
        case 's':
          dispatch({ type: 'MOVE_BACKWARD' });
          break;
        case 'a':
          dispatch({ type: 'MOVE_LEFT' });
          break;
        case 'd':
          dispatch({ type: 'MOVE_RIGHT' });
          break;
        case ' ':
          dispatch({ type: 'JUMP' });
          break;
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (['w', 's', 'a', 'd', ' '].includes(event.key)) {
        dispatch({ type: 'STOP' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [])

  // TODO: 물리 업데이트 (useFrame)
  useFrame(() => {
    if (!rbRef.current) return;

    const speed = 5;

    // 카메라가 보는 방향 계산
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;  // y축 제거 (수평 이동만)
    direction.normalize();

    // 카메라 오른쪽 방향 계산
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // 입력에 따라 이동 방향 계산
    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(direction, -state.direction.z);  // 앞/뒤
    moveDirection.addScaledVector(right, -state.direction.x);  // 좌/우

    const velocity = {
      x: moveDirection.x * speed,
      y: rbRef.current.linvel().y,  // 기존 y 속도 유지 (중력)
      z: moveDirection.z * speed
    };

    rbRef.current.setLinvel(velocity, true);

    // 카메라를 플레이어 위치로 이동 (1인칭 시점)
    const position = rbRef.current.translation();
    camera.position.set(position.x, position.y + 0.5, position.z);  // 캡슐 중간 높이
  })

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
  )
}
