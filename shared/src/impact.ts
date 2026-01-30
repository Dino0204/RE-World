import { z } from "zod";
import { Vector3Schema } from "./primitives";
import { WebSocketMessageSchema } from "./message";

// --- Impact Material ---
export const ImpactMaterialSchema = z.enum([
  "concrete",
  "wood",
  "metal",
  "dirt",
]);
export type ImpactMaterial = z.infer<typeof ImpactMaterialSchema>;

// --- Impact Data ---
export const ImpactDataSchema = z.object({
  id: z.string(),
  position: Vector3Schema,
  material: ImpactMaterialSchema,
  timestamp: z.number(),
});
export type ImpactData = z.infer<typeof ImpactDataSchema>;

// --- Impact Message ---
export const ImpactMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("IMPACT"),
  data: ImpactDataSchema,
});
export type ImpactMessage = z.infer<typeof ImpactMessageSchema>;
