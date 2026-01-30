"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import LobbyGround from "@/widgets/Ground/ui/lobby";
import { requestJoinRoom } from "@/shared/api/gameSocket";
import { useRoomStore } from "@/shared/store/room";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

type ButtonState = "idle" | "loading" | "error";

const BUTTON_STATE_LABELS: Record<ButtonState, string> = {
  idle: "게임 시작",
  loading: "방 찾는 중...",
  error: "다시 시도",
};

export default function Lobby() {
  const router = useRouter();
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setCurrentRoom, setIsJoining, setError } = useRoomStore();

  const handleGameStart = async () => {
    if (buttonState === "loading") return;

    setButtonState("loading");
    setErrorMessage(null);
    setIsJoining(true);

    try {
      // 룸 참여 요청
      const response = await requestJoinRoom(SESSION_IDENTIFIER);
      
      if (response.success) {
        // 룸 정보 저장
        setCurrentRoom({
          id: response.roomId,
          playerCount: response.playerCount,
          maxPlayers: response.maxPlayers,
          createdAt: Date.now(),
        });
        
        console.log(`룸 참여 성공: ${response.roomId} (${response.playerCount}/${response.maxPlayers})`);
        
        // 게임 화면으로 이동
        router.push("/");
      } else {
        throw new Error("룸 참여에 실패했습니다");
      }
    } catch (error) {
      console.error("룸 참여 오류:", error);
      const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다";
      setErrorMessage(message);
      setError(message);
      setButtonState("error");
    }
  };

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1.5} />
        <LobbyGround />
      </Canvas>

      <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-2">
        {errorMessage && (
          <div className="px-4 py-2 text-sm text-red-400 bg-red-900/50 border border-red-500/30 rounded-lg">
            {errorMessage}
          </div>
        )}
        <button
          onClick={handleGameStart}
          disabled={buttonState === "loading"}
          className={`px-8 py-4 text-lg font-bold cursor-pointer text-white uppercase tracking-wider
            bg-black/60 border-2 rounded-lg
            transition-all duration-200 ease-out shadow-lg
            ${buttonState === "error" 
              ? "border-red-500/50 hover:bg-red-900/30" 
              : "border-white/30 hover:bg-white/20 hover:border-white/50"}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {BUTTON_STATE_LABELS[buttonState]}
        </button>
      </div>
    </div>
  );
}