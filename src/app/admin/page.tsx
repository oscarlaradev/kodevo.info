
"use client"; // This page now uses client-side charting

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, BarChart3, Wrench, Briefcase, TrendingUp, SearchCheck } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { date: "2024-07-01", pageViews: 230, uniqueVisitors: 120 },
  { date: "2024-07-02", pageViews: 280, uniqueVisitors: 150 },
  { date: "2024-07-03", pageViews: 310, uniqueVisitors: 165 },
  { date: "2024-07-04", pageViews: 200, uniqueVisitors: 90 },
  { date: "2024-07-05", pageViews: 350, uniqueVisitors: 180 },
  { date: "2024-07-06", pageViews: 400, uniqueVisitors: 210 },
  { date: "2024-07-07", pageViews: 380, uniqueVisitors: 200 },
];

const chartConfig = {
  pageViews: {
    label: "Page Views",
    color: "hsl(var(--primary))",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

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
      href: "/admin/analytics", // Placeholder for future dedicated page
      icon: TrendingUp, // Changed icon
      cta: "Ver Analíticas",
      // disabled: true, // Re-enable when page is built
    },
    {
      title: "Herramientas SEO",
      description: "Optimiza el SEO de tu portafolio.",
      href: "/admin/seo", // Placeholder for future dedicated page
      icon: SearchCheck, // Changed icon
      cta: "Optimizar SEO",
      // disabled: true, // Re-enable when page is built
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Panel de Administración" description="Bienvenido al panel de control de CodeCanvas." />
      
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
              <Button asChild className="w-full mt-auto" disabled={feature.href === "/admin/analytics" || feature.href === "/admin/seo"}>
                {/* Temporarily disabling buttons for pages not yet created */}
                <Link href={feature.href}>{feature.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Vista Rápida de Analíticas (Ejemplo)
          </CardTitle>
          <CardDescription>Muestra de datos de visitas de la última semana.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="pageViews" fill="var(--color-pageViews)" radius={4} />
                {/* <Bar dataKey="uniqueVisitors" fill="var(--color-uniqueVisitors)" radius={4} /> */}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

       <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Wrench className="mr-2 h-6 w-6 text-primary" />
            Herramientas SEO (Próximamente)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta sección contendrá herramientas para ayudarte a analizar y mejorar el SEO de tu portafolio.
            Funcionalidades planeadas:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2 pl-4">
            <li>Análisis de palabras clave.</li>
            <li>Sugerencias de meta tags.</li>
            <li>Comprobación de enlaces rotos.</li>
          </ul>
        </CardContent>
      </Card>

       <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-primary" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Implementar la subida de archivos para proyectos (imágenes, zip) a Firebase Storage.</li>
            <li>Desarrollar las páginas dedicadas de Analíticas y Herramientas SEO.</li>
            <li>Añadir autenticación para proteger todo el panel de administración.</li>
            <li>Conectar el gráfico de analíticas a datos reales (ej. Firebase Analytics o similar).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
