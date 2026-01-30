import { z } from "zod";
import { Vector3Schema } from "./primitives";
import { WebSocketMessageSchema } from "./message";

// --- Bullet Type ---
export const BulletTypeSchema = z.enum([
  "5.56mm",
  "7.62mm",
  "9mm",
  "12Gauge",
  "Other",
]);
export type BulletType = z.infer<typeof BulletTypeSchema>;

// --- Bullet Data ---
export const BulletDataSchema = z.object({
  id: z.string(),
  position: Vector3Schema,
  velocity: Vector3Schema,
  damage: z.number(),
});
export type BulletData = z.infer<typeof BulletDataSchema>;

// --- Bullet Message ---
export const BulletMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("BULLET"),
  playerId: z.string(),
  data: BulletDataSchema,
});
export type BulletMessage = z.infer<typeof BulletMessageSchema>;