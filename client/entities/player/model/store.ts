import { create } from "zustand";
import { Weapon } from "@/entities/weapon/model/weapon";

interface PlayerState {
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  equippedItems: Weapon[];
  isAiming: boolean;
  cameraMode: "FIRST_PERSON" | "THIRD_PERSON";
}

interface PlayerActions {
  setDirection: (direction: { x: number; z: number }) => void;
  setJump: (isJumping: boolean) => void;
  equipItem: (item: Weapon) => void;
  setAiming: (isAiming: boolean) => void;
  toggleCameraMode: () => void;
}

const initialState: PlayerState = {
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  equippedItems: [],
  isAiming: false,
  cameraMode: "FIRST_PERSON",
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
}));
