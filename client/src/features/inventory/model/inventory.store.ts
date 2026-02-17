import { create } from "zustand";
import type { Item, Weapon } from "re-world-shared/item";
import { M416, PISTOL } from "@/entities/weapon/model/weapon.data";

export type WeaponSlotType =
  | "주무기1"
  | "주무기2"
  | "보조무기"
  | "근접무기"
  | "투척무기";

interface Inventory {
  isOpen: boolean;
  items: Item[];
  weaponSlots: Record<WeaponSlotType, Weapon | null>;
  activeSlotType: WeaponSlotType | null;
  toggleOpen: () => void;
  open: () => void;
  close: () => void;
  setItems: (items: Item[]) => void;
  equipWeapon: (weapon: Weapon, slot: WeaponSlotType) => void;
  unequipWeapon: (slot: WeaponSlotType) => void;
  setActiveSlot: (slot: WeaponSlotType) => void;
}

export const useInventoryStore = create<Inventory>((set) => ({
  isOpen: false,
  items: [M416, PISTOL],
  weaponSlots: {
    주무기1: null,
    주무기2: null,
    보조무기: null,
    근접무기: null,
    투척무기: null,
  },
  activeSlotType: "주무기1",
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  setItems: (items) => set({ items }),
  equipWeapon: (weapon, slot) =>
    set((state) => ({
      weaponSlots: { ...state.weaponSlots, [slot]: weapon },
      items: state.items.filter((item) => item.id !== weapon.id),
    })),
  unequipWeapon: (slot) =>
    set((state) => {
      const weapon = state.weaponSlots[slot];
      if (!weapon) return state;
      return {
        weaponSlots: { ...state.weaponSlots, [slot]: null },
        items: [...state.items],
      };
    }),
  setActiveSlot: (slot) => set({ activeSlotType: slot }),
}));
