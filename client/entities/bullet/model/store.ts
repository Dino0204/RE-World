import { create } from "zustand";
import type { BulletData } from "./bullet";
import { getGameWebsocket } from "@/shared/api/gameSocket";
import { SESSION_IDENTIFIER } from "@/shared/config/session";
import { useMultiplayerStore } from "@/shared/store/multiplayer";

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
    if (useMultiplayerStore.getState().isServerConnected) {
      getGameWebsocket().send({
        type: "BULLET",
        identifier: SESSION_IDENTIFIER,
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
  removeBullet: (id) =>
  set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    })),
}));