import {
  createRootRouteWithContext,
  Outlet,
} from '@tanstack/react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { HeroUIProvider } from '@heroui/react'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

import { useAuth } from '@/features/auth/hooks/useAuth'

function RootComponent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <HeroUIProvider className="flex flex-col flex-grow">
        <Navbar maxWidth="xl" isBordered className="py-2">
          <NavbarBrand>
            <Link to="/" className="font-serif font-black text-primary text-3xl tracking-tight">El Periódico.</Link>
          </NavbarBrand>
          
          <NavbarContent className="sm:flex gap-8" justify="center">
            <NavbarItem>
              <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
                Artículos
              </Link>
            </NavbarItem>
            {isAuthenticated && (
              <NavbarItem>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                  Mi Dashboard
                </Link>
              </NavbarItem>
            )}
          </NavbarContent>
          
          <NavbarContent justify="end">
            <NavbarItem>
              {isAuthenticated ? (
                <button 
                  onClick={() => logout().then(() => window.location.href = '/')} 
                  className="text-gray-500 hover:text-primary font-medium transition-colors"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link to="/auth" className="text-primary font-bold px-4 py-2 rounded-full border border-primary hover:bg-primary hover:text-white transition-all">
                  Iniciar sesión
                </Link>
              )}
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        
        <main className="flex-grow">
          <Outlet />
        </main>

        <footer className="w-full border-t border-gray-200 py-8 mt-12 bg-secondary/10">
          <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-serif font-black text-xl text-primary">El Periódico.</div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Creado para la prueba técnica.</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors">Privacidad</Link>
              <Link to="/" className="hover:text-primary transition-colors">Términos</Link>
            </div>
          </div>
        </footer>
      </HeroUIProvider>
    </div>
  )
}
