import { z } from "zod";

// --- Vector3 ---
export const Vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});
export type Vector3 = z.infer<typeof Vector3Schema>;

// --- Quaternion ---
export const QuaternionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  w: z.number(),
});
export type Quaternion = z.infer<typeof QuaternionSchema>;

// --- Direction ---
export const DirectionSchema = z.object({
  x: z.number(),
  z: z.number(),
});
export type Direction = z.infer<typeof DirectionSchema>;
