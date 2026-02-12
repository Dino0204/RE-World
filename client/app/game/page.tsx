"use client";

import FlatGround from "@/entities/world/ui/flat";
import Target from "@/entities/target/ui/target";
import Player from "@/entities/player/ui/player";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import BulletManager from "@/entities/bullet/ui/bullet.manager";
import ImpactManager from "@/entities/impact/ui/impact.manager";
import LoadingScreen from "@/shared/ui/loading";
import MultiplayerManager from "@/entities/multi-player/ui/multi-player.manager";
import GameHUD from "@/widgets/game/ui/hud";

export default function GamePage() {
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
          <Target id="target-1" position={[0, -4.5, -10]} />
          <Target id="target-2" position={[5, -4.5, -15]} />
          <Target id="target-3" position={[-5, -4.5, -5]} />
          <Player />
          <FlatGround />
        </Physics>
      </Canvas>
    </div>
  );
}
