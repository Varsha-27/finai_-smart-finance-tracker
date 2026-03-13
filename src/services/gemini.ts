import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export async function categorizeTransaction(description: string): Promise<string> {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment variables.");
    return "Other";
  }

  console.log("Starting AI categorization for:", description);

  // Create a timeout promise
  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error("Gemini API request timed out after 10 seconds")), 10000)
  );

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const apiCall = (async () => {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Categorize this transaction description into one of these categories: Food, Transport, Rent, Utilities, Entertainment, Shopping, Health, Income, Other. 
        Description: "${description}"
        Return only the category name.`,
      });
      return response.text?.trim() || "Other";
    })();

    // Race the API call against the timeout
    const result = await Promise.race([apiCall, timeoutPromise]);
    console.log("AI Categorization result:", result);
    return result;

  } catch (error) {
    console.error("AI Categorization failed or timed out:", error);
    // Return "Other" as a safe fallback so the UI doesn't break
    return "Other";
  }
}
