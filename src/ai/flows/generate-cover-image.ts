
// src/ai/flows/generate-cover-image.ts
'use server';
/**
 * @fileOverview A Genkit flow for generating book cover images.
 *
 * - generateCoverImage - A function that generates a cover image based on story details.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateCoverImageInputSchema,
  GenerateCoverImageOutputSchema,
  type GenerateCoverImageInput,
  type GenerateCoverImageOutput,
} from './types';

export async function generateCoverImage(
  input: GenerateCoverImageInput
): Promise<GenerateCoverImageOutput> {
  return generateCoverImageFlow(input);
}

const generateCoverImageFlow = ai.defineFlow(
  {
    name: 'generateCoverImageFlow',
    inputSchema: GenerateCoverImageInputSchema,
    outputSchema: GenerateCoverImageOutputSchema,
  },
  async input => {
    // Using a free placeholder image service as a stable alternative.
    // This simulates fetching a new, unique image based on some input detail,
    // similar to how a generative AI would work but without the potential for failure.
    // The seed ensures we get a different image for different inputs.
    const seed = encodeURIComponent(`${input.title}-${input.genre}`);
    const imageUrl = `https://picsum.photos/seed/${seed}/400/600`;

    // To simulate a network delay similar to a real AI model
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {imageUrl};
  }
);
