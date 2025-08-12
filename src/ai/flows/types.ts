
import {z} from 'genkit';

/**
 * @fileOverview This file contains the type definitions for Genkit flows.
 * It is separate from the flow implementations to avoid "use server" conflicts.
 */

export const GenerateCoverImageInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  genre: z.string().describe('The genre of the book.'),
  summary: z.string().describe('A brief summary of the book.'),
});
export type GenerateCoverImageInput = z.infer<
  typeof GenerateCoverImageInputSchema
>;

export const GenerateCoverImageOutputSchema = z.object({
  imageUrl: z
    .string()
    .describe('The data URI of the generated cover image.'),
});
export type GenerateCoverImageOutput = z.infer<
  typeof GenerateCoverImageOutputSchema
>;
