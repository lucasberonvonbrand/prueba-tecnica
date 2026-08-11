import { z } from 'zod';

export const articleBodySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(150, 'El título es muy largo'),
  content: z.string().min(1, 'El contenido es obligatorio'),
  coverImageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
});

export type ArticleBodyRequest = z.infer<typeof articleBodySchema>;

export const articleResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  coverImageUrl: z.string().optional(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string(),
});

export type ArticleResponse = z.infer<typeof articleResponseSchema>;

export const articleQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('5'),
  search: z.string().optional(),
});

export type ArticleQuery = z.infer<typeof articleQuerySchema>;
