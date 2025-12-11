import { Client } from "google-genai" // Ensure you have the correct library installed

export interface GeminiResponse {
  reply: string
}

export async function fetchGeminiResponse(query: string, language: "en" | "kn"): Promise<GeminiResponse> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim()
  if (!GEMINI_API_KEY) {
    console.error("Error: Missing GEMINI_API_KEY environment variable")
    throw new Error("Missing GEMINI_API_KEY environment variable")
  }

  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

  // Construct the system prompt
  const systemPrompt =
    language === "kn"
      ? "You are a helpful assistant for Karnataka Census. Reply in Kannada."
      : "You are a helpful assistant for Karnataka Census. Reply in English."

  const promptText = `${systemPrompt}\n\nUser: ${query}`

  console.log("Sending request to Gemini API using genai.Client:", {
    model: GEMINI_MODEL,
    contents: promptText,
  })

  try {
    // Initialize the genai client
    const client = new Client({ apiKey: GEMINI_API_KEY })

    // Call the generate_content method
    const response = await client.models.generate_content({
      model: GEMINI_MODEL,
      contents: promptText,
    })

    console.log("Received response from Gemini API:", response)

    const reply = response?.text || "No response from the Gemini model."
    return { reply }
  } catch (error) {
    console.error("Error while fetching response from Gemini API:", error)
    throw error
  }
}