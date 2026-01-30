import { t } from "elysia";
import type { Static } from "elysia";

// --- Vector3 ---
export const Vector3Schema = t.Object({
  x: t.Number(),
  y: t.Number(),
  z: t.Number(),
});
export type Vector3 = Static<typeof Vector3Schema>;

// --- Quaternion ---
export const QuaternionSchema = t.Object({
  x: t.Number(),
  y: t.Number(),
  z: t.Number(),
  w: t.Number(),
});
export type Quaternion = Static<typeof QuaternionSchema>;

// --- Direction ---
export const DirectionSchema = t.Object({
  x: t.Number(),
  z: t.Number(),
});
export type Direction = Static<typeof DirectionSchema>;
