import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/core/auth/auth-client';
import { Tabs, Tab } from '@heroui/react';
import { LoginFormComponent } from '@/features/auth/components/LoginForm';
import { RegisterFormComponent } from '@/features/auth/components/RegisterForm';

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (session) {
        throw redirect({
          to: '/dashboard',
        });
      }
    } catch (error) {
      if (error instanceof Response || (error as any)?.status === 302) {
        throw error;
      }
    }
  },
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-8 px-4 bg-[#FDFBF7]">
      <div className="w-full max-w-md">
        <Tabs aria-label="Opciones de Autenticación" fullWidth size="lg">
          <Tab key="login" title="Iniciar Sesión">
            <div className="w-full h-full">
              <LoginFormComponent />
            </div>
          </Tab>
          <Tab key="register" title="Crear Cuenta">
            <div className="w-full h-full">
              <RegisterFormComponent />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
