import { t } from "elysia";
import type { Static } from "elysia";

// --- Target ---
export const TargetSchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
  type: t.Literal("target"),
});
export type Target = Static<typeof TargetSchema>;

// --- Target Message ---
export const TargetMessageSchema = t.Object({
  type: t.Literal("TARGET"),
  data: TargetSchema,
});
export type TargetMessage = Static<typeof TargetMessageSchema>;
