// src/lib/actions/stories.ts
"use server";

import { generateCoverImage } from "@/ai/flows/generate-cover-image";
import { type GenerateCoverImageInput } from "@/ai/flows/types";
import { continueStory } from "@/ai/flows/continue-story";

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

export async function continueStoryAction(existingText: string) {
  try {
    const result = await continueStory({ existingText });
    return result;
  } catch (error) {
    console.error("Error continuing story:", error);
    return { error: "Failed to generate story continuation. Please try again." };
  }
}
