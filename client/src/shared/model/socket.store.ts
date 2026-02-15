import { create } from "zustand";
import { api } from "../api/server";

interface SocketState {
  gameWebsocket: ReturnType<typeof api.game.subscribe> | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  gameWebsocket: null,
  isConnected: false,
  connect: () => {
    if (get().gameWebsocket) return;
    const socket = api.game.subscribe();

    // 연결 상태 모니터링을 위한 이벤트 리스너 추가
    socket.ws.addEventListener("open", () => {
      set({ isConnected: true });
    });

    socket.ws.addEventListener("close", () => {
      set({ isConnected: false, gameWebsocket: null });
    });

    set({ gameWebsocket: socket });
  },
  disconnect: () => {
    const { gameWebsocket } = get();
    if (gameWebsocket) {
      gameWebsocket.ws.close();
      set({ gameWebsocket: null, isConnected: false });
    }
  },
}));
