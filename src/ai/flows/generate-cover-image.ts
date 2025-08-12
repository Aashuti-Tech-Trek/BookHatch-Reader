
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
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a book cover for a ${input.genre} novel titled "${input.title}". The story is about: ${input.summary}. The style should be evocative, professional, and suitable for a book cover. Do not include any text or titles on the image.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // Veo model options would go here if needed, but not for Flash image gen
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a URL.');
    }

    return {imageUrl: media.url};
  }
);
