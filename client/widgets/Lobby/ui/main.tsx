"use client";

import SignIn from "@/features/signin/ui";
import { requestJoinRoom } from "@/shared/api/socket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useRoomStore } from "@/shared/store/room";
import { useMovableContainer } from "@/shared/store/useMovableStore";
import { MovableWindow } from "@/shared/ui/movableWindow";
import { MapPin, Play, Plus, Settings, Signal, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Main = () => {
  const router = useRouter();
  const { setCurrentRoom, setIsJoining, setError } = useRoomStore();
  const [selectedMode, setSelectedMode] = useState("SOLO");
  const { handleMouseMove, handleMouseUp, handleMouseLeave } =
    useMovableContainer();

  const handleGameStart = async () => {
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

        console.log(
          `룸 참여 성공: ${response.roomId} (${response.playerCount}/${response.maxPlayers})`,
        );

        // 게임 화면으로 이동
        router.push("/game");
      } else {
        throw new Error("룸 참여에 실패했습니다");
      }
    } catch (error) {
      console.error("룸 참여 오류:", error);
      const message =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다";
      setError(message);
    }
  };

  return (
    <div
      className="relative z-10 flex-1 p-10 grid grid-cols-12 gap-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <MovableWindow id="signin-window">
        <div className="bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-1 shadow-sm group backdrop-blur-sm">
          <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
            <span>Authorize</span>
          </div>
          <div className="flex flex-col py-20 px-4">
            <SignIn />
          </div>
        </div>
      </MovableWindow>

      {/* LEFT COLUMN */}
      <section className="col-span-3 flex flex-col justify-between h-full">
        {/* Match Config Card */}
        <div className="bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-1 shadow-sm group backdrop-blur-sm">
          <div className="bg-brand-charcoal text-brand-beige px-3 py-1 text-xs font-bold tracking-widest mb-1 flex justify-between">
            <span>MATCH_CONFIG</span>
            <Settings size={12} />
          </div>
          <div className="p-4 space-y-6">
            {/* Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-brand-charcoal-light tracking-[0.2em] uppercase font-bold">
                Operation Mode
              </label>
              <div className="flex flex-col gap-1">
                {["SOLO", "DUO", "SQUAD"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={`
                        text-left px-3 py-2 text-sm border-l-4 transition-all flex justify-between items-center font-bold
                        ${selectedMode === mode ? "border-brand-charcoal bg-brand-beige-hover text-brand-charcoal" : "border-transparent text-brand-charcoal-light hover:bg-brand-beige-hover/50"}
                      `}
                  >
                    {mode}
                    {selectedMode === mode && (
                      <div className="w-1.5 h-1.5 bg-brand-charcoal"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Info */}
            <div className="pt-4 border-t border-brand-beige-dark">
              <div className="flex items-center justify-between text-xs text-brand-charcoal-muted mb-2 font-bold">
                <span className="flex items-center gap-2 text-brand-charcoal-muted">
                  <MapPin size={12} /> REGION
                </span>
                <span>TOKYO_03</span>
              </div>
              <div className="flex items-center justify-between text-xs text-brand-charcoal-muted font-bold">
                <span className="flex items-center gap-2">
                  <Signal size={12} /> LATENCY
                </span>
                <span className="text-brand-charcoal">12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left: Start Button */}
        <button
          onClick={handleGameStart}
          className="cursor-pointer bg-brand-charcoal text-brand-beige p-6 text-left group hover:bg-brand-charcoal-dark transition-all relative overflow-hidden shadow-lg border-2 border-brand-charcoal"
        >
          <div className="absolute top-4 right-4 text-[#D9D3C1]">
            <Play size={20} fill="#D9D3C1" />
          </div>
          <div className="text-[10px] tracking-[0.3em] mb-2 opacity-70">
            INIT_SEQUENCE
          </div>
          <div className="text-5xl font-bold tracking-tighter">START</div>
          <div className="text-sm mt-2 font-bold opacity-70">SESSION_09</div>

          {/* Decorative Loading Bar */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-brand-charcoal-dark">
            <div className="h-full bg-brand-beige w-[40%] group-hover:w-full transition-all duration-1000 ease-in-out"></div>
          </div>
        </button>
      </section>

      {/* CENTER COLUMN: Character & Title */}
      <section className="col-span-6 relative flex flex-col items-center justify-center">
        {/* Big Title behind character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-brand-beige-light tracking-tighter whitespace-nowrap pointer-events-none z-0 mix-blend-multiply opacity-60">
          ODYSSEY
        </div>

        {/* Character Image with blend mode for beige bg */}
        <div className="relative z-10 h-[85%] w-full flex justify-center items-end">
          {/* Name Plate */}
          <div className="absolute bottom-12 right-12 text-right">
            <div className="text-5xl font-black tracking-widest text-brand-charcoal">
              VANTAGE
            </div>
            <div className="text-xs bg-brand-charcoal text-brand-beige inline-block px-3 py-1 font-bold tracking-[0.2em] mt-2 shadow-lg">
              LVL. 99
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN */}
      <section className="col-span-3 flex flex-col justify-between h-full gap-6">
        {/* Top Right: Player Profile */}
        <div className="bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-4 flex gap-4 items-center shadow-sm backdrop-blur-sm">
          <div className="w-16 h-16 bg-brand-beige-dark flex items-center justify-center border border-brand-beige-deep">
            <User size={28} className="text-brand-charcoal" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-brand-charcoal-light tracking-widest mb-1 border-b border-brand-beige-dark pb-1 font-bold">
              OPERATOR
            </div>
            <div className="text-xl font-bold text-brand-charcoal truncate">
              Ghost_Actual
            </div>
            <div className="text-xs text-brand-charcoal-muted mt-1 font-bold">
              BP: 15,390
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Bottom Right: Status Card */}
        <div className="bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-1 shadow-sm backdrop-blur-sm">
          <div className="bg-brand-charcoal-light text-brand-beige px-3 py-1 text-xs font-bold tracking-widest mb-1">
            UNIT_STATUS
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-brand-charcoal-light">K/D RATIO</span>
              <span className="text-brand-charcoal">2.45</span>
            </div>
            <div className="w-full h-px bg-brand-beige-dark"></div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-brand-charcoal-light">WIN RATE</span>
              <span className="text-brand-charcoal">12.5%</span>
            </div>
            <div className="w-full h-px bg-brand-beige-dark"></div>

            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-[10px] text-brand-charcoal-light font-bold">
                <span>SYNC</span>
                <span>98%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-beige-dark">
                <div className="h-full bg-brand-charcoal w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Squad List */}
        <div className="border-2 border-brand-beige-dark border-dashed p-4 flex justify-between items-center bg-brand-beige-mid/30">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-brand-charcoal border-2 border-brand-beige"></div>
            <div className="w-10 h-10 rounded-full bg-brand-beige-dark border-2 border-brand-beige flex items-center justify-center text-brand-charcoal hover:bg-brand-beige-hover cursor-pointer transition-colors">
              <Plus size={16} />
            </div>
          </div>
          <span className="text-xs text-brand-charcoal font-bold tracking-widest">
            SQUAD: 1/4
          </span>
        </div>
      </section>
    </div>
  );
};
