import { create } from "zustand";
import type { GameMessage } from "re-world-shared/game";
import type { PlayerStateMessage, PlayerAction } from "re-world-shared/player";
import type { Weapon } from "re-world-shared/item";

export type RemotePlayerState = GameMessage &
  Partial<
    Omit<PlayerStateMessage, "type" | "playerId" | "position" | "rotation">
  > & { playerId?: string };

interface MultiplayerStore {
  players: Map<string, RemotePlayerState>;
  updatePlayer: (playerId: string, state: Partial<RemotePlayerState>) => void;
  updatePlayerFromAction: (playerId: string, action: PlayerAction) => void;
  removePlayer: (playerId: string) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  players: new Map(),
  updatePlayer: (playerId, state) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      const current = newPlayers.get(playerId) ?? ({} as RemotePlayerState);
      newPlayers.set(playerId, { ...current, ...state });
      return { players: newPlayers };
    }),
  updatePlayerFromAction: (playerId, action) => {
    const current = get().players.get(playerId);
    if (!current) return;
    if (action.type === "SET_DIRECTION") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(playerId, {
          ...current,
          direction: action.direction,
          isMoving: action.direction.x !== 0 || action.direction.z !== 0,
        });
        return { players: next };
      });
    } else if (action.type === "JUMP") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(playerId, { ...current, isJumping: true });
        return { players: next };
      });
    } else if (action.type === "RESET_JUMP") {
      set((prev) => {
        const next = new Map(prev.players);
        next.set(playerId, { ...current, isJumping: false });
        return { players: next };
      });
    } else if (action.type === "EQUIP_ITEM") {
      set((prev) => {
        const next = new Map(prev.players);
        const equipped = current.equippedItems ?? [];
        const isEquipped = equipped.some(
          (i: Weapon) => i.name === action.item.name,
        );
        next.set(playerId, {
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
        next.set(playerId, { ...current, isAiming: action.isAiming });
        return { players: next };
      });
    }
  },
  removePlayer: (playerId) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      newPlayers.delete(playerId);
      return { players: newPlayers };
    }),
}));
