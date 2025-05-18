import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css'; // Reuse global styles
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/app/providers'; // If you have global providers

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Admin Dashboard - CodeCanvas',
  description: 'Administración de CodeCanvas.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-muted/40`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            {/* We might add a specific Admin Sidebar/Header here later */}
            <main className="flex-grow p-4 md:p-8">
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
