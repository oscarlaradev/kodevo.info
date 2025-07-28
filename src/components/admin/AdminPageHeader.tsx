// src/components/admin/AdminPageHeader.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // For other actions like "Add New" button
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  const { user, logout, loading: authLoading } = useAuth();

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          {children && <div className="flex-shrink-0">{children}</div>}
          {user && !authLoading && (
            <Button variant="outline" size="sm" onClick={logout} title="Cerrar sesión">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
