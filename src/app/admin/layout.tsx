// src/app/admin/layout.tsx
"use client";

import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Si no estamos cargando y no hay usuario, redirigir a login.
    if (!loading && !user) {
      console.log("[AdminLayout] No hay usuario, redirigiendo a /login");
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, loading, router, pathname]);

  // Mientras el estado de autenticación se está verificando por primera vez, muestra un loader.
  // Esto previene errores de hidratación y acceso prematuro.
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Verificando autenticación...</p>
      </div>
    );
  }

  // Si después de verificar no hay usuario, no renderices el contenido de admin.
  // La redirección del useEffect se encargará de llevarlo a /login.
  // Puedes mostrar un loader para que la transición sea suave.
  if (!user) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirigiendo a inicio de sesión...</p>
      </div>
    );
  }

  // Si hay un usuario y la carga ha terminado, muestra el contenido de la página de administración.
  return (
    <div className="bg-muted/40 min-h-screen">
      {children}
    </div>
  );
}
