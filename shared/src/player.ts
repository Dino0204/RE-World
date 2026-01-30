import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema, QuaternionSchema, DirectionSchema } from "./primitives";
import { WeaponSchema } from "./weapon";

// --- Camera Mode ---
export const CameraModeSchema = t.UnionEnum([
  "FIRST_PERSON",
  "THIRD_PERSON",
]);
export type CameraMode = Static<typeof CameraModeSchema>;

// --- Player State ---
export const PlayerStateSchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
  isMoving: t.Boolean(),
  isJumping: t.Boolean(),
  direction: DirectionSchema,
  equippedItems: t.Array(WeaponSchema),
  isAiming: t.Boolean(),
  cameraMode: CameraModeSchema,
});
export type PlayerState = Static<typeof PlayerStateSchema>;

// --- Player Action ---
export const PlayerActionSchema = t.Union([
  t.Object({ type: t.Literal("SET_DIRECTION"), direction: DirectionSchema }),
  t.Object({ type: t.Literal("JUMP") }),
  t.Object({ type: t.Literal("RESET_JUMP") }),
  t.Object({ type: t.Literal("EQUIP_ITEM"), item: WeaponSchema }),
  t.Object({ type: t.Literal("SET_AIMING"), isAiming: t.Boolean() }),
]);
export type PlayerAction = Static<typeof PlayerActionSchema>;

// --- Player State Message ---
export const PlayerStateMessageSchema = t.Object({
  type: t.Literal("PLAYER_STATE"),
  playerId: PlayerStateSchema.properties.id,
  position: Vector3Schema,
  rotation: QuaternionSchema,
  currentHealth: t.Number(),
  maxHealth: t.Number(),
  isMoving: t.Boolean(),
  isJumping: t.Boolean(),
  direction: DirectionSchema,
  equippedItems: t.Array(WeaponSchema),
  isAiming: t.Boolean(),
  cameraMode: CameraModeSchema,
});
export type PlayerStateMessage = Static<typeof PlayerStateMessageSchema>;

// --- Player Action Message ---
export const PlayerActionMessageSchema = t.Object({
  type: t.Literal("PLAYER_ACTION"),
  playerId: PlayerStateSchema.properties.id,
  action: PlayerActionSchema,
});
export type PlayerActionMessage = Static<typeof PlayerActionMessageSchema>;

// --- Player Disconnect Message ---
export const PlayerDisconnectMessageSchema = t.Object({
  type: t.Literal("PLAYER_DISCONNECT"),
  playerId: PlayerStateSchema.properties.id,
});
export type PlayerDisconnectMessage = Static<typeof PlayerDisconnectMessageSchema>;
