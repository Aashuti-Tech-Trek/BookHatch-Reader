// src/lib/actions/stories.ts
"use server";

import { generateCoverImage, type GenerateCoverImageInput } from "@/ai/flows/generate-cover-image";

export async function generateCoverImageAction(input: GenerateCoverImageInput) {
  try {
    const result = await generateCoverImage(input);
    return result;
  } catch (error) {
    console.error("Error generating cover image:", error);
    // It's better to return a structured error than to throw
    return { error: "Failed to generate cover image. Please try again." };
  }
}
