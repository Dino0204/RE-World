import { create } from "zustand";
import type { Weapon, PlayerState, PlayerAction } from "re-world-shared";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

interface PlayerActions {
  setDirection: (direction: { x: number; z: number }) => void;
  setJump: (isJumping: boolean) => void;
  equipItem: (item: Weapon) => void;
  setAiming: (isAiming: boolean) => void;
  toggleCameraMode: () => void;
  setHealth: (currentHealth: number, maxHealth?: number) => void;
  setActiveSlot: (index: number) => void;
  setWeaponInSlot: (index: number, weapon: Weapon | null) => void;
  setEquippedItems: (items: Weapon[]) => void;
}

const sendPlayerAction = (action: PlayerAction) => {
  if (!useSocketStore.getState().isConnected) return;
  useSocketStore.getState().gameWebsocket?.send({
    type: "PLAYER_ACTION",
    playerId: SESSION_IDENTIFIER,
    action,
  });
};

interface ExtendedPlayerState extends PlayerState {
  weaponSlots: (Weapon | null)[];
  activeSlotIndex: number;
}

const initialState: ExtendedPlayerState = {
  id: "player",
  isMoving: false,
  isJumping: false,
  direction: { x: 0, z: 0 },
  equippedItems: [],
  isAiming: false,
  cameraMode: "FIRST_PERSON",
  currentHealth: 100,
  maxHealth: 100,
  weaponSlots: [null, null, null],
  activeSlotIndex: 0,
};

export const usePlayerStore = create<ExtendedPlayerState & PlayerActions>(
  (set) => ({
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
        const isEquipped = state.equippedItems.some(
          (i) => i.name === item.name,
        );
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
    setActiveSlot: (index) => {
      if (index < 0 || index > 2) return;
      set({ activeSlotIndex: index });
    },
    setWeaponInSlot: (index, weapon) => {
      if (index < 0 || index > 2) return;
      set((state) => {
        const newSlots = [...state.weaponSlots];
        newSlots[index] = weapon;
        return { weaponSlots: newSlots };
      });
    },
    setEquippedItems: (items) => set({ equippedItems: items }),
  }),
);
