import { createMiddleware } from 'hono/factory';
import { auth } from '../config/auth.js';
import { UnauthorizedException } from '../exception/ApiError.js';

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session || !session.user) {
    throw new UnauthorizedException('Debes iniciar sesión para acceder a este recurso');
  }

  c.set('user', session.user);
  await next();
});
