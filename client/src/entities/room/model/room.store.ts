import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RoomInfo } from "re-world-shared/room";

interface RoomStore {
  currentRoom: RoomInfo | null;
  isJoining: boolean;
  error: string | null;
  setCurrentRoom: (room: RoomInfo | null) => void;
  setIsJoining: (isJoining: boolean) => void;
  setError: (error: string | null) => void;
  updatePlayerCount: (playerCount: number) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      currentRoom: null,
      isJoining: false,
      error: null,
      setCurrentRoom: (room) =>
        set({ currentRoom: room, isJoining: false, error: null }),
      setIsJoining: (isJoining) => set({ isJoining }),
      setError: (error) => set({ error, isJoining: false }),
      updatePlayerCount: (playerCount) =>
        set((state) => ({
          currentRoom: state.currentRoom
            ? { ...state.currentRoom, playerCount }
            : null,
        })),
      reset: () => set({ currentRoom: null, isJoining: false, error: null }),
    }),
    {
      name: "re-world-room-storage",
      partialize: (state) => ({ currentRoom: state.currentRoom }),
    },
  ),
);
