import { z } from 'zod';

export const authorResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  articles: z.array(z.any()),
});

export type AuthorResponse = z.infer<typeof authorResponseSchema>;
