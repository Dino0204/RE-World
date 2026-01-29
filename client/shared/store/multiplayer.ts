import { create } from "zustand";
import type { GameMessage } from "@/entities/player/model/player";

interface MultiplayerStore {
  players: Map<string, GameMessage>;
  isServerConnected: boolean;
  updatePlayer: (identifier: string, state: GameMessage) => void;
  removePlayer: (identifier: string) => void;
  setServerConnected: (isServerConnected: boolean) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set) => ({
  players: new Map(),
  isServerConnected: false,
  updatePlayer: (identifier, state) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      newPlayers.set(identifier, state);
      return { players: newPlayers };
    }),
  removePlayer: (identifier) =>
    set((previousState) => {
      const newPlayers = new Map(previousState.players);
      newPlayers.delete(identifier);
      return { players: newPlayers };
    }),
  setServerConnected: (isServerConnected) => set({ isServerConnected }),
}));
