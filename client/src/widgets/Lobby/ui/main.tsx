"use client";

import SignIn from "@/features/signin/ui";
import SignOut from "@/features/signout/ui";
import { useRoomStore } from "@/entities/room/model/room.store";
import { useMovableContainer } from "@/features/movable-window/model/useMovableStore";
import { MovableWindow } from "@/features/movable-window/ui";
import { Play, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useUserStore } from "@/entities/user/model/user.store";
import { api } from "@/shared/api/server";
import Image from "next/image";

export const Main = () => {
  const router = useRouter();
  const { setIsJoining } = useRoomStore();
  const { name, picture, setUser } = useUserStore();
  const { handleMouseMove, handleMouseUp, handleMouseLeave, setContainerRef } =
    useMovableContainer();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContainerRef(containerRef);
  }, [setContainerRef]);

  useEffect(() => {
    api.auth.me.get().then(({ data }) => {
      if (data?.success && data.user) {
        setUser(
          data.user as {
            id: string;
            name: string;
            email: string;
            picture: string;
          },
        );
      }
    });
  }, [setUser]);

  const handleGameStart = async () => {
    setIsJoining(true);
    router.push("/game");
  };

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex-1 p-10 grid grid-cols-12 gap-8"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <MovableWindow id="signin-window">
        <div className="bg-brand-beige-mid/40 p-1 shadow-sm group backdrop-blur-sm">
          <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
            <span>Authorize</span>
          </div>
          <div className="flex flex-col py-20 px-4">
            <SignIn />
            <SignOut />
          </div>
        </div>
      </MovableWindow>

      {/* LEFT COLUMN */}
      <section className="col-span-3 flex flex-col justify-end h-full">
        {/* Bottom Left: Start Button */}
        <button
          onClick={handleGameStart}
          className="cursor-pointer bg-brand-charcoal text-brand-beige p-6 text-left group hover:bg-brand-charcoal-dark transition-all relative overflow-hidden shadow-lg border-2 border-brand-charcoal"
        >
          <div className="absolute top-4 right-4 text-[#D9D3C1]">
            <Play size={20} fill="#D9D3C1" />
          </div>
          <div className="text-5xl font-bold tracking-tighter">START</div>

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
        <div className="relative z-10 h-[85%] w-full flex justify-center items-end"></div>
      </section>

      {/* RIGHT COLUMN */}
      <section className="col-span-3 flex flex-col justify-start h-full gap-6">
        {/* Top Right: Player Profile */}
        <div className="bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-4 flex gap-4 items-center shadow-sm backdrop-blur-sm">
          <div className="relative w-16 h-16 bg-brand-beige-dark flex items-center justify-center border border-brand-beige-deep overflow-hidden">
            {picture ? (
              <Image
                src={picture}
                alt="profile"
                className="w-full h-full object-cover"
                fill
              />
            ) : (
              <User size={28} className="text-brand-charcoal" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-brand-charcoal-light tracking-widest mb-1 border-b border-brand-beige-dark pb-1 font-bold">
              OPERATOR
            </div>
            <div className="text-xl font-bold text-brand-charcoal truncate">
              {name ?? "—"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
