import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react'
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
    <div className="min-h-screen bg-[#FDFBF7] text-foreground font-sans flex flex-col">
      <HeroUIProvider className="flex flex-col flex-grow">
        <Navbar maxWidth="xl" className="bg-[#F2E8D8] py-2 border-b border-[#E0D2BC]">
          <NavbarBrand>
            <Link to="/" className="font-serif font-black text-primary text-3xl tracking-tight">El Periódico.</Link>
          </NavbarBrand>
          
          {isAuthenticated && (
            <NavbarContent className="sm:flex gap-8" justify="center">
              <NavbarItem>
                <Link 
                  to="/" 
                  activeOptions={{ exact: true }}
                  className="text-stone-700 hover:text-primary transition-all font-medium py-2 text-sm tracking-wide border-b-2 border-transparent"
                  activeProps={{
                    className: "text-primary font-bold border-b-2 border-primary"
                  }}
                >
                  Artículos
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link 
                  to="/dashboard" 
                  className="text-stone-700 hover:text-primary transition-all font-medium py-2 text-sm tracking-wide border-b-2 border-transparent"
                  activeProps={{
                    className: "text-primary font-bold border-b-2 border-primary"
                  }}
                >
                  Mi Dashboard
                </Link>
              </NavbarItem>
            </NavbarContent>
          )}
          
          <NavbarContent justify="end">
            <NavbarItem>
              {isAuthenticated ? (
                <button 
                  onClick={() => logout().then(() => window.location.href = '/')}
                  className="text-primary font-bold px-4 py-2 rounded-full border border-primary hover:bg-primary hover:text-white transition-all text-sm cursor-pointer"
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link to="/auth" className="text-primary font-bold px-4 py-2 rounded-full border border-primary hover:bg-primary hover:text-white transition-all text-sm">
                  Iniciar sesión
                </Link>
              )}
            </NavbarItem>
          </NavbarContent>
        </Navbar>
        
        <main className="flex-grow flex flex-col">
          <ScrollRestoration />
          <Outlet />
        </main>

        <footer className="w-full py-8 mt-auto bg-[#F2E8D8] border-t border-[#E0D2BC]">
          <div className="max-w-5xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-serif font-black text-2xl text-primary">El Periódico.</div>
            <p className="text-stone-600 text-sm">© {new Date().getFullYear()} Creado para la prueba técnica.</p>
          </div>
        </footer>
      </HeroUIProvider>
    </div>
  )
}
