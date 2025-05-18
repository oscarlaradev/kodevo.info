
// src/app/admin/seo/page.tsx
"use client";

import Link from 'next/link';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, FileText, Lightbulb, Settings2, BarChart3, Loader2, AlertTriangle, Wand2, Smartphone, Monitor, ShieldCheck, ExternalLink } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { generateSeoContentIdeas, type SeoContentIdeasInput } from '@/ai/flows/generate-seo-ideas-flow';
import { generateMetaTags, type MetaTagsInput } from '@/ai/flows/generate-meta-tags-flow';
import { generateRelatedKeywords, type RelatedKeywordsInput } from '@/ai/flows/generate-related-keywords-flow';
import { analyzePageSpeed, type PageSpeedInputClient, type PageSpeedOutput } from '@/services/pageSpeedService';
import { getMozUrlMetrics, type MozUrlMetricsInput, type MozUrlMetricsOutput } from '@/services/mozService'; // Import Moz service
import { useToast } from '@/hooks/use-toast';

export default function SeoToolsPage() {
  const { toast } = useToast();

  // State for Content Idea Generator
  const [ideaTopic, setIdeaTopic] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [ideasError, setIdeasError] = useState<string | null>(null);

  // State for Meta Tag Generator
  const [metaTagTopic, setMetaTagTopic] = useState('');
  const [generatedMetaTitle, setGeneratedMetaTitle] = useState('');
  const [generatedMetaDescription, setGeneratedMetaDescription] = useState('');
  const [isGeneratingMetaTags, setIsGeneratingMetaTags] = useState(false);
  const [metaTagsError, setMetaTagsError] = useState<string | null>(null);

  // State for Keyword Research
  const [mainKeyword, setMainKeyword] = useState('');
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [keywordsError, setKeywordsError] = useState<string | null>(null);

  // State for PageSpeed Insights
  const [pageSpeedUrl, setPageSpeedUrl] = useState('');
  const [pageSpeedStrategy, setPageSpeedStrategy] = useState<'desktop' | 'mobile'>('desktop');
  const [pageSpeedResults, setPageSpeedResults] = useState<PageSpeedOutput | null>(null);
  const [isAnalyzingPageSpeed, setIsAnalyzingPageSpeed] = useState(false);
  const [pageSpeedError, setPageSpeedError] = useState<string | null>(null);

  // State for Moz URL Metrics
  const [mozUrl, setMozUrl] = useState('');
  const [mozResults, setMozResults] = useState<MozUrlMetricsOutput | null>(null);
  const [isFetchingMozMetrics, setIsFetchingMozMetrics] = useState(false);
  const [mozError, setMozError] = useState<string | null>(null);


  const handleGenerateIdeas = async () => {
    if (!ideaTopic.trim()) {
      setIdeasError("Por favor, introduce un tema para generar ideas.");
      return;
    }
    setIsGeneratingIdeas(true);
    setGeneratedIdeas([]);
    setIdeasError(null);
    try {
      const input: SeoContentIdeasInput = { topic: ideaTopic };
      const result = await generateSeoContentIdeas(input);
      if (result && result.ideas) {
        setGeneratedIdeas(result.ideas);
        toast({
          title: "Ideas de Contenido Generadas",
          description: "Se han generado nuevas ideas de contenido con IA.",
        });
      } else {
        throw new Error("La respuesta del generador de ideas no fue válida.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error generating SEO ideas:", errorMessage);
      setIdeasError(`Error: ${errorMessage}`);
      toast({
        title: "Error al Generar Ideas",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGenerateMetaTags = async () => {
    if (!metaTagTopic.trim()) {
      setMetaTagsError("Por favor, introduce un tema o contenido base.");
      return;
    }
    setIsGeneratingMetaTags(true);
    setGeneratedMetaTitle('');
    setGeneratedMetaDescription('');
    setMetaTagsError(null);
    try {
      const input: MetaTagsInput = { topicOrContent: metaTagTopic };
      const result = await generateMetaTags(input);
      if (result && result.title && result.description) {
        setGeneratedMetaTitle(result.title);
        setGeneratedMetaDescription(result.description);
        toast({
          title: "Meta Tags Generados",
          description: "Se han generado un meta título y descripción con IA.",
        });
      } else {
        throw new Error("La respuesta del generador de meta tags no fue válida.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error generating meta tags:", errorMessage);
      setMetaTagsError(`Error: ${errorMessage}`);
      toast({
        title: "Error al Generar Meta Tags",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMetaTags(false);
    }
  };

  const handleGenerateRelatedKeywords = async () => {
    if (!mainKeyword.trim()) {
      setKeywordsError("Por favor, introduce una palabra clave principal.");
      return;
    }
    setIsGeneratingKeywords(true);
    setRelatedKeywords([]);
    setKeywordsError(null);
    try {
      const input: RelatedKeywordsInput = { topic: mainKeyword };
      const result = await generateRelatedKeywords(input);
      if (result && result.keywords) {
        setRelatedKeywords(result.keywords);
        toast({
          title: "Palabras Clave Relacionadas Generadas",
          description: "Se han generado nuevas palabras clave con IA.",
        });
      } else {
        throw new Error("La respuesta del generador de palabras clave no fue válida.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error generating related keywords:", errorMessage);
      setKeywordsError(`Error: ${errorMessage}`);
      toast({
        title: "Error al Generar Palabras Clave",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeywords(false);
    }
  };

  const handleAnalyzePageSpeed = async () => {
    if (!pageSpeedUrl.trim()) {
      setPageSpeedError("Por favor, introduce una URL para analizar.");
      return;
    }
    setIsAnalyzingPageSpeed(true);
    setPageSpeedResults(null);
    setPageSpeedError(null);
    try {
      const input: PageSpeedInputClient = { url: pageSpeedUrl, strategy: pageSpeedStrategy };
      const result = await analyzePageSpeed(input);
      setPageSpeedResults(result);
      toast({
        title: "Análisis de PageSpeed Completado",
        description: `Resultados para ${result.strategy} de ${result.requestedUrl || pageSpeedUrl}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error analyzing PageSpeed:", errorMessage);
      setPageSpeedError(`Error: ${errorMessage}`);
      toast({
        title: "Error en Análisis de PageSpeed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingPageSpeed(false);
    }
  };

  const handleFetchMozMetrics = async () => {
    if (!mozUrl.trim()) {
      setMozError("Por favor, introduce una URL para analizar.");
      return;
    }
    setIsFetchingMozMetrics(true);
    setMozResults(null);
    setMozError(null);
    try {
      const input: MozUrlMetricsInput = { url: mozUrl };
      const result = await getMozUrlMetrics(input);
      setMozResults(result);
      toast({
        title: "Métricas de Moz Obtenidas",
        description: `DA/PA para ${result.url}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error fetching Moz metrics:", errorMessage);
      setMozError(`Error: ${errorMessage}`);
      toast({
        title: "Error al Obtener Métricas de Moz",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFetchingMozMetrics(false);
    }
  };

  const getScoreColor = (score: number, higherIsBetter = true): string => {
    if (higherIsBetter) {
        if (score >= 70) return 'bg-green-500 text-white';
        if (score >= 40) return 'bg-yellow-500 text-black';
        return 'bg-red-500 text-white';
    } else { // Lower is better (e.g. CLS)
        if (score <= 0.1) return 'bg-green-500 text-white';
        if (score <= 0.25) return 'bg-yellow-500 text-black';
        return 'bg-red-500 text-white';
    }
  };

  const getPageSpeedScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 50) return 'bg-yellow-500 text-black';
    return 'bg-red-500 text-white';
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <AdminPageHeader title="Herramientas SEO Avanzadas" description="Potencia el posicionamiento de tu portafolio en buscadores.">
        <Button asChild variant="outline">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
            </Link>
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tool 1: Keyword Research (AI) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Investigación de Palabras Clave (IA)</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Descubre palabras clave relacionadas y variaciones con IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="main-keyword-input">Palabra Clave Principal</Label>
              <Input 
                id="main-keyword-input" 
                placeholder="Ej: desarrollo web, diseño UI/UX" 
                value={mainKeyword}
                onChange={(e) => setMainKeyword(e.target.value)}
                disabled={isGeneratingKeywords}
              />
            </div>
            <Button 
              className="mt-4 w-full" 
              onClick={handleGenerateRelatedKeywords}
              disabled={isGeneratingKeywords}
            >
              {isGeneratingKeywords ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGeneratingKeywords ? 'Buscando...' : 'Obtener Palabras Clave'}
            </Button>
             {keywordsError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {keywordsError}
              </div>
            )}
            {relatedKeywords.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-foreground">Palabras Clave Relacionadas:</h4>
                <ScrollArea className="h-40">
                  <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {relatedKeywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tool 2: On-Page SEO Analyzer (PageSpeed) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Análisis On-Page (PageSpeed)</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Evalúa la velocidad y el rendimiento de una página con Google PageSpeed Insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="pagespeed-url-input">URL de la Página a Analizar</Label>
                <Input 
                  id="pagespeed-url-input" 
                  placeholder="Ej: https://tu-sitio.com/pagina" 
                  value={pageSpeedUrl}
                  onChange={(e) => setPageSpeedUrl(e.target.value)}
                  disabled={isAnalyzingPageSpeed}
                />
              </div>
              <div>
                <Label htmlFor="pagespeed-strategy">Estrategia</Label>
                <Select
                  value={pageSpeedStrategy}
                  onValueChange={(value: 'desktop' | 'mobile') => setPageSpeedStrategy(value)}
                  disabled={isAnalyzingPageSpeed}
                >
                  <SelectTrigger id="pagespeed-strategy">
                    <SelectValue placeholder="Selecciona estrategia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop"><Monitor className="mr-2 h-4 w-4 inline-block" /> Escritorio</SelectItem>
                    <SelectItem value="mobile"><Smartphone className="mr-2 h-4 w-4 inline-block" /> Móvil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              className="mt-4 w-full" 
              onClick={handleAnalyzePageSpeed}
              disabled={isAnalyzingPageSpeed || !pageSpeedUrl.trim()}
            >
              {isAnalyzingPageSpeed ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isAnalyzingPageSpeed ? 'Analizando...' : 'Analizar Velocidad'}
            </Button>
            {pageSpeedError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {pageSpeedError}
              </div>
            )}
          </CardContent>
          {pageSpeedResults && (
            <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
              <h4 className="font-semibold text-foreground">Resultados ({pageSpeedResults.strategy}):</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full">
                <div className="font-medium">Puntuación Rendimiento:</div>
                <div className={`font-bold px-2 py-0.5 rounded text-center text-xs ${getPageSpeedScoreColor(pageSpeedResults.performanceScore)}`}>
                    {pageSpeedResults.performanceScore} / 100
                </div>
                
                <div className="text-muted-foreground">First Contentful Paint:</div>
                <div>{pageSpeedResults.firstContentfulPaint}</div>
                
                <div className="text-muted-foreground">Largest Contentful Paint:</div>
                <div>{pageSpeedResults.largestContentfulPaint}</div>

                <div className="text-muted-foreground">Cumulative Layout Shift:</div>
                <div>{pageSpeedResults.cumulativeLayoutShift}</div>

                <div className="text-muted-foreground">Speed Index:</div>
                <div>{pageSpeedResults.speedIndex}</div>
                
                <div className="text-muted-foreground">Time to Interactive:</div>
                <div>{pageSpeedResults.timeToInteractive}</div>
              </div>
               <p className="text-xs text-muted-foreground mt-2">URL Analizada: <a href={pageSpeedResults.finalUrl || pageSpeedUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{pageSpeedResults.finalUrl || pageSpeedUrl}</a></p>
            </CardFooter>
          )}
        </Card>

        {/* Tool 3: Meta Tag Generator (AI) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Settings2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Generador de Meta Tags (IA)</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Crea meta tags optimizados para tus páginas o temas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="meta-topic-input">Tema o Contenido Base</Label>
                <Textarea 
                  id="meta-topic-input" 
                  placeholder="Describe brevemente tu página o el tema principal..." 
                  className="h-24"
                  value={metaTagTopic}
                  onChange={(e) => setMetaTagTopic(e.target.value)}
                  disabled={isGeneratingMetaTags}
                />
              </div>
              <Button 
                className="mt-3 w-full" 
                onClick={handleGenerateMetaTags}
                disabled={isGeneratingMetaTags}
              >
                {isGeneratingMetaTags ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isGeneratingMetaTags ? 'Generando...' : 'Generar Meta Tags'}
              </Button>

              {metaTagsError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {metaTagsError}
              </div>
              )}

              {generatedMetaTitle && (
                <div className="mt-4 space-y-1 pt-2 border-t">
                  <Label htmlFor="generated-meta-title" className="font-semibold text-foreground">Meta Title Generado:</Label>
                  <Input id="generated-meta-title" value={generatedMetaTitle} readOnly className="bg-muted/50" />
                </div>
              )}
              {generatedMetaDescription && (
                <div className="mt-2 space-y-1">
                  <Label htmlFor="generated-meta-description" className="font-semibold text-foreground">Meta Description Generada:</Label>
                  <Textarea id="generated-meta-description" value={generatedMetaDescription} readOnly className="h-20 bg-muted/50" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Tool 4: Content Idea Generator (AI) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Generador de Ideas (IA)</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Obtén ideas de contenido o descripciones de proyectos con IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="topic-input-ai">Tema Principal / Proyecto</Label>
              <Input 
                id="topic-input-ai" 
                placeholder="Ej: Nuevas tendencias en React" 
                value={ideaTopic}
                onChange={(e) => setIdeaTopic(e.target.value)}
                disabled={isGeneratingIdeas}
              />
            </div>
            <Button 
              className="mt-4 w-full" 
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
            >
              {isGeneratingIdeas ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGeneratingIdeas ? 'Generando...' : 'Generar Ideas'}
            </Button>
            {ideasError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {ideasError}
              </div>
            )}
            {generatedIdeas.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-foreground">Ideas Generadas:</h4>
                <ScrollArea className="h-40">
                  <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {generatedIdeas.map((idea, index) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tool 5: Moz URL Metrics */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Métricas de URL Moz (DA/PA)</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Consulta la Autoridad de Dominio (DA), Autoridad de Página (PA) y dominios raíz enlazantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="moz-url-input">URL a Analizar</Label>
              <Input 
                id="moz-url-input" 
                placeholder="Ej: https://tu-sitio.com/pagina" 
                value={mozUrl}
                onChange={(e) => setMozUrl(e.target.value)}
                disabled={isFetchingMozMetrics}
              />
            </div>
            <Button 
              className="mt-4 w-full" 
              onClick={handleFetchMozMetrics}
              disabled={isFetchingMozMetrics || !mozUrl.trim()}
            >
              {isFetchingMozMetrics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isFetchingMozMetrics ? 'Obteniendo...' : 'Obtener Métricas de Moz'}
            </Button>
            {mozError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {mozError}
              </div>
            )}
          </CardContent>
          {mozResults && (
            <CardFooter className="flex-col items-start gap-2 pt-4 border-t">
              <h4 className="font-semibold text-foreground">Resultados para: <a href={mozResults.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{mozResults.url}</a></h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full">
                <div className="font-medium">Autoridad de Dominio:</div>
                <div className={`font-bold px-2 py-0.5 rounded text-center text-xs ${getScoreColor(mozResults.domainAuthority || 0)}`}>
                  {mozResults.domainAuthority !== undefined ? mozResults.domainAuthority.toFixed(2) : 'N/A'}
                </div>
                
                <div className="font-medium">Autoridad de Página:</div>
                 <div className={`font-bold px-2 py-0.5 rounded text-center text-xs ${getScoreColor(mozResults.pageAuthority || 0)}`}>
                  {mozResults.pageAuthority !== undefined ? mozResults.pageAuthority.toFixed(2) : 'N/A'}
                </div>

                <div className="font-medium">Dominios Raíz Enlazantes:</div>
                <div>{mozResults.linkingRootDomains !== undefined ? mozResults.linkingRootDomains.toLocaleString() : 'N/A'}</div>
              </div>
               <p className="text-xs text-muted-foreground mt-2">
                Métricas proporcionadas por <a href="https://moz.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Moz API</a>.
               </p>
            </CardFooter>
          )}
        </Card>

        {/* Tool 6: Internal Link Analyzer (Placeholder) */}
        <Card className="shadow-lg rounded-lg opacity-70 bg-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-7 w-7 text-primary/70" /> {/* Using BarChart3 for consistency with other analytic-like tools */}
                <CardTitle className="text-lg font-semibold">Análisis de Enlaces Internos</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Analiza la estructura de enlaces internos de tu sitio. (Próximamente)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Esta herramienta (próximamente) te ayudará a entender cómo fluye el "link equity" a través de tu sitio.
            </p>
             <Button className="mt-4 w-full" disabled>Iniciar Análisis de Enlaces</Button>
          </CardContent>
        </Card>

      </div>

      <Separator className="my-8" />

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Conceptos Clave de SEO para Portafolios</CardTitle>
          <CardDescription>Consejos esenciales para mejorar la visibilidad de tu trabajo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base font-medium hover:no-underline">Títulos y Descripciones Únicos</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Cada proyecto y página debe tener un título (<code className="font-mono text-xs bg-muted p-1 rounded">&lt;title&gt;</code>) y una meta descripción únicos.
                Los títulos deben ser concisos (idealmente menos de 60 caracteres), y las descripciones atractivas (idealmente menos de 160 caracteres).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base font-medium hover:no-underline">URLs Amigables (Semánticas)</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Usa URLs cortas y descriptivas que incluyan palabras clave relevantes. Por ejemplo: <code className="font-mono text-xs bg-muted p-1 rounded">/projects/nombre-proyecto-seo</code>.
                Next.js facilita esto con su sistema de enrutamiento basado en archivos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base font-medium hover:no-underline">Optimización de Imágenes</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Comprime las imágenes para reducir su tamaño de archivo sin perder demasiada calidad. Utiliza el componente <code className="font-mono text-xs bg-muted p-1 rounded">next/image</code> para una optimización automática.
                Añade texto <code className="font-mono text-xs bg-muted p-1 rounded">alt</code> descriptivo a todas las imágenes, incluyendo palabras clave cuando sea natural.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger className="text-base font-medium hover:no-underline">Contenido de Calidad y Estructura</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Describe tus proyectos en detalle, destacando los problemas que resolviste y las tecnologías utilizadas. Usa encabezados (H1, H2, H3) para estructurar el contenido de forma lógica.
                Incorpora palabras clave relevantes de forma natural a lo largo de tu contenido.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-base font-medium hover:no-underline">Enlaces Internos y Externos</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Enlaza a otras páginas relevantes dentro de tu propio sitio (enlaces internos) para ayudar a los motores de búsqueda a descubrir tu contenido y distribuir la autoridad de la página.
                Obtener enlaces de calidad desde otros sitios web (backlinks) es un factor importante para el SEO, aunque más difícil de controlar directamente.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger className="text-base font-medium hover:no-underline">Velocidad de Carga y Experiencia Móvil</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Asegúrate de que tu sitio cargue rápidamente y sea completamente funcional en dispositivos móviles. Google prioriza los sitios que ofrecen una buena experiencia de usuario.
                Utiliza herramientas como Google PageSpeed Insights para identificar áreas de mejora.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
