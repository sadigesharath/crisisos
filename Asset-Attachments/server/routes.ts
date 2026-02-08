import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { analyzeSignal } from "./lib/gemini";
import { insertSignalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.crisis.analyze.path, async (req, res) => {
    try {
      // 1. Validate Input
      const signalData = insertSignalSchema.parse(req.body);

      // 2. Persist Signal (Optional for MVP but good for history)
      const savedSignal = await storage.createSignal(signalData);

      // 3. Get Current State
      const currentState = await storage.getCrisisState();

      // 4. Call Gemini
      console.log("Analyzing signal with Gemini...");
      const analysisResult = await analyzeSignal(currentState, savedSignal);
      
      console.log("Gemini Analysis Result:", analysisResult);

      // 5. Update State
      // The Gemini response structure matches what we expect, but let's be safe
      const newState = analysisResult.updatedState;
      
      // Ensure specific fields from analysis are merged correctly if structure differs slightly
      // but primarily we trust the structured JSON output.
      // We also update the top-level recommendations/reasoning which might be outside updatedState in the prompt response
      // or inside. The prompt asked for specific structure. 
      
      // Based on prompt:
      // { updatedState, recommendedActions, reasoning, risksAndUncertainties }
      
      // We need to merge this into a single CrisisState object for storage
      const mergedState = {
        ...newState,
        recommendedActions: analysisResult.recommendedActions || newState.recommendedActions,
        reasoning: analysisResult.reasoning || newState.reasoning,
        risksAndUncertainties: analysisResult.risksAndUncertainties || newState.risksAndUncertainties,
      };

      const updatedState = await storage.updateCrisisState(mergedState);

      // 6. Return Response
      res.json({
        crisisState: updatedState,
        recommendedActions: updatedState.recommendedActions,
        reasoning: updatedState.reasoning,
        risksAndUncertainties: updatedState.risksAndUncertainties,
      });

    } catch (error) {
      console.error("Error in /api/analyze:", error);
      res.status(500).json({ message: "Failed to process signal" });
    }
  });

  app.get(api.crisis.getState.path, async (req, res) => {
    try {
      const state = await storage.getCrisisState();
      res.json(state);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch state" });
    }
  });

  return httpServer;
}
