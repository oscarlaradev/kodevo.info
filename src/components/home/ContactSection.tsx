
"use client";

import { bioData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Send, Instagram } from 'lucide-react'; // Added Send and Instagram icons

const platformIcons: { [key: string]: React.ElementType } = {
  Email: Mail,
  GitHub: Github,
  Instagram: Instagram, // Added Instagram
};

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-2xl mx-auto shadow-xl animate-fade-in-up rounded-xl overflow-hidden">
          <CardHeader className="bg-secondary/30 p-6">
            <div className="flex items-center space-x-3">
              <Send className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-semibold text-primary">Ponte en Contacto</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <p className="text-lg text-center text-foreground/90 mb-8">
              Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tus visiones.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {bioData.contact.map((item) => {
                const Icon = platformIcons[item.platform] || Mail; // Default to Mail if no specific icon
                return (
                  <Button
                    key={item.platform}
                    variant="outline"
                    size="lg"
                    asChild
                    className="rounded-full shadow-md hover:shadow-lg hover:bg-accent hover:text-accent-foreground transform transition-all hover:scale-105"
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Icon className="mr-2 h-5 w-5" />
                      {item.platform === "Email" ? "Correo" : item.platform}
                    </a>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
