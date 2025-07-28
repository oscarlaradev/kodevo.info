import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google'; // Cambiado de Inter a Roboto_Flex
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// Inicializar Roboto_Flex con subconjuntos y una variable CSS
const roboto_flex = Roboto_Flex({ 
  subsets: ['latin'],
  variable: '--font-roboto-flex', // Definir una variable CSS para la fuente
});

export const metadata: Metadata = {
  title: 'Kodevo - Portafolio de Desarrollador',
  description: 'Un portafolio de desarrollador minimalista y moderno.',
  icons: {
    icon: '/favicon.ico', // Añadido para el favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* 
        Aplicar la clase de variable CSS de Roboto_Flex al body.
        La utilidad 'font-sans' de Tailwind usará esta variable.
      */}
      <body className={`${roboto_flex.variable} font-sans antialiased`}>
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
