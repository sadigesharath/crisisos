import { signals, InsertSignal, Signal, CrisisState } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Crisis State Methods
  getCrisisState(): Promise<CrisisState>;
  updateCrisisState(state: CrisisState): Promise<CrisisState>;
  
  // Signal History Methods
  createSignal(signal: InsertSignal): Promise<Signal>;
  getSignals(): Promise<Signal[]>;
}

export class MemStorage implements IStorage {
  private crisisState: CrisisState;
  
  constructor() {
    this.crisisState = {
      crisisType: "Unknown",
      location: "Unknown",
      severityLevel: "Low",
      confidence: 0,
      evidence: [],
      recommendedActions: ["Monitor for incoming signals."],
      risksAndUncertainties: "No data available yet.",
      reasoning: "System initialized. Waiting for first signal.",
      lastUpdated: new Date().toISOString()
    };
  }

  async getCrisisState(): Promise<CrisisState> {
    return this.crisisState;
  }

  async updateCrisisState(state: CrisisState): Promise<CrisisState> {
    this.crisisState = { ...state, lastUpdated: new Date().toISOString() };
    return this.crisisState;
  }

  async createSignal(insertSignal: InsertSignal): Promise<Signal> {
    const [signal] = await db.insert(signals).values(insertSignal).returning();
    return signal;
  }

  async getSignals(): Promise<Signal[]> {
    return await db.select().from(signals).orderBy(signals.timestamp);
  }
}

export const storage = new MemStorage();
