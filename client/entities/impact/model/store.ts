import { create } from "zustand";
import type { ImpactData, ImpactMaterial } from "re-world-shared";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

interface ImpactStore {
  impacts: ImpactData[];
  addImpact: (
    position: { x: number; y: number; z: number },
    material: ImpactMaterial,
  ) => void;
  addImpactFromRemote: (data: ImpactData) => void;
  removeImpact: (id: string) => void;
}

export const useImpactStore = create<ImpactStore>((set) => ({
  impacts: [],
  addImpact: (position, material) => {
    const id = crypto.randomUUID();
    const newImpact: ImpactData = {
      id,
      position,
      material,
      timestamp: Date.now(),
    };

    set((state) => ({
      impacts: [...state.impacts, newImpact],
    }));

    if (useMultiplayerStore.getState().isServerConnected) {
      getGameWebsocket().send({
        type: "IMPACT",
        data: newImpact,
      });
    }

    setTimeout(() => {
      set((state) => ({
        impacts: state.impacts.filter((impact) => impact.id !== id),
      }));
    }, 1000);
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
    setTimeout(() => {
      set((state) => ({
        impacts: state.impacts.filter((impact) => impact.id !== data.id),
      }));
    }, 1000);
  },
  removeImpact: (id) =>
    set((state) => ({
      impacts: state.impacts.filter((impact) => impact.id !== id),
    })),
}));

export type { ImpactMaterial, ImpactData } from "re-world-shared";
