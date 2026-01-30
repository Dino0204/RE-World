import { create } from "zustand";

interface TargetState {
  currentHealth: number;
  maxHealth: number;
}

interface TargetStore {
  targets: Map<string, TargetState>;
  setTarget: (id: string, state: TargetState) => void;
  getTarget: (id: string) => TargetState | undefined;
}

export const useTargetStore = create<TargetStore>((set, get) => ({
  targets: new Map(),
  setTarget: (id, state) =>
    set((prev) => {
      const next = new Map(prev.targets);
      next.set(id, state);
      return { targets: next };
    }),
  getTarget: (id) => get().targets.get(id),
}));
