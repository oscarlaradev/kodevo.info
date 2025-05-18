
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3, AlertTriangle, Loader2, LineChartIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { getPageViewReport, type GaDataPoint, type GaReportOutput } from "@/services/googleAnalyticsService";
import { useToast } from "@/hooks/use-toast";

// Initial empty data or example data
const initialChartData: GaDataPoint[] = [
  // { date: "2024-07-01", pageViews: 0 },
];

const chartConfig = {
  pageViews: {
    label: "Page Views",
    color: "hsl(var(--primary))",
    icon: LineChartIcon,
  },
  // You can add other metrics here if your API call fetches them
  // uniqueVisitors: {
  //   label: "Unique Visitors",
  //   color: "hsl(var(--secondary))",
  // },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [analyticsReport, setAnalyticsReport] = useState<GaReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        const report = await getPageViewReport();
        setAnalyticsReport(report);
        if (report.error) {
          toast({
            title: "Error al Cargar Analíticas",
            description: report.error,
            variant: "destructive",
          });
        } else if (report.data.length === 0) {
           toast({
            title: "Analíticas Cargadas",
            description: "No se encontraron datos de vistas de página para el período seleccionado.",
            variant: "default",
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido al cargar las analíticas.";
        toast({
          title: "Error Crítico al Cargar Analíticas",
          description: errorMessage,
          variant: "destructive",
        });
        setAnalyticsReport({ data: [], startDate: '', endDate: '', error: errorMessage});
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, [toast]);

  const chartDataToDisplay = analyticsReport?.data && analyticsReport.data.length > 0 
    ? analyticsReport.data 
    : initialChartData;
  
  const dateRangeText = analyticsReport?.startDate && analyticsReport?.endDate
    ? `Datos del ${new Date(analyticsReport.startDate + 'T00:00:00').toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})} al ${new Date(analyticsReport.endDate + 'T00:00:00').toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}`
    : "Cargando rango de fechas...";


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
            <LineChartIcon className="mr-2 h-6 w-6 text-primary" />
            Vistas de Página (Últimos 7 días)
          </CardTitle>
          <CardDescription>
            {isLoading ? "Cargando datos de Google Analytics..." : dateRangeText}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Cargando datos del gráfico...</p>
            </div>
          ) : analyticsReport?.error ? (
             <div className="flex flex-col items-center justify-center min-h-[300px] text-destructive bg-destructive/10 p-4 rounded-md">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p className="font-semibold mb-1">No se pudieron cargar los datos de Google Analytics.</p>
                <p className="text-sm text-center max-w-md">{analyticsReport.error}</p>
                <p className="text-xs mt-3 text-center max-w-md">Asegúrate de que las variables de entorno (GA4_PROPERTY_ID, GOOGLE_SERVICE_ACCOUNT_KEY_JSON) estén bien configuradas y que la cuenta de servicio tenga permisos en GA4.</p>
            </div>
          ) : chartDataToDisplay.length === 0 && !analyticsReport?.error ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                 <LineChartIcon className="h-12 w-12 mb-4" />
                 <p className="font-semibold">No hay datos de vistas de página para mostrar.</p>
                 <p className="text-sm">Intenta de nuevo más tarde o verifica tu configuración de Google Analytics.</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartDataToDisplay} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
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
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line dataKey="pageViews" type="monotone" stroke="var(--color-pageViews)" strokeWidth={2} dot={{r: 4, fill: "var(--color-pageViews)", stroke: "hsl(var(--background))"}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
