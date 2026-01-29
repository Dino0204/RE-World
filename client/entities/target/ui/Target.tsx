import { useState, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { useMultiplayerStore } from "@/shared/store/multiplayer";
import { useTargetStore } from "@/shared/store/target";

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
  const [currentHealth, setCurrentHealth] = useState<number>(maxHealth);
  const remoteTarget = useTargetStore((state) => state.targets.get(id));

  useEffect(() => {
    if (remoteTarget !== undefined) {
      setCurrentHealth(remoteTarget.currentHealth);
    }
  }, [id, remoteTarget]);

  const handleHit = (damage: number) => {
    setCurrentHealth((prev) => {
      const newHealth = prev - damage;
      if (newHealth <= 0) {
        console.log("Target destroyed!");
      }
      if (useMultiplayerStore.getState().isServerConnected) {
        getGameWebsocket().send({
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
