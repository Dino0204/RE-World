import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema } from "@/entities/entity/model/primitives";

export const BulletTypeSchema = t.UnionEnum([
  "5.56mm",
  "7.62mm",
  "9mm",
  "12Gauge",
  "Other",
]);
export type BulletType = Static<typeof BulletTypeSchema>;

export const BulletDataSchema = t.Object({
  id: t.String(),
  position: Vector3Schema,
  velocity: Vector3Schema,
  damage: t.Number(),
});
export type BulletData = Static<typeof BulletDataSchema>;
