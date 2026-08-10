import { createFileRoute } from '@tanstack/react-router';
import { Tabs, Tab } from '@heroui/react';
import { LoginFormComponent } from '@/features/auth/components/LoginForm';
import { RegisterFormComponent } from '@/features/auth/components/RegisterForm';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
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
