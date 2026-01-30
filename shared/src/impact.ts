import { t } from "elysia";
import type { Static } from "elysia";
import { Vector3Schema } from "./primitives";

// --- Impact Material ---
export const ImpactMaterialSchema = t.UnionEnum([
  "concrete",
  "wood",
  "metal",
  "dirt",
]);
export type ImpactMaterial = Static<typeof ImpactMaterialSchema>;

// --- Impact Data ---
export const ImpactDataSchema = t.Object({
  id: t.String(),
  position: Vector3Schema,
  material: ImpactMaterialSchema,
  timestamp: t.Number(),
});
export type ImpactData = Static<typeof ImpactDataSchema>;

// --- Impact Message ---
export const ImpactMessageSchema = t.Object({
  type: t.Literal("IMPACT"),
  data: ImpactDataSchema,
});
export type ImpactMessage = Static<typeof ImpactMessageSchema>;
