import { useSocketStore } from "@/shared/model/socket.store";
import {
  JoinRoomResponse,
  RoomPlayerJoined,
  RoomPlayerLeft,
} from "re-world-shared/room";

// 룸 참여 요청
export const requestJoinRoom = (
  playerId: string,
): Promise<JoinRoomResponse> => {
  return new Promise((resolve, reject) => {
    const ws = useSocketStore.getState().gameWebsocket;

    if (!ws) {
      return reject(new Error("게임 서버에 연결되어 있지 않습니다."));
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ROOM_JOINED") {
          ws.ws.removeEventListener("message", handleMessage);
          resolve(data as JoinRoomResponse);
        }
      } catch {
        // JSON 파싱 에러 무시
      }
    };

    ws.ws.addEventListener("message", handleMessage);

    // 연결이 열려있으면 바로 전송, 아니면 연결 후 전송
    if (ws.ws.readyState === WebSocket.OPEN) {
      ws.send({ type: "JOIN_ROOM", playerId });
    } else {
      ws.ws.addEventListener(
        "open",
        () => {
          ws.send({ type: "JOIN_ROOM", playerId });
        },
        { once: true },
      );
    }

    // 타임아웃 처리
    setTimeout(() => {
      ws.ws.removeEventListener("message", handleMessage);
      reject(new Error("룸 참여 요청 타임아웃"));
    }, 10000);
  });
};

// 룸 이벤트 리스너
export type RoomEventCallback = {
  onPlayerJoined?: (data: RoomPlayerJoined) => void;
  onPlayerLeft?: (data: RoomPlayerLeft) => void;
};

export const subscribeToRoomEvents = (callbacks: RoomEventCallback) => {
  const ws = useSocketStore.getState().gameWebsocket;

  if (!ws) {
    console.warn(
      "게임 서버에 연결되어 있지 않아 룸 이벤트를 구독할 수 없습니다.",
    );
    return () => {};
  }

  const handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "ROOM_PLAYER_JOINED" && callbacks.onPlayerJoined) {
        callbacks.onPlayerJoined(data as RoomPlayerJoined);
      } else if (data.type === "ROOM_PLAYER_LEFT" && callbacks.onPlayerLeft) {
        callbacks.onPlayerLeft(data as RoomPlayerLeft);
      }
    } catch {
      // JSON 파싱 에러 무시
    }
  };

  ws.ws.addEventListener("message", handleMessage);

  // 구독 해제 함수 반환
  return () => {
    ws.ws.removeEventListener("message", handleMessage);
  };
};
