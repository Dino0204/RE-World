"use client";

import FlatGround from "@/entities/world/ui/flat";
import Target from "@/entities/target/ui/target";
import Player from "@/entities/player/ui/player";
import { Sky, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import BulletManager from "@/entities/bullet/ui/bullet.manager";
import ImpactManager from "@/entities/impact/ui/impact.manager";
import LoadingScreen from "@/shared/ui/loading";
import MultiplayerManager from "@/entities/multi-player/ui/multi-player.manager";
import GameHUD from "@/widgets/game/ui/hud";
import { useEffect, useRef } from "react";
import { requestJoinRoom } from "@/entities/room/api/room";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useSocketStore } from "@/shared/model/socket.store";
import { InventoryHUD } from "@/features/inventory/ui/inventory-hud";
import { Minimap } from "@/widgets/minimap/ui/minimap";

export default function GamePage() {
  const container = useRef<HTMLDivElement>(null!);
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    const handleGameConnect = async () => {
      connect();
      await requestJoinRoom(SESSION_IDENTIFIER);
    };
    handleGameConnect();
  }, [connect]);

  return (
    <div className="w-screen h-screen" ref={container}>
      <LoadingScreen />
      <GameHUD />
      <InventoryHUD />

      {/* game view */}
      <View className="absolute inset-0">
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
      </View>

      {/* mini-map */}
      <View className="absolute w-100 h-100 top-5 left-5 z-10 shadow-2xl">
        <Minimap />
      </View>

      <Canvas
        // style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
        gl={{ alpha: true }}
        eventSource={container}
      >
        <View.Port />
      </Canvas>
    </div>
  );
}
