import { z } from "zod";
import { WebSocketMessageSchema } from "./message";
import { Vector3Schema } from "./primitives";

// --- Base Item ---
export const BaseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  weight: z.number().min(1).default(1),
  stackSize: z.number().min(1).default(1),
});

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
export const BulletSchema = BaseItemSchema.extend({
  category: z.literal("BULLET"),
  itemType: BulletTypeSchema,
  position: Vector3Schema,
  velocity: Vector3Schema,
  damage: z.number(),
});
export type BulletData = z.infer<typeof BulletSchema>;

// --- Bullet Message ---
export const BulletMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("BULLET"),
  playerId: z.string(),
  data: BulletSchema,
});
export type BulletMessage = z.infer<typeof BulletMessageSchema>;

// --- Part Type ---
export const PartTypeSchema = z.enum([
  "총구",
  "조준경",
  "손잡이",
  "탄창",
  "개머리판",
  "기타",
]);
export type PartType = z.infer<typeof PartTypeSchema>;

// --- Weapon Part ---
export const PartSchema = BaseItemSchema.extend({
  category: z.literal("PART"),
  itemType: PartTypeSchema,
});

export type Part = z.infer<typeof PartSchema>;

// --- Weapon Type ---
export const WeaponTypeSchema = z.enum([
  "돌격 소총",
  "지정 사수 소총",
  "저격 소총",
  "기관 단총",
  "산탄총",
  "경기관총",
  "기타",
  "권총",
  "근접무기",
  "투척무기",
]);
export type WeaponType = z.infer<typeof WeaponTypeSchema>;

// --- Weapon ---
export const WeaponSchema = BaseItemSchema.extend({
  category: z.literal("WEAPON"),
  itemType: WeaponTypeSchema,
  damage: z.number(),
  fireRate: z.number(),
  ammo: z.object({
    type: BulletTypeSchema,
    amount: z.number(),
    maxAmount: z.number(),
  }),
  recoil: z.object({
    vertical: z.number(),
    horizontal: z.number(),
    maxVertical: z.number(),
    maxHorizontal: z.number(),
    pattern: z.array(z.object({ x: z.number(), y: z.number() })),
  }),
  transform: z.object({
    rotation: z.tuple([z.number(), z.number(), z.number()]),
    scale: z.number(),
  }),
});

export type Weapon = z.infer<typeof WeaponSchema>;

// --- Weapon Message ---
export const WeaponMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("WEAPON"),
  playerId: z.string(),
  weapon: WeaponSchema,
});
export type WeaponMessage = z.infer<typeof WeaponMessageSchema>;

// --- Item Union ---
export const ItemSchema = z.discriminatedUnion("category", [
  WeaponSchema,
  PartSchema,
  BulletSchema,
]);
export type Item = z.infer<typeof ItemSchema>;
