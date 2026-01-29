import { t } from "elysia";
import type { Static } from "elysia";

export const EntitySchema = t.Object({
  id: t.String(),
  currentHealth: t.Number(),
  maxHealth: t.Number(),
});
export type Entity = Static<typeof EntitySchema>;
