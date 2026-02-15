import { z } from "zod";
import { WebSocketMessageSchema } from "./message";

// --- Room Constants ---
export const ROOM_MAX_PLAYERS = 20;

// --- Room Info ---
export const RoomInfoSchema = z.object({
  id: z.string(),
  playerCount: z.number(),
  maxPlayers: z.number(),
  createdAt: z.number(),
});
export type RoomInfo = z.infer<typeof RoomInfoSchema>;

// --- Join Room Request ---
export const JoinRoomRequestSchema = WebSocketMessageSchema.extend({
  type: z.literal("JOIN_ROOM"),
  playerId: z.string(),
});
export type JoinRoomRequest = z.infer<typeof JoinRoomRequestSchema>;

// --- Join Room Response ---
export const JoinRoomResponseSchema = WebSocketMessageSchema.extend({
  type: z.literal("ROOM_JOINED"),
  roomId: z.string(),
  playerCount: z.number(),
  maxPlayers: z.number(),
  success: z.boolean(),
});
export type JoinRoomResponse = z.infer<typeof JoinRoomResponseSchema>;

// --- Room Player Joined ---
export const RoomPlayerJoinedSchema = WebSocketMessageSchema.extend({
  type: z.literal("ROOM_PLAYER_JOINED"),
  roomId: z.string(),
  playerId: z.string(),
  playerCount: z.number(),
});
export type RoomPlayerJoined = z.infer<typeof RoomPlayerJoinedSchema>;

// --- Room Player Left ---
export const RoomPlayerLeftSchema = WebSocketMessageSchema.extend({
  type: z.literal("ROOM_PLAYER_LEFT"),
  roomId: z.string(),
  playerId: z.string(),
  playerCount: z.number(),
});
export type RoomPlayerLeft = z.infer<typeof RoomPlayerLeftSchema>;

// --- Room Message Union ---
export const RoomMessageUnionSchema = z.discriminatedUnion("type", [
  JoinRoomRequestSchema,
  JoinRoomResponseSchema,
  RoomPlayerJoinedSchema,
  RoomPlayerLeftSchema,
]);
export type RoomMessageUnion = z.infer<typeof RoomMessageUnionSchema>;
