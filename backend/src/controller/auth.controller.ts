import { Hono } from 'hono';
import { auth } from '../config/auth.js';

const authController = new Hono();

// Montar el handler nativo de Better Auth
authController.on(['POST', 'GET'], '/*', (c) => {
  return auth.handler(c.req.raw);
});

export { authController };
