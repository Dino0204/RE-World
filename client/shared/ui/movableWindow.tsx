"use client";

import SignIn from "@/features/signin/ui";
import { useMovable } from "../model/useMovable";

export function MovableWindow() {
  const { position, isDragging, handleMouseDown } = useMovable();

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 rounded-lg
          cursor-grab active:cursor-grabbing z-50
        bg-brand-beige-mid/40 border-2 border-brand-beige-dark p-1 shadow-sm group backdrop-blur-sm
          ${isDragging ? "will-change-transform select-none" : ""}
        `}
    >
      <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
        <span>Authorize</span>
      </div>
      <div className="px-4">
        <div className="space-y-2">
          <label className="text-[10px] text-brand-charcoal-light tracking-[0.2em] uppercase font-bold">
            Operation Mode
          </label>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
