import { create } from "zustand";
import type { ImpactData } from "re-world-shared/impact";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

interface ImpactStore {
  impacts: ImpactData[];
  addImpact: (impact: ImpactData) => void;
  addImpactFromRemote: (impact: ImpactData) => void;
  removeImpact: (id: string) => void;
}

export const useImpactStore = create<ImpactStore>((set) => ({
  impacts: [],
  addImpact: (impact) => {
    set((state) => ({
      impacts: [...state.impacts, impact],
    }));
    if (useSocketStore.getState().isConnected) {
      useSocketStore.getState().gameWebsocket?.send({
        type: "IMPACT",
        playerId: SESSION_IDENTIFIER,
        data: impact,
      });
    }
  },
  addImpactFromRemote: (data) => {
    set((state) => {
      if (state.impacts.some((impact) => impact.id === data.id)) {
        return state;
      }
      return {
        impacts: [...state.impacts, data],
      };
    });
  },
  removeImpact: (id) => {
    set((state) => ({
      impacts: state.impacts.filter((impact) => impact.id !== id),
    }));
  },
}));
