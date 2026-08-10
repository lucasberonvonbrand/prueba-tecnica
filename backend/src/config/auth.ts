import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { dbConfig } from './db.js';
import { jwt } from 'better-auth/plugins';

// Better auth espera la instancia de la DB conectada
// Como dbConfig.connect() es asíncrono y se llama al iniciar el server,
// aquí exportaremos una función para inicializar Better Auth o usaremos
// un getter.

export let auth: any;

export const initAuth = async () => {
  const db = await dbConfig.connect();

  auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      // La verificación de email no es necesaria según el enunciado
      requireEmailVerification: false, 
    },
    plugins: [
      jwt({
         // Configuramos para que la sesión se devuelva como JWT
         // y la aplicación se mantenga stateless (sin guardar sesión en BD)
      })
    ],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: ['http://localhost:4000', 'http://backend:3000', 'http://localhost:5173'],
  });
};
