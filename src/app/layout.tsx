import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Import GeistSans from the correct package
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// The GeistSans object from 'geist/font/sans' directly provides .variable (a class name that sets up the CSS variable)
// No need to call it as a function or pass options like 'subsets' or 'variable' name here.
// The CSS variable (e.g., --font-geist-sans) is automatically defined by the class GeistSans.variable.

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
        Apply GeistSans.variable class to the body (or html) tag.
        This class name (e.g., "__geist_sans_variable_xxxxxx") defines the CSS variable --font-geist-sans.
        The 'font-sans' Tailwind utility class will then use this CSS variable if Tailwind is configured.
      */}
      <body className={`${GeistSans.variable} font-sans antialiased`}>
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
