// --- Primitives ---
export {
  Vector3Schema,
  QuaternionSchema,
  DirectionSchema,
} from "./primitives";
export type { Vector3, Quaternion, Direction } from "./primitives";

// --- Entity ---
export { EntitySchema } from "./entity";
export type { Entity } from "./entity";

// --- Bullet ---
export {
  BulletTypeSchema,
  BulletDataSchema,
  BulletMessageSchema,
} from "./bullet";
export type { BulletType, BulletData, BulletMessage } from "./bullet";

// --- Impact ---
export {
  ImpactMaterialSchema,
  ImpactDataSchema,
  ImpactMessageSchema,
} from "./impact";
export type { ImpactMaterial, ImpactData, ImpactMessage } from "./impact";

// --- Weapon ---
export {
  WeaponTypeSchema,
  WeaponPartTypeSchema,
  WeaponPartSchema,
  WeaponSchema,
  WeaponMessageSchema,
} from "./weapon";
export type {
  WeaponType,
  WeaponPartType,
  WeaponPart,
  Weapon,
  WeaponMessage,
} from "./weapon";

// --- Player ---
export {
  CameraModeSchema,
  PlayerStateSchema,
  PlayerActionSchema,
  PlayerStateMessageSchema,
  PlayerActionMessageSchema,
  PlayerDisconnectMessageSchema,
} from "./player";
export type {
  CameraMode,
  PlayerState,
  PlayerAction,
  PlayerStateMessage,
  PlayerActionMessage,
  PlayerDisconnectMessage,
} from "./player";

// --- Target ---
export { TargetSchema, TargetMessageSchema } from "./target";
export type { Target, TargetMessage } from "./target";

// --- Game ---
export { GameMessageSchema, GameMessageUnionSchema } from "./game";
export type { GameMessage, GameMessageUnion } from "./game";
