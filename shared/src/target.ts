import { z } from "zod";
import { WebSocketMessageSchema } from "./message";

// --- Target ---
export const TargetSchema = z.object({
  id: z.string(),
  currentHealth: z.number(),
  maxHealth: z.number(),
  type: z.literal("target"),
});
export type Target = z.infer<typeof TargetSchema>;

// --- Target Message ---
export const TargetMessageSchema = WebSocketMessageSchema.extend({
  type: z.literal("TARGET"),
  data: TargetSchema,
});
export type TargetMessage = z.infer<typeof TargetMessageSchema>;
