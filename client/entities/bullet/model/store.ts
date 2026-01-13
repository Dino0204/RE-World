import { create } from "zustand";

export interface BulletData {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
}

interface BulletStore {
  bullets: BulletData[];
  addBullet: (bullet: BulletData) => void;
  removeBullet: (id: string) => void;
}

export const useBulletStore = create<BulletStore>((set) => ({
  bullets: [],
  addBullet: (bullet) =>
    set((state) => ({ bullets: [...state.bullets, bullet] })),
  removeBullet: (id) =>
    set((state) => ({
      bullets: state.bullets.filter((b) => b.id !== id),
    })),
}));
