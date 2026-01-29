import { t } from "elysia";
import type { Static } from "elysia";

export const TargetSchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
  type: t.Literal("target"),
});
export type Target = Static<typeof TargetSchema>;
