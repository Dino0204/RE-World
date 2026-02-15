import { z } from "zod";

// --- WebSocket Message Type Enum Schema ---
export const WebSocketMessageTypeSchema = z.enum([
  // Player Messages
  "PLAYER_STATE",
  "PLAYER_ACTION",
  "PLAYER_DISCONNECT",
  // Game Object Messages
  "GAME",
  "BULLET",
  "IMPACT",
  "WEAPON",
  "TARGET",
  // Room Messages
  "JOIN_ROOM",
  "ROOM_JOINED",
  "ROOM_PLAYER_JOINED",
  "ROOM_PLAYER_LEFT",
]);
export type WebSocketMessageType = z.infer<typeof WebSocketMessageTypeSchema>;

// --- Base WebSocket Message Schema ---
export const WebSocketMessageSchema = z.object({
  type: WebSocketMessageTypeSchema,
});
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
