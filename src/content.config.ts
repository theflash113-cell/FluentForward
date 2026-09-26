import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts: one Markdown file per post in src/content/blog/
// (files starting with _ are ignored, e.g. _TEMPLATE.md)
const blog = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string().default('Tips'),
    readMinutes: z.number().default(4),
    draft: z.boolean().default(false),
  }),
});

// Free resources: one Markdown file per resource in src/content/resources/
// Put the PDF itself in public/resources/ and write its name in "file".
const resources = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string(),
    level: z.string().optional(),
    order: z.number().default(100),
  }),
});

export const collections = { blog, resources };
