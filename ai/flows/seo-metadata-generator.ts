'use server';

/**
 * @fileOverview A flow that generates SEO metadata (meta titles and descriptions) for product listing and detail pages.
 *
 * - generateSeoMetadata - A function that generates SEO metadata.
 * - GenerateSeoMetadataInput - The input type for the generateSeoMetadata function.
 * - GenerateSeoMetadataOutput - The return type for the generateSeoMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  pageContent: z
    .string()
    .describe('The content of the page to generate SEO metadata for.'),
  pageType: z
    .enum(['productListing', 'productDetail'])
    .describe('The type of page to generate SEO metadata for.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  metaTitle: z.string().describe('The generated meta title for the page.'),
  metaDescription: z.string().describe('The generated meta description for the page.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;

export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `You are an SEO expert. Generate SEO metadata for the following page content.

Page Type: {{{pageType}}}
Page Content: {{{pageContent}}}

Consider the page type and content when generating the meta title and description. The meta title should be concise and include relevant keywords. The meta description should be a brief summary of the page content, enticing users to click on the search result.

Ensure that the meta title and description are optimized for search engines. The meta title should be no more than 60 characters. The meta description should be no more than 160 characters.

Output the meta title and description in JSON format.

{
  "metaTitle": "",
  "metaDescription": ""
}`,
});

const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
