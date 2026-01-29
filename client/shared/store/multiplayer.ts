import { create } from "zustand";
import type { GameMessage } from "@/entities/player/model/player";
import type {
  PlayerStateMessage,
  PlayerAction,
  Weapon,
} from "re-world-shared";

export type RemotePlayerState = GameMessage & Partial<Omit<PlayerStateMessage, "type" | "identifier" | "position" | "rotation">>;

interface MultiplayerStore {
  players: Map<string, RemotePlayerState>;
  isServerConnected: boolean;
  updatePlayer: (identifier: string, state: Partial<RemotePlayerState>) => void;
  updatePlayerFromAction: (identifier: string, action: PlayerAction) => void;
  removePlayer: (identifier: string) => void;
  setServerConnected: (isServerConnected: boolean) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  players: new Map(),
  isServerConnected: false,
  updatePlayer: (identifier, state) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      const current = newPlayers.get(identifier) ?? ({} as RemotePlayerState);
      newPlayers.set(identifier, { ...current, ...state });
      return { players: newPlayers };
    }),
  updatePlayerFromAction: (identifier, action) => {
    const current = get().players.get(identifier);
    if (!current) return;
    if (action.type === "SET_DIRECTION") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(identifier, {
          ...current,
          direction: action.direction,
          isMoving: action.direction.x !== 0 || action.direction.z !== 0,
        });
        return { players: next };
      });
    } else if (action.type === "JUMP") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(identifier, { ...current, isJumping: true });
        return { players: next };
      });
    } else if (action.type === "RESET_JUMP") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(identifier, { ...current, isJumping: false });
        return { players: next };
      });
    } else if (action.type === "EQUIP_ITEM") {
      set((prev) => {
        const next = new Map(prev.players);
        const equipped = current.equippedItems ?? [];
        const isEquipped = equipped.some((i: Weapon) => i.name === action.item.name);
        next.set(identifier, {
          ...current,
          equippedItems: isEquipped
            ? equipped.filter((i: Weapon) => i.name !== action.item.name)
            : [...equipped, action.item],
        });
        return { players: next };
      });
    } else if (action.type === "SET_AIMING") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(identifier, { ...current, isAiming: action.isAiming });
        return { players: next };
      });
    }
  },
  removePlayer: (identifier) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      newPlayers.delete(identifier);
      return { players: newPlayers };
    }),
  setServerConnected: (isServerConnected) => set({ isServerConnected }),
}));
