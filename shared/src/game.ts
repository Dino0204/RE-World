import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema, QuaternionSchema } from "./primitives";
import { BulletMessageSchema } from "./bullet";
import { ImpactMessageSchema } from "./impact";
import { WeaponMessageSchema } from "./weapon";
import { TargetMessageSchema } from "./target";
import {
  PlayerStateMessageSchema,
  PlayerActionMessageSchema,
  PlayerDisconnectMessageSchema,
} from "./player";

// --- Game Message (Legacy) ---
export const GameMessageSchema = t.Object({
  identifier: t.String(),
  position: Vector3Schema,
  rotation: QuaternionSchema,
});
export type GameMessage = Static<typeof GameMessageSchema>;

// --- Game Message Union ---
export const GameMessageUnionSchema = t.Union([
  GameMessageSchema,
  BulletMessageSchema,
  ImpactMessageSchema,
  WeaponMessageSchema,
  TargetMessageSchema,
  PlayerStateMessageSchema,
  PlayerActionMessageSchema,
  PlayerDisconnectMessageSchema,
]);
export type GameMessageUnion = Static<typeof GameMessageUnionSchema>;
