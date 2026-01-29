"use client";

import { usePlayerStore } from "@/entities/player/model/store";

export default function GameHUD() {
  const { currentHealth, maxHealth } = usePlayerStore();

  const healthRatio =
    maxHealth > 0 ? Math.max(0, Math.min(1, currentHealth / maxHealth)) : 0;
  const healthPercentage = Math.round(healthRatio * 100);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
      <div className="w-64 h-4 rounded-full border border-gray-700 bg-black/70 overflow-hidden">
        <div
          className="h-full bg-red-500 transition-[width] duration-150 ease-out"
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      <span className="mt-1 text-sm text-white drop-shadow">
        {Math.max(0, Math.round(currentHealth))} / {Math.max(0, Math.round(maxHealth))}
      </span>
    </div>
  );
}

