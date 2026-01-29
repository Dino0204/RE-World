import { t } from "elysia";
import type { Static } from "elysia";

// --- Primitives ---
export const Vector3Schema = t.Object({
  x: t.Number(),
  y: t.Number(),
  z: t.Number(),
});
export type Vector3 = Static<typeof Vector3Schema>;

export const QuaternionSchema = t.Object({
  x: t.Number(),
  y: t.Number(),
  z: t.Number(),
  w: t.Number(),
});
export type Quaternion = Static<typeof QuaternionSchema>;

export const DirectionSchema = t.Object({
  x: t.Number(),
  z: t.Number(),
});
export type Direction = Static<typeof DirectionSchema>;

// --- Game WebSocket ---
export const GameMessageSchema = t.Object({
  identifier: t.String(),
  position: Vector3Schema,
  rotation: QuaternionSchema,
});
export type GameMessage = Static<typeof GameMessageSchema>;

// --- Bullet ---
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

// --- Impact ---
export const ImpactMaterialSchema = t.UnionEnum([
  "concrete",
  "wood",
  "metal",
  "dirt",
]);
export type ImpactMaterial = Static<typeof ImpactMaterialSchema>;

export const ImpactDataSchema = t.Object({
  id: t.String(),
  position: Vector3Schema,
  material: ImpactMaterialSchema,
  timestamp: t.Number(),
});
export type ImpactData = Static<typeof ImpactDataSchema>;

// --- Entity ---
export const EntitySchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
});
export type Entity = Static<typeof EntitySchema>;

// --- Weapon ---
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

export const WeaponPartTypeSchema = t.UnionEnum([
  "총구",
  "조준경",
  "손잡이",
  "탄창",
  "개머리판",
  "기타",
]);
export type WeaponPartType = Static<typeof WeaponPartTypeSchema>;

export const WeaponPartSchema = t.Object({
  name: t.String(),
  type: WeaponPartTypeSchema,
  model: t.String(),
});
export type WeaponPart = Static<typeof WeaponPartSchema>;

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

// --- Player ---
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

// --- Target ---
export const TargetSchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
  type: t.Literal("target"),
});
export type Target = Static<typeof TargetSchema>;
