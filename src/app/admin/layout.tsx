// src/app/admin/layout.tsx
"use client";

import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'; // For logout button

// Make sure Tailwind processes classes used in admin pages
import '@/app/globals.css'; 

// No static metadata export here, as this is a Client Component

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=${pathname}`); // Redirect to login if not authenticated
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Verificando autenticación...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be caught by the useEffect redirect,
    // but as a fallback or if rendering occurs before redirect completes.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
        <p className="text-lg text-muted-foreground">Redirigiendo a la página de inicio de sesión...</p>
      </div>
    );
  }

  // User is authenticated, render the admin layout content
  return (
    <div className="bg-muted/40 min-h-screen">
      {/* 
        A more persistent admin-specific header or sidebar could go here,
        outside the individual page's {children}.
        For now, the AdminPageHeader component inside each page can handle logout.
      */}
      {children}
    </div>
  );
}
