"use client";

import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // In the future, you can add ThemeProvider or other client-side providers here
  return <>{children}</>;
}
