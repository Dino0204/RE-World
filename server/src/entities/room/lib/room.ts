import { ROOM_MAX_PLAYERS } from "re-world-shared";

// --- Room Interface ---
export interface Room {
  id: string;
  players: Set<string>;
  createdAt: number;
}

// --- Room State ---
const rooms = new Map<string, Room>();
const playerToRoom = new Map<string, string>();

// --- Helper Functions ---
const generateRoomId = () => {
  return `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

const getTimestamp = () => {
  return new Date().toLocaleTimeString("ko-KR");
};

// --- Room Management Functions ---
export const findOrCreateAvailableRoom = (): Room => {
  // 이용 가능한 룸 찾기 (정원 20명 미만인 룸)
  for (const room of rooms.values()) {
    if (room.players.size < ROOM_MAX_PLAYERS) {
      return room;
    }
  }

  // 없으면 새 룸 생성
  const newRoom: Room = {
    id: generateRoomId(),
    players: new Set(),
    createdAt: Date.now(),
  };
  
  rooms.set(newRoom.id, newRoom);
  console.log(`[${getTimestamp()}] 새 룸 생성됨: ${newRoom.id}`);
  return newRoom;
};

export const joinRoom = (playerId: string): Room => {
  // 이미 룸에 있는 경우 기존 룸 반환
  const existingRoomId = playerToRoom.get(playerId);
  if (existingRoomId) {
    const existingRoom = rooms.get(existingRoomId);
    if (existingRoom) {
      return existingRoom;
    }
  }

  const room = findOrCreateAvailableRoom();
  room.players.add(playerId);
  playerToRoom.set(playerId, room.id);
  console.log(`[${getTimestamp()}] 플레이어 ${playerId}가 룸 ${room.id}에 참여함 (${room.players.size}/${ROOM_MAX_PLAYERS})`);
  return room;
};

export const leaveRoom = (playerId: string): { room: Room; playerCount: number } | null => {
  const roomId = playerToRoom.get(playerId);
  if (!roomId) return null;

  const room = rooms.get(roomId);
  if (!room) return null;

  room.players.delete(playerId);
  playerToRoom.delete(playerId);
  
  const playerCount = room.players.size;
  console.log(`[${getTimestamp()}] 플레이어 ${playerId}가 룸 ${room.id}에서 나감 (${playerCount}/${ROOM_MAX_PLAYERS})`);

  // 룸이 비어있으면 삭제
  if (playerCount === 0) {
    rooms.delete(roomId);
    console.log(`[${getTimestamp()}] 빈 룸 삭제됨: ${roomId}`);
  }

  return { room, playerCount };
};

export const getPlayerRoomId = (playerId: string): string | undefined => {
  return playerToRoom.get(playerId);
};

export const getRoom = (roomId: string): Room | undefined => {
  return rooms.get(roomId);
};
