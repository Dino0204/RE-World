import { create } from "zustand";
import { Weapon } from "@/entities/weapon/model/weapon";
import { PlayerState } from "./player";

interface PlayerActions {
  setDirection: (direction: { x: number; z: number }) => void;
  setJump: (isJumping: boolean) => void;
  equipItem: (item: Weapon) => void;
  setAiming: (isAiming: boolean) => void;
  toggleCameraMode: () => void;
  setHealth: (currentHealth: number, maxHealth?: number) => void;
}

const initialState: PlayerState = {
  id: "player",
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  equippedItems: [],
  isAiming: false,
  cameraMode: "FIRST_PERSON",
  currentHealth: 100,
  maxHealth: 100,
};

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  ...initialState,
  setDirection: (direction) =>
    set(() => ({
      direction,
      isMoving: direction.x !== 0 || direction.z !== 0,
    })),
  setJump: (isJumping) => set({ isJumping }),
  equipItem: (item) =>
    set((state) => {
      const isEquipped = state.equippedItems.some((i) => i.name === item.name);
      return {
        equippedItems: isEquipped
          ? state.equippedItems.filter((i) => i.name !== item.name)
          : [...state.equippedItems, item],
      };
    }),
  setAiming: (isAiming) => set({ isAiming }),
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode:
        state.cameraMode === "FIRST_PERSON" ? "THIRD_PERSON" : "FIRST_PERSON",
    })),
  setHealth: (currentHealth, maxHealth) =>
    set((state) => ({
      currentHealth,
      maxHealth: maxHealth ?? state.maxHealth,
    })),
}));
