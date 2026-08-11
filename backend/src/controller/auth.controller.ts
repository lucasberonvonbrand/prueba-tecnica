import { Hono } from 'hono';
import { auth } from '../config/auth.js';

const authController = new Hono();

authController.on(['POST', 'GET'], '/*', (c) => {
  return auth.handler(c.req.raw);
});

export { authController };
