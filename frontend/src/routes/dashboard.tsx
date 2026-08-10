import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/core/auth/auth-client';
import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { ArticleCrud } from '@/features/articles/components/ArticleCrud';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  
  // Realizamos la validación de sesión exclusivamente en el cliente 
  // para que el navegador adjunte automáticamente la Cookie al backend.
  if (typeof window !== 'undefined' && !isPending && !session) {
    navigate({ to: '/auth' });
  }

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: '/auth' });
  };

  if (isPending) {
    return <div className="p-8 text-center text-gray-500">Verificando sesión...</div>;
  }

  if (!session) {
    return null; // El hook de navegación ya se encarga de redirigir
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {session?.user?.name || session?.user?.email}</p>
        </div>
        <Button color="danger" variant="flat" onPress={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
        <ArticleCrud />
      </div>
    </div>
  );
}
