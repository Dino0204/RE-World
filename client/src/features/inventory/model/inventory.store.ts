import { create } from "zustand";

interface Inventory {
  isOpen: boolean;
  toggleOpen: () => void;
}

export const useInventoryStore = create<Inventory>((set) => ({
  isOpen: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
