import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll use a table to store the history of signals for persistence/logging if needed,
// even if the active state is in-memory or a single row.
export const signals = pgTable("signals", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // Weather Alert, Satellite Summary, Situation Report
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signals).omit({ id: true, timestamp: true });

export type Signal = typeof signals.$inferSelect;
export type InsertSignal = z.infer<typeof insertSignalSchema>;

// === Domain Types for Crisis State ===

export const SeverityLevel = z.enum(["Low", "Moderate", "High", "Critical"]);
export type SeverityLevel = z.infer<typeof SeverityLevel>;

export const CrisisStateSchema = z.object({
  crisisType: z.string().default("Unknown"),
  location: z.string().default("Unknown"),
  severityLevel: SeverityLevel.default("Low"),
  confidence: z.number().min(0).max(100).default(0),
  evidence: z.array(z.string()).default([]),
  recommendedActions: z.array(z.string()).default([]),
  risksAndUncertainties: z.string().default("None identified yet."),
  reasoning: z.string().default("Initial state."),
  lastUpdated: z.string().optional(), // ISO string
});

export type CrisisState = z.infer<typeof CrisisStateSchema>;

export const AnalyzeRequestSchema = insertSignalSchema;
export type AnalyzeRequest = InsertSignal;

export const AnalyzeResponseSchema = z.object({
  crisisState: CrisisStateSchema,
  recommendedActions: z.array(z.string()),
  reasoning: z.string(),
  risksAndUncertainties: z.string(),
});

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
