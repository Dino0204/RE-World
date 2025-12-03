import { RigidBody } from '@react-three/rapier'

export default function Box() {
  return (
    <RigidBody>
      <mesh position={[0, 3, -5]}> <boxGeometry /> </mesh>
    </RigidBody>
  )
}
