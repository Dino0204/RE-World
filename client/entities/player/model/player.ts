import { t } from "elysia";
import type { Static } from "elysia";
import {
  Vector3Schema,
  QuaternionSchema,
  DirectionSchema,
} from "@/entities/entity/model/primitives";
import { WeaponSchema } from "@/entities/weapon/model/weapon";

export const GameMessageSchema = t.Object({
  identifier: t.String(),
  position: Vector3Schema,
  rotation: QuaternionSchema,
});
export type GameMessage = Static<typeof GameMessageSchema>;

export const CameraModeSchema = t.UnionEnum([
  "FIRST_PERSON",
  "THIRD_PERSON",
]);
export type CameraMode = Static<typeof CameraModeSchema>;

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

export const PlayerActionSchema = t.Union([
  t.Object({ type: t.Literal("SET_DIRECTION"), direction: DirectionSchema }),
  t.Object({ type: t.Literal("JUMP") }),
  t.Object({ type: t.Literal("RESET_JUMP") }),
  t.Object({ type: t.Literal("EQUIP_ITEM"), item: WeaponSchema }),
  t.Object({ type: t.Literal("SET_AIMING"), isAiming: t.Boolean() }),
]);
export type PlayerAction = Static<typeof PlayerActionSchema>;
