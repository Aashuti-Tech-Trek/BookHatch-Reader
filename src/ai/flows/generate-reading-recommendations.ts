// src/ai/flows/generate-reading-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized book recommendations.
 *
 * The flow takes preferred genres as input and returns a list of recommended books.
 * - generateReadingRecommendations - A function that generates reading recommendations.
 * - GenerateReadingRecommendationsInput - The input type for the generateReadingRecommendations function.
 * - GenerateReadingRecommendationsOutput - The return type for the generateReadingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadingRecommendationsInputSchema = z.object({
  preferredGenres: z
    .array(z.string())
    .describe('A list of the user\u2019s preferred book genres.'),
});
export type GenerateReadingRecommendationsInput = z.infer<
  typeof GenerateReadingRecommendationsInputSchema
>;

const GenerateReadingRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of recommended book titles.'),
});
export type GenerateReadingRecommendationsOutput = z.infer<
  typeof GenerateReadingRecommendationsOutputSchema
>;

export async function generateReadingRecommendations(
  input: GenerateReadingRecommendationsInput
): Promise<GenerateReadingRecommendationsOutput> {
  return generateReadingRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingRecommendationsPrompt',
  input: {schema: GenerateReadingRecommendationsInputSchema},
  output: {schema: GenerateReadingRecommendationsOutputSchema},
  prompt: `You are a book recommendation expert. Based on the user's preferred genres, recommend books they might enjoy.  Return the book titles in a numbered list.

Preferred Genres:
{{#each preferredGenres}}- {{{this}}}
{{/each}}`,
});

const generateReadingRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateReadingRecommendationsFlow',
    inputSchema: GenerateReadingRecommendationsInputSchema,
    outputSchema: GenerateReadingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
