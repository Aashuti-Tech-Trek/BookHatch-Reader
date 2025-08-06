"use server";

import { generateReadingRecommendations } from "@/ai/flows/generate-reading-recommendations";

export async function getRecommendations(genres: string[]) {
  try {
    const result = await generateReadingRecommendations({ preferredGenres: genres });
    return result;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to get recommendations from AI flow.");
  }
}
