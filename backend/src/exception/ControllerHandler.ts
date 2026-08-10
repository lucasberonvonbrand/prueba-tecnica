import type { ErrorHandler } from 'hono';
import { ApiError } from './ApiError.js';
import { ZodError } from 'zod';

export const controllerHandler: ErrorHandler = (err, c) => {
  // Manejo de errores personalizados (ApiError)
  if (err instanceof ApiError) {
    return c.json(
      {
        message: err.message,
        httpStatus: err.status,
        timestamp: err.timestamp,
      },
      err.status as any // type casting to StatusCode
    );
  }

  // Manejo de errores de validación (Zod)
  if (err instanceof ZodError) {
    let errorMessage = '';
    
    err.errors.forEach((e) => {
      if (e.path.length > 0) {
        errorMessage += `${e.path.join('.')}: ${e.message}. `;
      } else {
        errorMessage += `${e.message}. `;
      }
    });

    return c.json(
      {
        message: errorMessage.trim(),
        httpStatus: 400,
        timestamp: new Date().toISOString(),
      },
      400
    );
  }

  // Manejo de errores genéricos de @hono/zod-validator
  // A veces el validator tira su propia excepción, intentamos capturarla
  if (err.name === 'Error' && err.message.includes('Validation')) {
     return c.json(
      {
        message: err.message,
        httpStatus: 400,
        timestamp: new Date().toISOString(),
      },
      400
    );
  }

  // Errores no controlados (500)
  console.error('Unhandled Exception:', err);
  return c.json(
    {
      message: 'Error interno del servidor',
      httpStatus: 500,
      timestamp: new Date().toISOString(),
    },
    500
  );
};
