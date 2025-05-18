
"use client";

import Link from 'next/link';
import { Menu, X, Heart } from 'lucide-react'; // Added Heart for Favorites
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/projects' },
  { label: 'Favoritos', href: '/favorites', icon: Heart }, // Added Favorites
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-background/80 shadow-lg backdrop-blur-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            Kodevo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Button key={item.label} variant="ghost" asChild className="text-foreground hover:text-primary hover:bg-primary/10 rounded-md px-3 py-2 transition-colors">
                <Link href={item.href}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
              <SheetContent side="right" className="w-[280px] bg-background p-6 shadow-xl rounded-l-xl">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                      Kodevo
                    </Link>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" aria-label="Cerrar menú">
                         <X className="h-6 w-6 text-primary" />
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                       <SheetClose key={item.label} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 rounded-md text-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon && <item.icon className="mr-3 h-5 w-5" />}
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
