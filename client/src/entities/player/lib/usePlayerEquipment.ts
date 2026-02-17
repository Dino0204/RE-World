import { useEffect } from "react";
import { usePlayerStore } from "../model/player.store";
import { useInventoryStore } from "@/features/inventory/model/inventory.store";

export const usePlayerEquipment = () => {
  const { setHandItem, setEquippedItems } = usePlayerStore();
  const { weaponSlots, activeSlotType } = useInventoryStore();

  useEffect(() => {
    if (!activeSlotType) return;

    const activeWeapon = weaponSlots[activeSlotType];

    if (activeWeapon) {
      setHandItem(activeWeapon);
    } else {
      setHandItem(null);
    }
  }, [activeSlotType, weaponSlots, setHandItem, setEquippedItems]);
};
