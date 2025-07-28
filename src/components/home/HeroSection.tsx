
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { bioData } from '@/lib/data';
import Link from 'next/link';
import { ArrowRight, Briefcase, Download } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Image
              src={bioData.profilePictureUrl}
              alt={bioData.name}
              width={160}
              height={160}
              className="rounded-full mx-auto shadow-xl border-4 border-primary/50 object-cover"
              data-ai-hint="programmer portrait"
              priority
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Hola, soy <span className="text-primary">{bioData.name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {bioData.title}
          </p>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            {bioData.tagline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <Button size="lg" asChild className="rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
              <Link href="/projects">
                <Briefcase className="mr-2 h-5 w-5" /> Ver Mi Trabajo
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full shadow-md hover:shadow-lg transform transition-all hover:scale-105">
              <a href="/OscarLara.pdf" download="OscarLara.pdf">
                <Download className="mr-2 h-5 w-5" /> Descargar CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
