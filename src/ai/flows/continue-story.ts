// src/ai/flows/continue-story.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for continuing a story.
 *
 * The flow takes existing story text as input and returns a plausible continuation.
 * - continueStory - A function that generates the next part of a story.
 * - ContinueStoryInput - The input type for the continueStory function.
 * - ContinueStoryOutput - The return type for the continueStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContinueStoryInputSchema = z.object({
  existingText: z
    .string()
    .describe('The existing text of the story to be continued.'),
});
export type ContinueStoryInput = z.infer<typeof ContinueStoryInputSchema>;

const ContinueStoryOutputSchema = z.object({
  continuation: z
    .string()
    .describe('The generated continuation of the story.'),
});
export type ContinueStoryOutput = z.infer<typeof ContinueStoryOutputSchema>;

export async function continueStory(
  input: ContinueStoryInput
): Promise<ContinueStoryOutput> {
  return continueStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'continueStoryPrompt',
  input: {schema: ContinueStoryInputSchema},
  output: {schema: ContinueStoryOutputSchema},
  prompt: `You are a creative writing assistant. Your task is to continue the story provided by the user.
Read the following text and write the next paragraph. The continuation should match the tone, style, and plot of the existing text.
Do not repeat the existing text in your response. Only provide the new, generated paragraph.

Existing story:
---
{{{existingText}}}
---
`,
});

const continueStoryFlow = ai.defineFlow(
  {
    name: 'continueStoryFlow',
    inputSchema: ContinueStoryInputSchema,
    outputSchema: ContinueStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
