"use client";

import Ground from "@/entities/ground/ui/Ground";
import Player from "@/entities/player/ui";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform-3d -translate-0.5 border border-white z-20 " />
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1.5} />

        <Physics gravity={[0, -20, 0]}>
          <RigidBody>
            <mesh position={[0, 3, -5]}>
              <boxGeometry />
            </mesh>
          </RigidBody>
          <Player />
          <Ground />
        </Physics>
      </Canvas>
    </div>
  );
}
