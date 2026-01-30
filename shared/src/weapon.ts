import { t } from "elysia";
import type { Static } from "elysia";
import { BulletTypeSchema } from "./bullet";
import { PlayerStateSchema } from "./player";

// --- Weapon Type ---
export const WeaponTypeSchema = t.UnionEnum([
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
export type WeaponType = Static<typeof WeaponTypeSchema>;

// --- Weapon Part Type ---
export const WeaponPartTypeSchema = t.UnionEnum([
  "총구",
  "조준경",
  "손잡이",
  "탄창",
  "개머리판",
  "기타",
]);
export type WeaponPartType = Static<typeof WeaponPartTypeSchema>;

// --- Weapon Part ---
export const WeaponPartSchema = t.Object({
  name: t.String(),
  type: WeaponPartTypeSchema,
  model: t.String(),
});
export type WeaponPart = Static<typeof WeaponPartSchema>;

// --- Weapon ---
export const WeaponSchema = t.Object({
  name: t.String(),
  type: WeaponTypeSchema,
  model: t.String(),
  damage: t.Number(),
  fireRate: t.Number(),
  ammo: t.Object({
    type: BulletTypeSchema,
    amount: t.Number(),
    maxAmount: t.Number(),
  }),
  parts: t.Array(WeaponPartSchema),
  recoil: t.Object({
    vertical: t.Number(),
    horizontal: t.Number(),
    maxVertical: t.Number(),
    maxHorizontal: t.Number(),
    pattern: t.Array(t.Object({ x: t.Number(), y: t.Number() })),
  }),
});
export type Weapon = Static<typeof WeaponSchema>;

// --- Weapon Message ---
export const WeaponMessageSchema = t.Object({
  type: t.Literal("WEAPON"),
  playerId: PlayerStateSchema.properties.id,
  weapon: WeaponSchema,
});
export type WeaponMessage = Static<typeof WeaponMessageSchema>;
