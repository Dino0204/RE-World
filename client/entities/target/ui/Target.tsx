import { useState } from "react";
import { RigidBody } from "@react-three/rapier"; // Assuming RigidBody should be imported from here

interface TargetProps {
  position: [number, number, number];
}

export default function Target({ position }: TargetProps) {
  const [hitColor, setHitColor] = useState<string>("red");

  const handleHit = () => {
    setHitColor("white");
    setTimeout(() => {
      setHitColor("red");
    }, 100);
  };

  return (
    <RigidBody
      position={position}
      type="fixed"
      colliders="cuboid"
      userData={{ type: "target", onHit: handleHit }}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hitColor} />
      </mesh>
    </RigidBody>
  );
}
