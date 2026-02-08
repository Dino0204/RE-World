import { useRef, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useBulletStore } from "../model/bullet.store";
import { useImpactStore, ImpactMaterial } from "../../impact/model/store";
import { BulletData } from "re-world-shared";

interface BulletProps {
  data: BulletData;
}

export default function Bullet({ data }: BulletProps) {
  const rbRef = useRef<RapierRigidBody>(null);
  const removeBullet = useBulletStore((state) => state.removeBullet);
  const addImpact = useImpactStore((state) => state.addImpact);

  // 총알 수명 (2초 후 제거)
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeBullet(data.id);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data.id, removeBullet]);

  useEffect(() => {
    if (rbRef.current) {
      rbRef.current.setLinvel(data.velocity, true);
    }
  }, [data.velocity]);

  return (
    <RigidBody
      ref={rbRef}
      position={[data.position.x, data.position.y, data.position.z]}
      gravityScale={0} // 중력 영향 받지 않음 (일직선 발사)
      sensor // 충돌 감지용, 물리적 반동 없음
      onIntersectionEnter={(payload) => {
        const { other } = payload;
        const userData = other.rigidBody?.userData as {
          type?: string;
          material?: ImpactMaterial;
          onHit?: (damage: number) => void;
        };

        // 원격 총알은 Impact 생성하지 않음 (발사자만 생성)
        if (rbRef.current) {
          const impactPosition = rbRef.current.translation();
          const material = userData?.material || "concrete";
          addImpact({
            id: crypto.randomUUID(),
            position: {
              x: impactPosition.x,
              y: impactPosition.y,
              z: impactPosition.z,
            },
            material,
            timestamp: Date.now(),
          });
        }

        if (
          (userData?.type === "target" || userData?.type === "player") &&
          userData.onHit
        ) {
          userData.onHit(data.damage);
        }

        removeBullet(data.id);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial
          color="yellow"
          emissive="orange"
          emissiveIntensity={2}
        />
      </mesh>
    </RigidBody>
  );
}
