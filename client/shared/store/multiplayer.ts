import { create } from "zustand";

interface PlayerState {
  identifier: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
}

interface MultiplayerStore {
  players: Map<string, PlayerState>;
  isServerConnected: boolean;
  updatePlayer: (identifier: string, state: PlayerState) => void;
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
