import { signIn, signUp, signOut, useSession } from '@/core/auth/auth-client';
import type { LoginForm, RegisterForm } from '../types/auth.schema';

/**
 * Este Custom Hook funciona como nuestro AuthService en Angular.
 * Encapsula la lógica de autenticación y maneja los errores.
 */
export const useAuth = () => {
  const { data: session, isPending: isSessionLoading } = useSession();

  const login = async (data: LoginForm) => {
    const res = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (res.error) throw res.error;
    return res.data;
  };

  const register = async (data: RegisterForm) => {
    const res = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (res.error) throw res.error;
    return res.data;
  };

  const logout = async () => {
    return await signOut();
  };

  return {
    session,
    isSessionLoading,
    isAuthenticated: !!session?.user,
    login,
    register,
    logout,
  };
};
