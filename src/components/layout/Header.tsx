
"use client";

import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose, SheetTrigger } from '@/components/ui/sheet'; // Added SheetTrigger
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Favoritos', href: '/favorites', icon: Heart },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out rounded-xl', // Márgenes para efecto flotante y bordes redondeados
        isScrolled 
          ? 'bg-background/90 shadow-xl backdrop-blur-lg' // Más pronunciado al hacer scroll
          : 'bg-background/80 shadow-lg backdrop-blur-md' // Fondo y sombra base para efecto flotante
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Kodevo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Button 
                key={item.label} 
                variant="ghost" 
                asChild 
                className="group text-muted-foreground hover:text-primary transition-colors duration-200 rounded-md px-3 py-2"
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />}
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background p-0 shadow-xl rounded-l-xl flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Kodevo
                    </Link>
                  </div>
                  <SheetTitle className="sr-only">Menú de Navegación Principal</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col h-full p-6 pt-4">
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                       <SheetClose key={item.label} asChild>
                        <Link
                          href={item.href}
                          className="group flex items-center px-4 py-3 rounded-md text-lg text-foreground hover:bg-muted hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon && <item.icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />}
                          {item.label}
                        </Link>
                       </SheetClose>
                    ))}
                  </nav>
                  <div className="mt-auto pt-6 border-t border-border">
                    <p className="text-center text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} Kodevo
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
