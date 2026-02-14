import { z } from "zod";
import { BulletTypeSchema } from "./bullet";
import { WebSocketMessageSchema } from "./message";

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

// --- Weapon Part Type ---
export const WeaponPartTypeSchema = z.enum([
  "총구",
  "조준경",
  "손잡이",
  "탄창",
  "개머리판",
  "기타",
]);
export type WeaponPartType = z.infer<typeof WeaponPartTypeSchema>;

// --- Weapon Part ---
export const WeaponPartSchema = z.object({
  name: z.string(),
  type: WeaponPartTypeSchema,
  model: z.string(),
});
export type WeaponPart = z.infer<typeof WeaponPartSchema>;

// --- Weapon ---
export const WeaponSchema = z.object({
  name: z.string(),
  type: WeaponTypeSchema,
  model: z.string(),
  damage: z.number(),
  fireRate: z.number(),
  ammo: z.object({
    type: BulletTypeSchema,
    amount: z.number(),
    maxAmount: z.number(),
  }),
  parts: z.array(WeaponPartSchema),
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
