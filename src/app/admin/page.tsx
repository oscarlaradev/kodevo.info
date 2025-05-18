
"use client"; // This page now uses client-side charting

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Briefcase, TrendingUp, SearchCheck } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function AdminDashboardPage() {
  const features = [
    {
      title: "Gestionar Proyectos",
      description: "Añade, edita y elimina proyectos de tu portafolio.",
      href: "/admin/projects",
      icon: Briefcase,
      cta: "Ir a Proyectos"
    },
    {
      title: "Analíticas Detalladas",
      description: "Visualiza estadísticas de visitas y rendimiento.",
      href: "/admin/analytics", 
      icon: TrendingUp, 
      cta: "Ver Analíticas",
    },
    {
      title: "Herramientas SEO",
      description: "Optimiza el SEO de tu portafolio.",
      href: "/admin/seo",
      icon: SearchCheck, 
      cta: "Optimizar SEO",
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Panel de Administración" description="Bienvenido al panel de control de Kodevo." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow rounded-lg flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-sm h-12">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Content can be added here if needed */}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full mt-auto">
                <Link href={feature.href}>{feature.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
