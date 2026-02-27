import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function PortGround() {
  const { scene } = useGLTF("/models/chicken_gun_portbase.glb");

  return (
    <RigidBody
      type="fixed"
      colliders={"trimesh"}
      userData={{ material: "concrete" }}
    >
      <primitive object={scene} />
    </RigidBody>
  );
}
