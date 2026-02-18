import { PlayerHUD } from "@/entities/player/ui/player-hud";
import { WeaponHUD } from "@/entities/weapon/ui/weapon-hud";

export default function GameHUD() {
  return (
    <div className="fixed w-full h-full z-30">
      <PlayerHUD />
      <WeaponHUD />
    </div>
  );
}
