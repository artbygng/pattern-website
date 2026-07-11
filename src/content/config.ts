import { defineCollection, z } from 'astro:content';

const patterns = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    coverImage: z.string(),
    etsy_url: z.string().url(),
    // One accent color pulled from the pattern's photography, e.g. terracotta, sage, mustard
    accentColor: z.string().optional().default('#C4714F'),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    images: z.array(z.string()).optional().default([]),
    details: z.array(z.object({ label: z.string(), value: z.string() })).optional().default([]),
    videoUrl: z.string().optional(),
    playVideo: z.string().optional(),
    flipVideo: z.string().optional(),
    skillNotes: z.object({
      easy: z.array(z.string()),
      patient: z.array(z.string()),
      instructionImage: z.string().optional(),
    }).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional().default([]),
    customerQuotes: z.array(z.object({
      quote: z.string(),
      author: z.string(),
      image: z.string().optional(),
      date: z.string().optional(),
    })).optional().default([]),
  }),
});

export const collections = { patterns };
