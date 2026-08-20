import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { initAuth } from './config/auth.js';
import { controllerHandler } from './exception/ControllerHandler.js';
import { authController } from './controller/auth.controller.js';
import { articleController } from './controller/article.controller.js';
import { publicController } from './controller/public.controller.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: (origin) => {
    if (origin && (origin.includes('localhost') || origin.includes('.onrender.com'))) {
      return origin;
    }
    return 'http://localhost:5173';
  },
  credentials: true,
}));

app.onError(controllerHandler);

app.route('/api/auth', authController);
app.route('/api/articles', articleController);
app.route('/api/public', publicController);

app.get('/', (c) => c.text('OK'));
app.get('/health', (c) => c.text('OK'));

const port = Number(process.env.PORT) || 3000;

initAuth().then(() => {
  console.log(`Servidor Hono iniciado en el puerto ${port}`);
  serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0'
  });
}).catch(err => {
  console.error('Error al inicializar la aplicación', err);
  process.exit(1);
});
