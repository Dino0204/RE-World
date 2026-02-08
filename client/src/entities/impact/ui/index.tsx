import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useImpactStore } from "../model/store";
import { ImpactData } from "../model/impact";

interface ImpactEffectProps {
  data: ImpactData;
}

export default function ImpactEffect({
  data,
}: ImpactEffectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 20;
  const removeImpact = useImpactStore((state) => state.removeImpact);

  // Impact 수명 (1초 후 제거)
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeImpact(data.id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [data.id, removeImpact]);

  const color = useMemo(() => {
    switch (data.material) {
      case "concrete":
        return new THREE.Color("#d3d3d3");
      case "wood":
        return new THREE.Color("#8b4513");
      case "metal":
        return new THREE.Color("#ffa500");
      case "dirt":
        return new THREE.Color("#556b2f");
      default:
        return new THREE.Color("#ffffff");
    }
  }, [data.material]);

  const velocities = useRef(new Float32Array(particleCount * 3));
  const initialPositions = useMemo(
    () => new Float32Array(particleCount * 3),
    [],
  );

  useEffect(() => {
    const vels = velocities.current;
    for (let i = 0; i < particleCount; i++) {
      vels[i * 3] = (Math.random() - 0.5) * 2;
      vels[i * 3 + 1] = Math.random() * 2 + 0.5;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const vels = velocities.current;

    if (!(pointsRef.current.material instanceof THREE.PointsMaterial)) return;
    const pointsMaterial = pointsRef.current.material;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += vels[i * 3] * delta;
      positions[i * 3 + 1] += vels[i * 3 + 1] * delta;
      positions[i * 3 + 2] += vels[i * 3 + 2] * delta;

      vels[i * 3 + 1] -= 5 * delta;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    if (pointsMaterial.opacity > 0) {
      pointsMaterial.opacity -= 1.5 * delta;
    }
  });

  return (
    <points ref={pointsRef} position={[data.position.x, data.position.y, data.position.z]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={color}
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
