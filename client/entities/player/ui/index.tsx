import { useEffect, useReducer, useRef, useState } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { PlayerState, PlayerAction, CameraMode } from "../model/player";
import { useBulletStore } from "../../bullet/model/store";
import Weapon from "../../weapon/ui/weapon";
import { M416, WEAPONS } from "../../weapon/model/data";

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
  const recoilPatternIndex = useRef(0);
  const lastShotTimestamp = useRef(0);
  const recoilRecoveryOffset = useRef({ x: 0, y: 0 });
  const pendingRecoil = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);

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
    const handleMouseDown = () => {
      isMouseDown.current = true;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const meshReference = useRef<THREE.Mesh>(null);

  useFrame((threeState) => {
    if (!rigidBodyReference.current) return;

    const now = Date.now();
    if (now - lastShotTimestamp.current > 500) {
      recoilPatternIndex.current = 0;
    }

    // 연사 로직
    const currentWeapon = state.equippedItems[0];
    if (currentWeapon) {
      const shootInterval = 60000 / currentWeapon.fireRate;
      if (
        isMouseDown.current &&
        now - lastShotTimestamp.current >= shootInterval
      ) {
        const position = rigidBodyReference.current.translation();
        const cameraWorldDirection = new THREE.Vector3();
        threeState.camera.getWorldDirection(cameraWorldDirection);

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

        // 반동 계산
        const recoilConfig = currentWeapon.recoil;
        const pattern =
          recoilConfig.pattern[recoilPatternIndex.current] ||
          recoilConfig.pattern[recoilConfig.pattern.length - 1];

        const verticalKick = recoilConfig.vertical + pattern.y;
        const horizontalKick =
          (Math.random() - 0.5) * recoilConfig.horizontal + pattern.x;

        pendingRecoil.current.x += horizontalKick;
        pendingRecoil.current.y += verticalKick;

        recoilPatternIndex.current += 1;
        lastShotTimestamp.current = now;
      }
    }

    // 반동 적용
    if (pendingRecoil.current.x !== 0 || pendingRecoil.current.y !== 0) {
      if (currentWeapon) {
        const recoilConfig = currentWeapon.recoil;

        // 현재 적용되어 있는 반동 오프셋 확인
        const currentHorizontalRecoil = recoilRecoveryOffset.current.x;
        const currentVerticalRecoil = recoilRecoveryOffset.current.y;

        // 추가될 반동이 최대치를 넘지 않도록 제한
        let kickX = pendingRecoil.current.x;
        let kickY = pendingRecoil.current.y;

        if (currentVerticalRecoil + kickY > recoilConfig.maxVertical) {
          kickY = Math.max(0, recoilConfig.maxVertical - currentVerticalRecoil);
        }

        if (
          Math.abs(currentHorizontalRecoil + kickX) > recoilConfig.maxHorizontal
        ) {
          const targetX =
            Math.sign(currentHorizontalRecoil + kickX) *
            recoilConfig.maxHorizontal;
          kickX = targetX - currentHorizontalRecoil;
        }

        threeState.camera.rotation.x += kickY;
        threeState.camera.rotation.y += kickX;

        recoilRecoveryOffset.current.x += kickX;
        recoilRecoveryOffset.current.y += kickY;
      }

      pendingRecoil.current.x = 0;
      pendingRecoil.current.y = 0;
    }

    // 반동 복구 로직
    if (now - lastShotTimestamp.current > 100) {
      const recoveryFactor = 0.1;
      const recoverX = recoilRecoveryOffset.current.x * recoveryFactor;
      const recoverY = recoilRecoveryOffset.current.y * recoveryFactor;

      threeState.camera.rotation.x -= recoverY;
      threeState.camera.rotation.y -= recoverX;

      recoilRecoveryOffset.current.x -= recoverX;
      recoilRecoveryOffset.current.y -= recoverY;

      // 미세한 오차 제거
      if (Math.abs(recoilRecoveryOffset.current.x) < 0.001)
        recoilRecoveryOffset.current.x = 0;
      if (Math.abs(recoilRecoveryOffset.current.y) < 0.001)
        recoilRecoveryOffset.current.y = 0;
    }

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
        {WEAPONS.map((weapon) => (
          <Weapon
            key={weapon.name}
            cameraMode={cameraMode}
            weapon={weapon}
            visible={state.equippedItems.some(
              (item) => item.name === weapon.name
            )}
          />
        ))}
      </RigidBody>
    </>
  );
}
