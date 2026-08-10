import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { publicService } from '../service/public.service.js';
import { articleQuerySchema } from '../dto/ArticleDto.js';

const publicController = new Hono();

// Obtener autores con count de artículos
publicController.get('/authors', async (c) => {
  const authors = await publicService.getAuthors();
  return c.json(authors);
});

// Buscar artículos públicos
publicController.get('/articles', zValidator('query', articleQuerySchema), async (c) => {
  const { page, limit, search } = c.req.valid('query');
  const result = await publicService.searchArticles(search || '', page, limit);
  return c.json(result);
});

// Detalle de un artículo
publicController.get('/articles/:id', async (c) => {
  const id = c.req.param('id');
  const article = await publicService.getArticleById(id);
  return c.json(article);
});

export { publicController };
