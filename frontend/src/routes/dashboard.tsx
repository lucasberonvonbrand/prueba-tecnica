import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/core/auth/auth-client';
import { Button } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { ArticleCrud } from '@/features/articles/components/ArticleCrud';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session) {
        throw redirect({
          to: '/auth',
        });
      }
    } catch (error) {
      if (error instanceof Response || (error as any)?.status === 302) {
        throw error;
      }
      throw redirect({
        to: '/auth',
      });
    }
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: '/auth' });
  };

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
