import { useState } from "react";
import { RigidBody } from "@react-three/rapier"; // Assuming RigidBody should be imported from here

interface TargetProps {
  position: [number, number, number];
}

export default function Target({ position }: TargetProps) {
  const [hitColor, setHitColor] = useState<string>("red");
  const [currentHealth, setCurrentHealth] = useState<number>(100);

  const handleHit = (damage: number) => {
    setCurrentHealth((prev) => {
      const newHealth = prev - damage;
      if (newHealth <= 0) {
        console.log("Target destroyed!");
        // 여기에서 파괴 로직 추가 (예: visible state 변경 등)
      }
      return newHealth;
    });

    setHitColor("white");
    setTimeout(() => {
      setHitColor("red");
    }, 100);
  };

  if (currentHealth <= 0) return null; // 파괴되면 렌더링 안 함

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
