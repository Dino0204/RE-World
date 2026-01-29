import { create } from "zustand";
import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema } from "@/entities/entity/model/primitives";

export const ImpactMaterialSchema = t.UnionEnum([
  "concrete",
  "wood",
  "metal",
  "dirt",
]);
export type ImpactMaterial = Static<typeof ImpactMaterialSchema>;

export const ImpactDataSchema = t.Object({
  id: t.String(),
  position: Vector3Schema,
  material: ImpactMaterialSchema,
  timestamp: t.Number(),
});
export type ImpactData = Static<typeof ImpactDataSchema>;

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
