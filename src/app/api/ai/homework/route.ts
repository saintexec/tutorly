import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { notes, focusAreas } = await req.json();

    // CRITICAL: Check if API key is defined in the environment
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("[CRITICAL ERROR]: GOOGLE_GENERATIVE_AI_API_KEY is missing from environment variables.");
      return NextResponse.json({ 
        error: "Sync Error", 
        message: "API KEY MISSING IN ENV" 
      }, { status: 500 });
    }

    // Latest initialization pattern as requested
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
    });

    if (!notes && (!focusAreas || focusAreas.length === 0)) {
      return NextResponse.json({ 
        error: "Missing Content", 
        message: "Please provide either session notes or focus areas to generate homework." 
      }, { status: 400 });
    }

    const prompt = `Based on these tutor notes: "${notes}" and the specific focus areas: [${focusAreas.join(", ")}], suggest 3 specific, actionable homework tasks and 2 revision topics for the student. Keep the tone concise, professional yet encouraging.`;

    // Verify the prompt is not empty in the terminal
    console.log("[Gemini API Request] Sending prompt:", prompt);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ homework: text });
  } catch (error: any) {
    console.error("[Gemini API Error Log]:", error.message || error);
    
    const errorMessage = error.message || "An unexpected error occurred during AI generation.";
    
    return NextResponse.json({ 
      error: "Generation Failed", 
      message: errorMessage 
    }, { status: 500 });
  }
}
