import { useRef, useEffect } from "react";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useBulletStore, BulletData } from "../model/store";

interface BulletProps {
  data: BulletData;
}

export default function Bullet({ data }: BulletProps) {
  const rbRef = useRef<RapierRigidBody>(null);
  const removeBullet = useBulletStore((state) => state.removeBullet);

  useEffect(() => {
    // 총알 수명 (2초 후 제거)
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
      sensor // 충돌 감지롱, 물리적 반동 없음 (필요시 변경)
      onIntersectionEnter={(payload) => {
        // 추후 충돌 처리 로직 추가 가능
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
