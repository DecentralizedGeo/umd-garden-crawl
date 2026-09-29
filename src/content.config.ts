import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Q&A pairs. `answer` may wrap a phrase in {{double braces}} to flag it as
// Provisional (pending organizer approval) — see src/lib/provisional.ts.
const faq = defineCollection({
  loader: file('src/content/faq/faq.json'),
  schema: z.object({
    category: z.string(),
    question: z.string(),
    answer: z.string(),
    // getCollection doesn't preserve the source file's array order, so this
    // is the explicit sort key for both category grouping and question order.
    order: z.number(),
  }),
});

// Event categories (Home teasers + Compete cards). `summary`, `detail`, and
// `tieBreaker` may wrap a phrase in {{double braces}} to flag it as
// Provisional — see src/lib/provisional.ts.
const categories = defineCollection({
  loader: file('src/content/categories/categories.json'),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    detail: z.string().optional(),
    tieBreaker: z.string().optional(),
    // getCollection doesn't preserve the source file's array order, so this
    // is the explicit sort key. Categories has no FAQ-style grouping key.
    order: z.number(),
  }),
});

export const collections = { faq, categories };
