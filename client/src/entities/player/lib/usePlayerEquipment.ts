import { useEffect } from "react";
import { usePlayerStore } from "../model/player.store";

export const usePlayerEquipment = () => {
  const { weaponSlots, activeSlotIndex, equipItem, setEquippedItems } =
    usePlayerStore();

  useEffect(() => {
    // 활성화된 슬롯의 무기를 장착
    const activeWeapon = weaponSlots[activeSlotIndex];

    // 무기가 있으면 장착, 없으면 장착 해제
    if (activeWeapon) {
      equipItem(activeWeapon);
    } else {
      setEquippedItems([]);
    }
  }, [activeSlotIndex, weaponSlots, equipItem, setEquippedItems]);
};
