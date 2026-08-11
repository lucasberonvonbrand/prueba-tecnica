import { z } from 'zod';

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(150, 'El título es muy largo'),
  content: z
    .string()
    .min(1, 'El contenido es obligatorio')
    .max(10000, 'El contenido es demasiado largo (máximo 10.000 caracteres)'),
  coverImageUrl: z
    .string()
    .url('Debe ser una URL válida')
    .or(z.literal('')),
});
