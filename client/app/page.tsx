"use client";

import Ground from "@/entities/ground/ui";
import Target from "@/entities/target/ui/Target";
import Player from "@/entities/player/ui";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import BulletManager from "@/widgets/BulletManager/ui";
import ImpactManager from "@/widgets/ImpactManager/ui";
import LoadingScreen from "@/widgets/Loading/ui";
import MultiplayerManager from "@/widgets/Game/ui/MultiplayerManager";
import GameHUD from "@/widgets/Game/ui/GameHUD";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <LoadingScreen />
      <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform-3d -translate-0.5 border border-white z-20 " />
      <GameHUD />
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1.5} />

        <Physics gravity={[0, -20, 0]}>
          <BulletManager />
          <ImpactManager />
          <MultiplayerManager />
          <Target position={[0, -4.5, -10]} />
          <Target position={[5, -4.5, -15]} />
          <Target position={[-5, -4.5, -5]} />
          <Player />
          <Ground />
        </Physics>
      </Canvas>
    </div>
  );
}
