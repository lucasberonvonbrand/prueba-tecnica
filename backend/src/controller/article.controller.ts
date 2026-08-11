import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { articleService } from '../service/article.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { articleBodySchema, articleQuerySchema } from '../dto/ArticleDto.js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const articleController = new Hono<{ Variables: { user: AuthUser } }>();

articleController.use('*', authMiddleware);

articleController.post('/', zValidator('json', articleBodySchema), async (c) => {
  const user = c.get('user');
  const body = c.req.valid('json');
  
  const article = await articleService.createArticle(body, user.id, user.name);
  return c.json(article, 201);
});

articleController.get('/', zValidator('query', articleQuerySchema), async (c) => {
  const user = c.get('user');
  const { page, limit } = c.req.valid('query');
  
  const result = await articleService.getOwnArticles(user.id, page, limit);
  return c.json(result);
});

articleController.put('/:id', zValidator('json', articleBodySchema.partial()), async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = c.req.valid('json');
  
  const article = await articleService.updateArticle(id, user.id, body);
  return c.json(article);
});

articleController.delete('/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  
  await articleService.deleteArticle(id, user.id);
  return c.body(null, 204);
});

export { articleController };
