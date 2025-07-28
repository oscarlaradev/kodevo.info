// src/app/providers.tsx
"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider> {/* Wrap children with AuthProvider */}
      {children}
    </AuthProvider>
  );
}
