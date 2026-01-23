import { create } from "zustand";

export type ImpactMaterial = "concrete" | "wood" | "metal" | "dirt";

export interface ImpactData {
  id: string;
  position: { x: number; y: number; z: number };
  material: ImpactMaterial;
  timestamp: number;
}

interface ImpactStore {
  impacts: ImpactData[];
  addImpact: (
    position: { x: number; y: number; z: number },
    material: ImpactMaterial,
  ) => void;
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

    setTimeout(() => {
      set((state) => ({
        impacts: state.impacts.filter((impact) => impact.id !== id),
      }));
    }, 1000);
  },
  removeImpact: (id) =>
    set((state) => ({
      impacts: state.impacts.filter((impact) => impact.id !== id),
    })),
}));
