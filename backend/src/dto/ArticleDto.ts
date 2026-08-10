import { z } from 'zod';

// DTO para la creación y edición
export const articleBodySchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(150, 'El título es muy largo'),
  content: z.string().min(1, 'El contenido es obligatorio'),
  coverImageUrl: z.string().url('URL inválida').optional(),
});

export type ArticleBodyRequest = z.infer<typeof articleBodySchema>;

// DTO para la respuesta de un artículo
export const articleResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  coverImageUrl: z.string().optional(),
  authorId: z.string(),
  authorName: z.string(),
  createdAt: z.string(), // Convertido a string ISO
});

export type ArticleResponse = z.infer<typeof articleResponseSchema>;

// DTO para parámetros de paginación y búsqueda
export const articleQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
});

export type ArticleQuery = z.infer<typeof articleQuerySchema>;
