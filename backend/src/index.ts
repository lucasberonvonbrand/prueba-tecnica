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

// Middlewares globales
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4000', 'http://backend:3000'], 
  credentials: true,
}));

// Manejador global de excepciones
app.onError(controllerHandler);

// Rutas
app.route('/api/auth', authController);
app.route('/api/articles', articleController);
app.route('/api/public', publicController);

// Health check
app.get('/health', (c) => c.text('OK'));

const port = Number(process.env.PORT) || 3000;

// Inicializar Auth y arrancar el servidor
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
