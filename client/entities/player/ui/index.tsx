import { useEffect, useReducer, useRef, useState } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerState, PlayerAction, CameraMode } from "../model/player";
import { useBulletStore } from "../../bullet/model/store";
import Weapon from "../../weapon/ui/weapon";
import { M416 } from "../../weapon/model/data";

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
    case "EQUIP_ITEM": {
      const isEquipped = state.equippedItems.includes(action.item);
      return {
        ...state,
        equippedItems: isEquipped
          ? state.equippedItems.filter((item) => item !== action.item)
          : [...state.equippedItems, action.item],
      };
    }
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
  equippedItems: [],
};

export default function Player() {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const { camera } = useThree();
  const controlsReference = useRef(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>("FIRST_PERSON");
  const rigidBodyReference = useRef<RapierRigidBody>(null);
  const pressedKeys = useRef(new Set<string>());
  const isPlayerGrounded = useRef(true);

  useEffect(() => {
    const updateDirection = () => {
      const keys = pressedKeys.current;
      const direction = {
        x: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
        z: (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0),
      };
      dispatch({ type: "SET_DIRECTION", direction });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.add(key);
        updateDirection();
      } else if (key === " ") {
        dispatch({ type: "JUMP" });
      } else if (key === "v") {
        setCameraMode((previousMode) =>
          previousMode === "FIRST_PERSON" ? "THIRD_PERSON" : "FIRST_PERSON"
        );
      } else if (key === "1") {
        dispatch({ type: "EQUIP_ITEM", item: M416 });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.delete(key);
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
    const handleMousePress = () => {
      if (!rigidBodyReference.current) return;
      if (!state.equippedItems.includes(M416)) return;

      const position = rigidBodyReference.current.translation();
      const cameraWorldDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraWorldDirection);

      const bulletVelocity = cameraWorldDirection.clone().multiplyScalar(20);

      const spawnPosition = new THREE.Vector3(
        position.x,
        position.y + 0.5,
        position.z
      ).add(cameraWorldDirection.clone().multiplyScalar(1.0));

      addBullet({
        id: Math.random().toString(36).substr(2, 9),
        position: spawnPosition,
        velocity: bulletVelocity,
      });
    };

    window.addEventListener("mousedown", handleMousePress);
    return () => window.removeEventListener("mousedown", handleMousePress);
  }, [addBullet, camera, state.equippedItems]);

  const meshReference = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!rigidBodyReference.current) return;

    const cameraWorldDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraWorldDirection);
    cameraWorldDirection.y = 0;
    cameraWorldDirection.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, cameraWorldDirection).normalize();

    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(cameraWorldDirection, -state.direction.z);
    moveDirection.addScaledVector(right, -state.direction.x);

    let verticalVelocity = rigidBodyReference.current.linvel().y;

    if (state.isJumping) {
      if (isPlayerGrounded.current) {
        verticalVelocity = initialState.jumpForce;
        isPlayerGrounded.current = false;
      }
      dispatch({ type: "RESET_JUMP" });
    }

    const velocity = {
      x: moveDirection.x * initialState.speed,
      y: verticalVelocity,
      z: moveDirection.z * initialState.speed,
    };

    rigidBodyReference.current.setLinvel(velocity, true);

    const position = rigidBodyReference.current.translation();

    if (meshReference.current) {
      if (state.isMoving && (moveDirection.x !== 0 || moveDirection.z !== 0)) {
        const lookTarget = new THREE.Vector3(
          moveDirection.x,
          0,
          moveDirection.z
        );

        const currentQuaternion = meshReference.current.quaternion.clone();
        meshReference.current.lookAt(lookTarget);
        const targetQuaternion = meshReference.current.quaternion.clone();

        meshReference.current.quaternion.copy(currentQuaternion);
        meshReference.current.quaternion.slerp(targetQuaternion, 0.2);
      }
    }

    if (cameraMode === "FIRST_PERSON") {
      camera.position.set(position.x, position.y + 0.5, position.z);
    } else {
      const cameraDistance = 3;
      const cameraHeight = 1.6;

      const backVector = new THREE.Vector3(0, 0, 1).applyQuaternion(
        camera.quaternion
      );

      const targetPosition = new THREE.Vector3(
        position.x,
        position.y + cameraHeight,
        position.z
      );
      const cameraPosition = targetPosition
        .clone()
        .add(backVector.multiplyScalar(cameraDistance));

      camera.position.copy(cameraPosition);
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsReference} />
      <RigidBody
        ref={rigidBodyReference}
        lockRotations
        onCollisionEnter={() => {
          isPlayerGrounded.current = true;
        }}
      >
        <mesh ref={meshReference}>
          <capsuleGeometry args={[0.5, 0.5]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
        {state.equippedItems.length > 0 && (
          <Weapon cameraMode={cameraMode} weapon={state.equippedItems[0]} />
        )}
      </RigidBody>
    </>
  );
}
