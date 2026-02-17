import { create } from "zustand";
import type { BulletData } from "re-world-shared/item";
import { useSocketStore } from "@/shared/model/socket.store";
import { SESSION_IDENTIFIER } from "@/shared/config/session";

interface BulletStore {
  bullets: BulletData[];
  addBullet: (bullet: BulletData) => void;
  addBulletFromRemote: (bullet: BulletData) => void;
  removeBullet: (id: string) => void;
}

export const useBulletStore = create<BulletStore>((set) => ({
  bullets: [],
  addBullet: (bullet) => {
    set((state) => ({
      bullets: [...state.bullets, bullet],
    }));
    if (useSocketStore.getState().isConnected) {
      useSocketStore.getState().gameWebsocket?.send({
        type: "BULLET",
        playerId: SESSION_IDENTIFIER,
        data: bullet,
      });
    }
  },
  addBulletFromRemote: (data) => {
    set((state) => {
      if (state.bullets.some((bullet) => bullet.id === data.id)) {
        return state;
      }
      return {
        bullets: [...state.bullets, data],
      };
    });
  },
  removeBullet: (id) => {
    set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    }));
  },
}));
