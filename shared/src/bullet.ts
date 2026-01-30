import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema } from "./primitives";

// --- Bullet Type ---
export const BulletTypeSchema = t.UnionEnum([
  "5.56mm",
  "7.62mm",
  "9mm",
  "12Gauge",
  "Other",
]);
export type BulletType = Static<typeof BulletTypeSchema>;

// --- Bullet Data ---
export const BulletDataSchema = t.Object({
  id: t.String(),
  position: Vector3Schema,
  velocity: Vector3Schema,
  damage: t.Number(),
});
export type BulletData = Static<typeof BulletDataSchema>;

// --- Bullet Message ---
export const BulletMessageSchema = t.Object({
  type: t.Literal("BULLET"),
  identifier: t.String(),
  data: BulletDataSchema,
});
export type BulletMessage = Static<typeof BulletMessageSchema>;
