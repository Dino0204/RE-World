import { createRef, RefObject } from "react";
import { create } from "zustand";

interface MovableStore {
  position: { x: number; y: number };
  isDragging: boolean;
  offsetRef: RefObject<{ x: number; y: number } | null>;
  setPosition: (pos: { x: number; y: number }) => void;
  setIsDragging: (dragging: boolean) => void;
}

export const useMovableStore = create<MovableStore>((set) => ({
  position: { x: 0, y: 0 },
  isDragging: false,
  offsetRef: createRef<{ x: number; y: number }>(),
  setPosition: (pos) => set({ position: pos }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
}));
