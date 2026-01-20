import { create } from "zustand";
import { BulletData } from "./bullet";

interface BulletStore {
  bullets: BulletData[];
  addBullet: (bullet: BulletData) => void;
  removeBullet: (id: string) => void;
}

export const useBulletStore = create<BulletStore>((set) => ({
  bullets: [],
  addBullet: (bullet) =>
    set((state) => ({
      bullets: [...state.bullets, bullet],
    })),
  removeBullet: (id) =>
    set((state) => ({
      bullets: state.bullets.filter((b) => b.id !== id),
    })),
}));
