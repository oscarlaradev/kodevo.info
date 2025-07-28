
"use client";

import { bioData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl animate-fade-in-up rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/30 p-6">
            <div className="flex items-center space-x-3">
              <UserCircle className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-semibold text-primary">Sobre Mí</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-line">
              {bioData.about}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
