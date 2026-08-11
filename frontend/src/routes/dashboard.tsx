import { createFileRoute, redirect } from '@tanstack/react-router';
import { authClient } from '@/core/auth/auth-client';
import { ArticleCrud } from '@/features/articles/components/ArticleCrud';
import { Skeleton } from '@heroui/react';

function DashboardSkeleton() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 space-y-2">
        <Skeleton className="w-48 h-9 rounded-lg" />
        <Skeleton className="w-64 h-5 rounded-full" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="w-36 h-7 rounded-lg" />
          <Skeleton className="w-32 h-9 rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-full h-24 rounded-xl" />
          <Skeleton className="w-full h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

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
  pendingComponent: DashboardSkeleton,
  component: DashboardPage,
});

function DashboardPage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {isSessionLoading || !session ? (
          <Skeleton className="w-48 h-5 rounded-full mt-2" />
        ) : (
          <p className="text-gray-600">Bienvenido, {session?.user?.name || session?.user?.email}</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-8">
        <ArticleCrud />
      </div>
    </div>
  );
}
