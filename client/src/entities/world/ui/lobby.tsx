export default function LobbyGround() {
  return (
    <group>
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <gridHelper
        args={[500, 500, "#ffffff", "#888888"]}
        position={[0, -5, 0]}
      />
    </group>
  );
}
