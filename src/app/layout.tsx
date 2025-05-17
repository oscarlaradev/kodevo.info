import type { Metadata } from 'next';
import { GeistSans } from 'next/font/google'; // Corrected import
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

const geistSans = GeistSans({ // Corrected instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CodeCanvas - Developer Portfolio',
  description: 'A minimalist and modern developer portfolio by a senior programmer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          <main className="pt-20 md:pt-24 min-h-[calc(100vh-5rem)] overflow-x-hidden">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
