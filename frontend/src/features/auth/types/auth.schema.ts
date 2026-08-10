import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

// Inferimos los tipos (Similar a las interfaces de Angular)
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
