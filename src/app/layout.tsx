import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter from next/font/google
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// Initialize Inter font with subsets and a CSS variable
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // Define a CSS variable for the font
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
      {/* 
        Apply the Inter font's CSS variable class to the body.
        The 'font-sans' Tailwind utility class will then use this CSS variable.
      */}
      <body className={`${inter.variable} font-sans antialiased`}>
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
