import { createAuthClient } from 'better-auth/react';


// Inicializamos el cliente de Better Auth apuntando a nuestro backend
const isServer = typeof window === 'undefined';

export const authClient = createAuthClient({
  // En el cliente usamos origin (vacio) para pasar por el proxy de Vite
  baseURL: isServer ? 'http://backend:3000' : undefined,
});

// Exportamos las funciones y hooks que utilizaremos en toda la app
// 'useSession' funcionará como nuestro AuthGuard/AuthService reactivo
export const { signIn, signUp, signOut, useSession } = authClient;
