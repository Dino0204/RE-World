"use client";

import { usePlayerStore } from "@/entities/player/model/player.store";

export default function GameHUD() {
  const { currentHealth, maxHealth } = usePlayerStore();
  const healthRatio =
    maxHealth > 0 ? Math.max(0, Math.min(1, currentHealth / maxHealth)) : 0;
  const healthPercentage = Math.round(healthRatio * 100);

  // 체력에 따른 색상 변경
  const getHealthColor = () => {
    if (healthRatio > 0.6) return "bg-green-500";
    if (healthRatio > 0.3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 flex flex-col items-start">
      <span className="mb-1 text-xs font-bold text-white/80 uppercase tracking-wider">
        HP
      </span>
      <div className="w-48 h-5 rounded border-2 border-white/30 bg-black/60 overflow-hidden shadow-lg">
        <div
          className={`h-full ${getHealthColor()} transition-all duration-150 ease-out`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
      <span className="mt-1 text-sm font-bold text-white drop-shadow-lg">
        {Math.max(0, Math.round(currentHealth))} /{" "}
        {Math.max(0, Math.round(maxHealth))}
      </span>
    </div>
  );
}
