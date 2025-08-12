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
      prompt: `A stunning, high-quality book cover for a ${input.genre} book titled "${input.title}". The story is about: ${input.summary}. The cover should be visually appealing and suitable for a best-selling novel. Avoid text on the cover.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed to return media.');
    }

    return {imageUrl: media.url};
  }
);
