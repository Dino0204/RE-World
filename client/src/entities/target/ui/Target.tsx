import { useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useSocketStore } from "@/shared/model/socket.store";

import { useTargetStore } from "@/entities/target/model/target.store";

interface TargetProps {
  id: string;
  position: [number, number, number];
  maxHealth?: number;
}

const DEFAULT_MAX_HEALTH = 100;

export default function Target({
  id,
  position,
  maxHealth = DEFAULT_MAX_HEALTH,
}: TargetProps) {
  const [hitColor, setHitColor] = useState<string>("red");
  const [localHealth, setLocalHealth] = useState<number>(maxHealth);
  const remoteTarget = useTargetStore((state) => state.targets.get(id));

  const currentHealth =
    remoteTarget !== undefined ? remoteTarget.currentHealth : localHealth;

  const handleHit = (damage: number) => {
    setLocalHealth((prev) => {
      const newHealth = prev - damage;
      if (newHealth <= 0) {
        console.log("Target destroyed!");
      }
      if (useSocketStore.getState().isConnected) {
        useSocketStore.getState().gameWebsocket?.send({
          type: "TARGET",
          data: {
            id,
            currentHealth: newHealth,
            maxHealth,
            type: "target" as const,
          },
        });
      }
      return newHealth;
    });

    setHitColor("white");
    setTimeout(() => {
      setHitColor("red");
    }, 100);
  };

  if (currentHealth <= 0) return null;

  return (
    <RigidBody
      position={position}
      type="fixed"
      colliders="cuboid"
      userData={{ type: "target", onHit: handleHit, material: "wood" }}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hitColor} />
      </mesh>
    </RigidBody>
  );
}
