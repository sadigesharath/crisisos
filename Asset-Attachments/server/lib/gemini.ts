import { GoogleGenerativeAI } from "@google/generative-ai";
import { CrisisState, Signal } from "@shared/schema";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `You are CrisisOS, an autonomous crisis reasoning system.
You maintain a persistent internal crisis state across time.
You do not reset context between inputs.

For each new signal:
1. Compare it with the existing crisis state
2. Detect escalation, de-escalation, or contradiction
3. Update severity and confidence
4. Recommend actions
5. Explain reasoning clearly
6. Identify risks and uncertainties

Always output structured JSON with:
- updatedState (the full crisis state object including all fields)
- recommendedActions
- reasoning
- risksAndUncertainties

The crisis state schema has:
- crisisType (string)
- location (string)
- severityLevel ("Low" | "Moderate" | "High" | "Critical")
- confidence (number 0-100)
- evidence (array of strings)
- recommendedActions (array of strings)
- risksAndUncertainties (string)
- reasoning (string)
- lastUpdated (ISO string)
`;

export async function analyzeSignal(currentState: CrisisState, signal: Signal): Promise<any> {
  const prompt = `
    ${SYSTEM_PROMPT}

    CURRENT CRISIS STATE:
    ${JSON.stringify(currentState, null, 2)}

    NEW SIGNAL:
    Type: ${signal.type}
    Description: ${signal.description}
    Timestamp: ${new Date().toISOString()}

    Analyze this signal and output the JSON response.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks in response
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze signal with Gemini");
  }
}
