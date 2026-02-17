import { create } from "zustand";
import type { Weapon } from "re-world-shared/item";
import type { PlayerState, PlayerAction } from "re-world-shared/player";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

interface PlayerActions {
  setDirection: (direction: { x: number; z: number }) => void;
  setJump: (isJumping: boolean) => void;
  setHandItem: (item: Weapon | null) => void;
  setAiming: (isAiming: boolean) => void;
  toggleCameraMode: () => void;
  setHealth: (currentHealth: number, maxHealth?: number) => void;
  setEquippedItems: (items: Weapon[]) => void;
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

const sendPlayerAction = (action: PlayerAction) => {
  if (!useSocketStore.getState().isConnected) return;
  useSocketStore.getState().gameWebsocket?.send({
    type: "PLAYER_ACTION",
    playerId: SESSION_IDENTIFIER,
    action,
  });
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
  setHandItem: (item) => {
    set(() => ({
      equippedItems: item ? [item] : [],
    }));
    if (item) {
      sendPlayerAction({ type: "EQUIP_ITEM", item });
    }
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
  setEquippedItems: (items) => set({ equippedItems: items }),
}));
