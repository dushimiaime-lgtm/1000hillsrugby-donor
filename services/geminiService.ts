
import { GoogleGenAI } from "@google/genai";

// Safe access to process.env.API_KEY
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateProjectDescription(topic: string) {
  if (!ai) return "AI services are not configured.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling and emotional charity project description for: ${topic}. Keep it professional, empathetic, and under 150 words. Focus on the impact and call to action.`,
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating content. Please try manual entry.";
  }
}

export async function generateThankYouNote(donorName: string, amount: number, projectTitle: string) {
  if (!ai) return "Thank you so much for your generous support!";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, heartwarming thank you note to ${donorName} for donating $${amount} to the project "${projectTitle}". Mention how their contribution helps the community.`,
    });
    return response.text || "Thank you so much for your generous support!";
  } catch (error) {
    return "Thank you so much for your generous support!";
  }
}
