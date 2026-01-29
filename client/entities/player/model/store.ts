import { create } from "zustand";
import { Weapon } from "@/entities/weapon/model/weapon";
import { PlayerState } from "./player";
import type { PlayerAction } from "re-world-shared";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

interface PlayerActions {
  setDirection: (direction: { x: number; z: number }) => void;
  setJump: (isJumping: boolean) => void;
  equipItem: (item: Weapon) => void;
  setAiming: (isAiming: boolean) => void;
  toggleCameraMode: () => void;
  setHealth: (currentHealth: number, maxHealth?: number) => void;
}

const sendPlayerAction = (action: PlayerAction) => {
  if (!useMultiplayerStore.getState().isServerConnected) return;
  getGameWebsocket().send({
    type: "PLAYER_ACTION",
    identifier: SESSION_IDENTIFIER,
    action,
  });
};

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
  setDirection: (direction) => {
    set(() => ({
      direction,
      isMoving: direction.x !== 0 || direction.z !== 0,
    }));
    sendPlayerAction({ type: "SET_DIRECTION", direction });
  },
  setJump: (isJumping) => {
    set({ isJumping });
    sendPlayerAction(isJumping ? { type: "JUMP" } : { type: "RESET_JUMP" });
  },
  equipItem: (item) => {
    set((state) => {
      const isEquipped = state.equippedItems.some((i) => i.name === item.name);
      return {
        equippedItems: isEquipped
          ? state.equippedItems.filter((i) => i.name !== item.name)
          : [...state.equippedItems, item],
      };
    });
    sendPlayerAction({ type: "EQUIP_ITEM", item });
  },
  setAiming: (isAiming) => {
    set({ isAiming });
    sendPlayerAction({ type: "SET_AIMING", isAiming });
  },
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
