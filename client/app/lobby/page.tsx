"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import LobbyGround from "@/widgets/Ground/ui/lobby";

type ButtonState = "idle" | "loading";

const BUTTON_STATE_LABELS: Record<ButtonState, string> = {
  idle: "게임 시작",
  loading: "로딩 중...",
};

export default function Lobby() {
  const router = useRouter();
  const [buttonState, setButtonState] = useState<ButtonState>("idle");

  const handleGameStart = () => {
    if (buttonState === "loading") return;

    setButtonState("loading");
    router.push("/");
  };

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1.5} />
        <LobbyGround />
      </Canvas>

      <button
        onClick={handleGameStart}
        disabled={buttonState === "loading"}
        className="fixed bottom-6 left-6 z-30 px-8 py-4 text-lg font-bold cursor-pointer text-white uppercase tracking-wider
          bg-black/60 border-2 border-white/30 rounded-lg
          hover:bg-white/20 hover:border-white/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 ease-out
          shadow-lg"
      >
        {BUTTON_STATE_LABELS[buttonState]}
      </button>
    </div>
  );
}