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
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { BarChart3, AlertTriangle, Loader2, LineChartIcon, Users, Eye, Link2, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getAnalyticsReport, type GaReportOutput } from "@/services/googleAnalyticsService";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const chartConfig = {
  pageViews: {
    label: "Vistas",
    color: "hsl(var(--primary))",
    icon: Eye,
  },
  activeUsers: {
    label: "Usuarios",
    color: "hsl(var(--accent))",
    icon: Users,
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [report, setReport] = useState<GaReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedReport = await getAnalyticsReport();
      setReport(fetchedReport);
      if (fetchedReport.error && fetchedReport.error !== "No se encontraron datos para el período seleccionado.") {
        toast({
          title: "Error al Cargar Analíticas",
          description: fetchedReport.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido al cargar las analíticas.";
      toast({
        title: "Error Crítico al Cargar Analíticas",
        description: errorMessage,
        variant: "destructive",
      });
      setReport(prev => {
        const base = {
            data: [],
            totals: { pageViews: 0, activeUsers: 0, sessions: 0},
            topPages: [],
            topSources: [],
            startDate: '',
            endDate: ''
        };
        if (prev) {
          return {...prev, ...base, error: errorMessage};
        }
        return {...base, error: errorMessage};
      });
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, [toast]);
  
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);
  
  const dateRangeText = report?.startDate && report?.endDate
    ? `Datos del ${new Date(report.startDate + 'T00:00:00').toLocaleDateString('es-ES', {day: 'numeric', month: 'long'})} al ${new Date(report.endDate + 'T00:00:00').toLocaleDateString('es-ES', {day: 'numeric', month: 'long', year: 'numeric'})}`
    : "Cargando rango de fechas...";
    
  const lastUpdatedText = lastUpdated 
    ? `Última actualización: ${lastUpdated.toLocaleTimeString('es-ES')}` 
    : 'Actualizando...';

  const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );

  const DiagnosticInfo = () => (
    <Card className="mt-6 bg-blue-50 border border-blue-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Info className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">Información de Diagnóstico</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-blue-700 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">ID de Propiedad GA4 utilizada:</span>{' '}
          <Badge variant="outline" className="text-blue-800 border-blue-300">{report?.propertyId || 'No disponible'}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Email de Cuenta de Servicio:</span>{' '}
          <Badge variant="outline" className="text-blue-800 border-blue-300">{report?.clientEmail || 'No disponible'}</Badge>
        </div>
        <p className="pt-2 text-xs text-blue-600">
           Verifica que estos datos coincidan con tu configuración en Google Analytics y en el archivo `.env.local`.
        </p>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isLoading && !report) { // Show initial loader only on first load
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Cargando datos de Google Analytics...</p>
        </div>
      );
    }
    
    if (report?.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4 rounded-md bg-muted/50">
            {report.error === "No se encontraron datos para el período seleccionado." ? (
                <>
                    <LineChartIcon className="h-12 w-12 mb-4 text-muted-foreground" />
                    <p className="font-semibold text-xl text-foreground">Aún no hay datos para mostrar</p>
                    <p className="text-muted-foreground mt-2 max-w-md">La conexión con Google Analytics funciona, pero no se han registrado visitas en los últimos 7 días. ¡Visita tu sitio para empezar a generar datos!</p>
                </>
            ) : (
                <>
                    <AlertTriangle className="h-12 w-12 mb-4 text-destructive" />
                    <p className="font-semibold text-xl text-destructive">No se pudieron cargar los datos</p>
                    <p className="text-muted-foreground mt-2 max-w-md">{report.error}</p>
                </>
            )}
            <DiagnosticInfo />
        </div>
      );
    }

    if (!report || report.data.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4 rounded-md bg-muted/50">
             <LineChartIcon className="h-12 w-12 mb-4 text-muted-foreground" />
             <p className="font-semibold text-xl text-foreground">Aún no hay datos para mostrar</p>
             <p className="text-muted-foreground mt-2 max-w-md">La conexión con Google Analytics funciona, pero no se han registrado visitas en los últimos 7 días. ¡Visita tu sitio para empezar a generar datos!</p>
             <DiagnosticInfo />
        </div>
      );
    }

    return (
        <>
            <Card className="mb-8 shadow-lg rounded-lg">
                <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                    <LineChartIcon className="mr-2 h-6 w-6 text-primary" />
                    Tendencia de Vistas
                </CardTitle>
                <CardDescription>
                    {dateRangeText}
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-video">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={report.data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-pageViews)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-pageViews)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
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
                            <Area dataKey="pageViews" type="monotone" stroke="var(--color-pageViews)" fill="url(#colorPageViews)" strokeWidth={2} dot={{r: 4, fill: "var(--color-pageViews)", stroke: "hsl(var(--background))"}} activeDot={{r: 6}} />
                        </AreaChart>
                    </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Páginas más Vistas</CardTitle>
                        <CardDescription>Las 10 páginas con más vistas en el período.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Página</TableHead>
                                    <TableHead className="text-right">Vistas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.topPages.length > 0 ? report.topPages.map(page => (
                                    <TableRow key={page.path}>
                                        <TableCell className="font-medium truncate max-w-[200px]"><a href={page.path} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary">{page.path}</a></TableCell>
                                        <TableCell className="text-right">{page.pageViews.toLocaleString()}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground py-4">No hay datos de páginas.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Fuentes de Tráfico</CardTitle>
                        <CardDescription>Las 10 fuentes que generaron más sesiones.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fuente</TableHead>
                                    <TableHead className="text-right">Sesiones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {report.topSources.length > 0 ? report.topSources.map(source => (
                                    <TableRow key={source.source}>
                                        <TableCell className="font-medium capitalize">{source.source.replace(/_/g, ' ')}</TableCell>
                                        <TableCell className="text-right">{source.sessions.toLocaleString()}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground py-4">No hay datos de fuentes.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Panel de Analíticas" description={isLoading ? 'Actualizando...' : lastUpdatedText}>
        <div className="flex items-center gap-2">
            <Button onClick={fetchAnalytics} variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Actualizar
            </Button>
            <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Link>
            </Button>
        </div>
      </AdminPageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard title="Vistas de Página" value={report?.totals.pageViews ?? 0} icon={Eye} />
        <StatCard title="Usuarios Únicos" value={report?.totals.activeUsers ?? 0} icon={Users} />
        <StatCard title="Sesiones Totales" value={report?.totals.sessions ?? 0} icon={Link2} />
      </div>

      {renderContent()}

    </div>
  );
}

    