import { z } from "zod";

// --- Entity ---
export const EntitySchema = z.object({
  id: z.string(),
  currentHealth: z.number(),
  maxHealth: z.number(),
});
export type Entity = z.infer<typeof EntitySchema>;
