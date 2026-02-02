"use client";

import { useState } from "react";
import { User, Settings, Play, Plus, MapPin, Signal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/shared/store/room";
import { requestJoinRoom } from "@/shared/api/gameSocket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

export default function Lobby() {
  const router = useRouter();
  const { setCurrentRoom, setIsJoining, setError } = useRoomStore();
  const [selectedMode, setSelectedMode] = useState("SOLO");
  const [activeTab, setActiveTab] = useState("PLAY");

  const navItems = ["PLAY", "CUSTOMIZE", "ARMORY", "RECORDS", "SYSTEM"];

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
    <div className="relative w-full h-screen bg-brand-beige text-brand-charcoal overflow-hidden font-mono select-none flex flex-col">
      {/* 1. Background Layer (No iframe) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,53,47,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,53,47,0.05)_1px,transparent_1px)] bg-size-[4px_4px]"></div>
        {/* Vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--color-brand-beige-dark)_100%)] opacity-40"></div>
        {/* Fine Grain Texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      {/* 2. Top Decorative Bar */}
      <div className="relative z-20 w-full h-16 border-b-2 border-brand-beige-dark flex items-center px-8 justify-between bg-brand-beige/80 backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex items-end h-full gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`
                     relative px-6 h-10 flex items-center justify-center text-xs tracking-widest transition-all duration-300 font-bold group
                     ${activeTab === item ? "bg-brand-charcoal text-brand-beige" : "bg-brand-beige-mid text-brand-charcoal-light hover:bg-brand-beige-hover hover:text-brand-charcoal"}
                  `}
            >
              {/* Decorative square */}
              <div
                className={`absolute top-1 left-1 w-1 h-1 transition-colors ${activeTab === item ? "bg-brand-beige" : "bg-brand-charcoal-light group-hover:bg-brand-charcoal"}`}
              ></div>
              {item}
            </button>
          ))}
        </div>

        {/* Top Right Info */}
        <div className="flex items-center gap-4 text-xs font-bold text-brand-charcoal-muted">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-charcoal rounded-full animate-pulse"></div>{" "}
            ONLINE
          </span>
          <span className="opacity-30 mx-2">|</span>
          <span>VER. 9.02.4</span>
        </div>
      </div>

      {/* 3. Main Layout Grid */}
      <div className="relative z-10 flex-1 p-10 grid grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="col-span-3 flex flex-col justify-between h-full">
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
        </div>

        {/* CENTER COLUMN: Character & Title */}
        <div className="col-span-6 relative flex flex-col items-center justify-center">
          {/* Big Title behind character */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-brand-beige-light tracking-tighter whitespace-nowrap pointer-events-none z-0 mix-blend-multiply opacity-60">
            ODYSSEY
          </div>

          <div className="relative z-10 h-[85%] w-full flex justify-center items-end">
            {/* Character Image with blend mode for beige bg */}

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
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-3 flex flex-col justify-between h-full gap-6">
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
        </div>
      </div>

      {/* 4. Bottom Decorative Bar */}
      <div className="relative z-20 w-full h-12 border-t-2 border-brand-beige-dark bg-brand-beige-mid/50 flex items-center justify-center backdrop-blur-sm">
        {/* Decorative Pattern Line on Top */}
        <div className="absolute top-[-6px] left-0 w-full h-[6px] flex overflow-hidden opacity-40">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 border-l border-b border-brand-charcoal transform rotate-45 -translate-y-[6px] shrink-0 mx-[2px]"
            ></div>
          ))}
        </div>

        <div className="text-[10px] text-brand-charcoal-muted tracking-[1em] font-bold opacity-80">
          FOR THE GLORY OF MANKIND
        </div>
      </div>
    </div>
  );
}
