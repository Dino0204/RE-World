import { z } from "zod";
import { Vector3Schema, QuaternionSchema } from "./primitives";
import { WebSocketMessageSchema } from "./message";
import { BulletMessageSchema } from "./item";
import { ImpactMessageSchema } from "./impact";
import { WeaponMessageSchema } from "./item";
import { TargetMessageSchema } from "./target";
import {
  PlayerStateMessageSchema,
  PlayerActionMessageSchema,
  PlayerDisconnectMessageSchema,
} from "./player";
import {
  JoinRoomRequestSchema,
  JoinRoomResponseSchema,
  RoomPlayerJoinedSchema,
  RoomPlayerLeftSchema,
} from "./room";

// --- Game Message (Legacy) ---
export const GameMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("GAME"),
  playerId: z.string(),
  position: Vector3Schema,
  rotation: QuaternionSchema,
});
export type GameMessage = z.infer<typeof GameMessageSchema>;

// --- Game Message Union ---
export const GameMessageUnionSchema = z.union([
  GameMessageSchema,
  BulletMessageSchema,
  ImpactMessageSchema,
  WeaponMessageSchema,
  TargetMessageSchema,
  PlayerStateMessageSchema,
  PlayerActionMessageSchema,
  PlayerDisconnectMessageSchema,
  JoinRoomRequestSchema,
  JoinRoomResponseSchema,
  RoomPlayerJoinedSchema,
  RoomPlayerLeftSchema,
]);
export type GameMessageUnion = z.infer<typeof GameMessageUnionSchema>;
