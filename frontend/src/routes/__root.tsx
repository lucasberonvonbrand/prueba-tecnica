import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroLink } from '@heroui/react'
import { Link } from '@tanstack/react-router'

import { HeroUIProvider } from '@heroui/react'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <HeroUIProvider>
          <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
              <Link to="/" className="font-bold text-inherit text-xl">GestorArtículos</Link>
            </NavbarBrand>
            <NavbarContent className="sm:flex gap-4" justify="center">
              <NavbarItem>
                <Link to="/" className="text-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>
                <Link to="/auth" className="text-primary font-medium">
                  Login
                </Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </HeroUIProvider>
        <Scripts />
      </body>
    </html>
  )
}
