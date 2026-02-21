import { z } from "zod";
import { Vector3Schema, QuaternionSchema, DirectionSchema } from "./primitives";
import { WeaponSchema } from "./item";
import { WebSocketMessageSchema } from "./message";

// --- Camera Mode ---
export const CameraModeSchema = z.enum(["FIRST_PERSON", "THIRD_PERSON"]);
export type CameraMode = z.infer<typeof CameraModeSchema>;

// --- Player State ---
export const PlayerStateSchema = z.object({
  id: z.string(),
  currentHealth: z.number(),
  maxHealth: z.number(),
  isMoving: z.boolean(),
  isJumping: z.boolean(),
  direction: DirectionSchema,
  position: Vector3Schema,
  rotation: Vector3Schema,
  equippedItems: z.array(WeaponSchema),
  isAiming: z.boolean(),
  cameraMode: CameraModeSchema,
});
export type PlayerState = z.infer<typeof PlayerStateSchema>;

// --- Player Action ---
export const PlayerActionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("SET_DIRECTION"), direction: DirectionSchema }),
  z.object({ type: z.literal("JUMP") }),
  z.object({ type: z.literal("RESET_JUMP") }),
  z.object({ type: z.literal("EQUIP_ITEM"), item: WeaponSchema }),
  z.object({ type: z.literal("SET_AIMING"), isAiming: z.boolean() }),
]);
export type PlayerAction = z.infer<typeof PlayerActionSchema>;

// --- Player State Message ---
export const PlayerStateMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("PLAYER_STATE"),
  playerId: z.string(),
  position: Vector3Schema,
  rotation: QuaternionSchema,
  currentHealth: z.number(),
  maxHealth: z.number(),
  isMoving: z.boolean(),
  isJumping: z.boolean(),
  direction: DirectionSchema,
  equippedItems: z.array(WeaponSchema),
  isAiming: z.boolean(),
  cameraMode: CameraModeSchema,
});
export type PlayerStateMessage = z.infer<typeof PlayerStateMessageSchema>;

// --- Player Action Message ---
export const PlayerActionMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("PLAYER_ACTION"),
  playerId: z.string(),
  action: PlayerActionSchema,
});
export type PlayerActionMessage = z.infer<typeof PlayerActionMessageSchema>;

// --- Player Disconnect Message ---
export const PlayerDisconnectMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("PLAYER_DISCONNECT"),
  playerId: z.string(),
});
export type PlayerDisconnectMessage = z.infer<
  typeof PlayerDisconnectMessageSchema
>;
