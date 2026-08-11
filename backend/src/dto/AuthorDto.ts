import { z } from 'zod';
import { articleResponseSchema } from './ArticleDto.js';

export const authorResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  articles: z.array(articleResponseSchema),
});

export type AuthorResponse = z.infer<typeof authorResponseSchema>;
