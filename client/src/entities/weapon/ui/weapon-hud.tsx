import { SLOT_CONFIGS } from "@/features/inventory/model/inventory-slot.data";
import { useInventoryStore } from "@/features/inventory/model/inventory.store";

export const WeaponHUD = () => {
  const { weaponSlots, activeSlotType } = useInventoryStore();

  return (
    <div className="absolute right-6 bottom-6 flex flex-col gap-1">
      {SLOT_CONFIGS.map((slot, index) => {
        const weapon = weaponSlots[slot.id];
        const isActive = activeSlotType === slot.id;

        return (
          <div
            key={slot.id}
            className={`flex items-center gap-2 text-sm font-bold ${
              isActive ? "text-white" : "text-white/40"
            }`}
          >
            <span>{index + 1}</span>
            {weapon ? (
              <span>
                {weapon.name} {weapon.ammo.amount}/{weapon.ammo.maxAmount}
              </span>
            ) : (
              <span>{slot.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
