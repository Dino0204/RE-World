"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const { isServerConnected } = useMultiplayerStore();
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (!active && progress === 100 && isServerConnected) {
      const timeout = setTimeout(() => setShown(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, active, isServerConnected]);

  if (!shown) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-1000 transition-opacity duration-500 bg-[radial-gradient(circle,#1a1a1a_0%,#000000_100%)] ${
        active || progress < 100
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-75 h-0.5 bg-white/10 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-white shadow-[0_0_10px_#ffffff] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <h1 className="text-white text-sm font-light tracking-[0.2em] m-0 font-sans uppercase">
        {progress < 100
          ? `${progress.toFixed(0)}% Loading Assets`
          : !isServerConnected
            ? "Connecting to Server..."
            : "Ready"}
      </h1>
    </div>
  );
}
