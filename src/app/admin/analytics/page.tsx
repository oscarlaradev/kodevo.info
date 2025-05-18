
// src/app/admin/analytics/page.tsx
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { BarChart3, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Analíticas Detalladas" description="Visualiza el rendimiento y las estadísticas de tu portafolio.">
        <Button asChild variant="outline">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
            </Link>
        </Button>
      </AdminPageHeader>

      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Estadísticas de Visitas (Ejemplo)
          </CardTitle>
          <CardDescription>Muestra de datos de visitas de la última semana. Actualmente usando datos de ejemplo.</CardDescription>
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

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-primary" />
                Nota sobre Datos Reales
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Actualmente, este gráfico utiliza datos de ejemplo. Conectar esto a datos reales de Firebase Analytics (u otra fuente)
                requiere pasos adicionales:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2 pl-4">
                <li>Configurar Firebase Analytics en tu aplicación Next.js si aún no lo has hecho.</li>
                <li>Firebase Analytics exporta sus datos a BigQuery. Se necesitaría una API (posiblemente una Cloud Function) para consultar estos datos desde BigQuery.</li>
                <li>Alternativamente, para métricas personalizadas (como vistas de proyectos específicos), podríamos implementar un sistema de conteo directamente en Firestore.</li>
            </ul>
            <p className="text-muted-foreground mt-3">
                Discutiremos la mejor aproximación para tus necesidades específicas en un siguiente paso.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
