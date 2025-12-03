"use client"

import Map from "@/components/Map";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform-3d -translate-0.5 border border-white z-20 " />
      <Canvas>
        <Map />
      </Canvas>
    </div>
  );
}
