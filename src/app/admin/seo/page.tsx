
// src/app/admin/seo/page.tsx
"use client";

import Link from 'next/link';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Search, FileText, Lightbulb, Settings2, BarChart3, Loader2, AlertTriangle, Wand2, Smartphone, Monitor, ShieldCheck, ExternalLink, KeyRound, Copy, Info } from "lucide-react";
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
import { useState, useEffect } from 'react';
import { generateSeoContentIdeas, type SeoContentIdeasInput } from '@/ai/flows/generate-seo-ideas-flow';
import { generateMetaTags, type MetaTagsInput } from '@/ai/flows/generate-meta-tags-flow';
import { generateRelatedKeywords, type RelatedKeywordsInput } from '@/ai/flows/generate-related-keywords-flow';
import { analyzePageSpeed, type PageSpeedInputClient, type PageSpeedOutput } from '@/services/pageSpeedService';
import { getMozUrlMetrics, type MozUrlMetricsInput, type MozUrlMetricsOutput } from '@/services/mozService';
import { generateRandomPassword, type PasswordGeneratorInput, type PasswordGeneratorOutput } from '@/services/randomPasswordGeneratorService';
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

  // State for Random Password Generator
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);


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
      console.error("Error al generar ideas SEO:", errorMessage);
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
      console.error("Error al generar meta tags:", errorMessage);
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
      console.error("Error al generar palabras clave relacionadas:", errorMessage);
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
      console.error("Error al analizar PageSpeed:", errorMessage);
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
      console.error("Error al obtener métricas de Moz:", errorMessage);
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

  const handleGeneratePassword = async () => {
    if (passwordLength < 8 || passwordLength > 128) {
      setPasswordError("La longitud de la contraseña debe estar entre 8 y 128.");
      return;
    }
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      setPasswordError("Debes incluir al menos un tipo de caracter.");
      return;
    }

    setIsGeneratingPassword(true);
    setGeneratedPassword('');
    setPasswordError(null);
    try {
      const input: PasswordGeneratorInput = {
        passwordLength,
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      };
      const result = await generateRandomPassword(input);
      setGeneratedPassword(result.randomPassword);
      toast({
        title: "Contraseña Generada",
        description: "Se ha generado una nueva contraseña aleatoria.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      console.error("Error al generar contraseña:", errorMessage);
      setPasswordError(`Error: ${errorMessage}`);
      toast({
        title: "Error al Generar Contraseña",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPassword(false);
    }
  };

  const handleCopyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
        .then(() => {
          toast({ title: "Contraseña Copiada", description: "La contraseña generada ha sido copiada al portapapeles." });
        })
        .catch(err => {
          console.error('Fallo al copiar la contraseña: ', err);
          toast({ title: "Error al Copiar", description: "No se pudo copiar la contraseña.", variant: "destructive" });
        });
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
                Volver al Panel
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
                  <Label htmlFor="generated-meta-title" className="font-semibold text-foreground">Meta Título Generado:</Label>
                  <Input id="generated-meta-title" value={generatedMetaTitle} readOnly className="bg-muted/50" />
                </div>
              )}
              {generatedMetaDescription && (
                <div className="mt-2 space-y-1">
                  <Label htmlFor="generated-meta-description" className="font-semibold text-foreground">Meta Descripción Generada:</Label>
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

        {/* Tool 6: Random Password Generator (RapidAPI) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <KeyRound className="h-7 w-7 text-primary" />
                <CardTitle className="text-lg font-semibold">Generador de Contraseñas</CardTitle>
            </div>
            <CardDescription className="text-sm min-h-[3.5rem]">Crea contraseñas seguras y aleatorias con RapidAPI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password-length">Longitud de Contraseña ({passwordLength})</Label>
                <Input 
                  id="password-length" 
                  type="number"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value, 10) || 8)}
                  min={8}
                  max={128}
                  disabled={isGeneratingPassword}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-uppercase" className="text-sm font-medium">Incluir Mayúsculas</Label>
                <Switch 
                  id="include-uppercase" 
                  checked={includeUppercase} 
                  onCheckedChange={setIncludeUppercase}
                  disabled={isGeneratingPassword}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-lowercase" className="text-sm font-medium">Incluir Minúsculas</Label>
                <Switch 
                  id="include-lowercase" 
                  checked={includeLowercase} 
                  onCheckedChange={setIncludeLowercase}
                  disabled={isGeneratingPassword}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-numbers" className="text-sm font-medium">Incluir Números</Label>
                <Switch 
                  id="include-numbers" 
                  checked={includeNumbers} 
                  onCheckedChange={setIncludeNumbers}
                  disabled={isGeneratingPassword}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="include-symbols" className="text-sm font-medium">Incluir Símbolos</Label>
                <Switch 
                  id="include-symbols" 
                  checked={includeSymbols} 
                  onCheckedChange={setIncludeSymbols}
                  disabled={isGeneratingPassword}
                />
              </div>
            </div>
            <Button 
              className="mt-6 w-full" 
              onClick={handleGeneratePassword}
              disabled={isGeneratingPassword}
            >
              {isGeneratingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGeneratingPassword ? 'Generando...' : 'Generar Contraseña'}
            </Button>
            {passwordError && (
              <div className="mt-3 text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                {passwordError}
              </div>
            )}
            {generatedPassword && (
              <div className="mt-4 space-y-2 pt-3 border-t">
                <Label className="font-semibold text-foreground">Contraseña Generada:</Label>
                <div className="flex items-center gap-2">
                  <Input value={generatedPassword} readOnly className="bg-muted/50 flex-grow" />
                  <Button variant="ghost" size="icon" onClick={handleCopyPassword} title="Copiar contraseña">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      <Separator className="my-10" />

      <Card className="shadow-xl rounded-xl">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-primary">Conceptos Clave de SEO para Portafolios</CardTitle>
          </div>
          <CardDescription className="text-base text-primary/80 mt-1">Consejos esenciales y avanzados para mejorar la visibilidad de tu trabajo en línea.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <Search className="mr-3 h-5 w-5 text-primary/80" /> Investigación de Palabras Clave Específica
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Identifica los términos que clientes potenciales o reclutadores usarían para encontrar a alguien con tus habilidades o los proyectos que has realizado.
                Piensa en:
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li>Tecnologías específicas (Ej: "desarrollador Next.js freelance", "experto en Firebase y React").</li>
                  <li>Tipos de proyectos (Ej: "desarrollo de e-commerce", "aplicaciones móviles con React Native").</li>
                  <li>Problemas que resuelves (Ej: "optimización de rendimiento web", "consultoría en arquitectura de software").</li>
                </ul>
                Usa estas palabras clave de forma natural en los títulos de tus proyectos, descripciones y en tu biografía.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <Settings2 className="mr-3 h-5 w-5 text-primary/80" /> Títulos y Descripciones Únicos y Atractivos
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Cada proyecto y página (incluyendo tu "Sobre mí" y "Contacto") debe tener un meta título (<code className="font-mono text-sm bg-muted p-1 rounded">&lt;title&gt;</code>) y una meta descripción únicos.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Meta Títulos:</strong> Concisos (50-60 caracteres), que incluyan tu palabra clave principal y transmitan el valor principal. Deben ser atractivos para el clic.</li>
                  <li><strong>Meta Descripciones:</strong> Persuasivas (150-160 caracteres), que expandan el título, incluyan palabras clave secundarias y llamen a la acción (ej. "Descubre cómo desarrollé...", "Contacta para colaborar...").</li>
                </ul>
                Evita títulos y descripciones duplicados o genéricos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                 <ExternalLink className="mr-3 h-5 w-5 text-primary/80" /> URLs Amigables y Semánticas
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Utiliza URLs cortas, descriptivas y que incluyan palabras clave relevantes. Esto ayuda tanto a los usuarios como a los motores de búsqueda a entender de qué trata la página.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li>Ejemplo para un proyecto: <code className="font-mono text-sm bg-muted p-1 rounded">/projects/nombre-del-proyecto-con-palabras-clave</code></li>
                  <li>Evita URLs con parámetros innecesarios o IDs numéricos si es posible.</li>
                </ul>
                Next.js facilita la creación de URLs semánticas con su sistema de enrutamiento basado en archivos.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <FileText className="mr-3 h-5 w-5 text-primary/80" /> Optimización de Imágenes y Multimedia
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Las imágenes son cruciales en un portafolio, pero pueden ralentizar tu sitio si no se optimizan.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Compresión:</strong> Usa herramientas para comprimir imágenes sin perder calidad visible (ej. TinyPNG, ImageOptim).</li>
                  <li><strong>Formatos Modernos:</strong> Considera formatos como WebP que ofrecen mejor compresión (el componente <code className="font-mono text-sm bg-muted p-1 rounded">next/image</code> puede ayudar con esto).</li>
                  <li><strong>Texto Alternativo (Atributo `alt`):</strong> Siempre incluye texto `alt` descriptivo para todas las imágenes. Debe describir la imagen e incluir palabras clave si es natural. Ayuda a la accesibilidad y al SEO.</li>
                  <li><strong>Dimensiones Correctas:</strong> Sirve imágenes en las dimensiones en que se mostrarán para evitar que el navegador las redimensione.</li>
                  <li><strong>Lazy Loading:</strong> Carga imágenes solo cuando están a punto de entrar en el viewport (el componente <code className="font-mono text-sm bg-muted p-1 rounded">next/image</code> lo hace por defecto).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                 <Lightbulb className="mr-3 h-5 w-5 text-primary/80" /> Contenido de Calidad, Estructura y Frescura
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                El contenido es el rey. Para tu portafolio:
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Descripciones Detalladas de Proyectos:</strong> No te limites a mostrar imágenes. Explica el problema que resolviste, tu proceso, los desafíos y las tecnologías utilizadas. Usa las palabras clave que investigaste.</li>
                  <li><strong>Estructura Lógica con Encabezados:</strong> Usa encabezados (H1, H2, H3, etc.) para organizar tu contenido. El H1 es el más importante y debe ser único por página.</li>
                  <li><strong>Contenido Original:</strong> Evita copiar y pegar descripciones de otros sitios.</li>
                  <li><strong>Actualizaciones Regulares:</strong> Añade nuevos proyectos, actualiza los existentes, o escribe artículos de blog (si tienes uno) sobre tus aprendizajes. Google valora el contenido fresco y relevante.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                 <Monitor className="mr-3 h-5 w-5 text-primary/80" /> Velocidad de Carga y Experiencia Móvil (Core Web Vitals)
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Google prioriza los sitios que ofrecen una excelente experiencia de usuario.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Core Web Vitals:</strong> Familiarízate con métricas como Largest Contentful Paint (LCP), First Input Delay (FID) - ahora Interaction to Next Paint (INP), y Cumulative Layout Shift (CLS). Usa PageSpeed Insights para medir y mejorar.</li>
                  <li><strong>Diseño Responsivo (Mobile-First):</strong> Tu portafolio debe verse y funcionar perfectamente en todos los dispositivos, especialmente móviles. Google utiliza la indexación mobile-first.</li>
                  <li><strong>Optimización del Código:</strong> Minimiza CSS y JavaScript, elimina código no utilizado, y optimiza el renderizado. Next.js ayuda mucho con esto, pero buenas prácticas de codificación son esenciales.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <ExternalLink className="mr-3 h-5 w-5 text-primary/80" /> Enlaces Internos y Externos (Link Building Básico)
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Los enlaces ayudan a Google a descubrir tu contenido y a entender su importancia.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Enlaces Internos:</strong> Enlaza de forma lógica entre tus proyectos, tu página "Sobre mí", y cualquier artículo de blog. Ayuda a distribuir la "autoridad de página" y a mejorar la navegación.</li>
                  <li><strong>Enlaces Externos (Backlinks):</strong> Obtener enlaces de calidad desde otros sitios web hacia tu portafolio es muy valioso, aunque más difícil de controlar. Si colaboras en proyectos, participas en comunidades, o eres mencionado, intenta conseguir un enlace.</li>
                  <li><strong>Enlaces Salientes:</strong> Enlazar a recursos relevantes y de autoridad también puede ser positivo, pero con moderación.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <Settings2 className="mr-3 h-5 w-5 text-primary/80" /> Datos Estructurados (Schema Markup)
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Añade datos estructurados (usando JSON-LD es lo recomendado) para ayudar a los motores de búsqueda a entender mejor el contenido de tus páginas y mostrarlo de forma más atractiva en los resultados (rich snippets).
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Para tu perfil:</strong> Considera el schema <code className="font-mono text-sm bg-muted p-1 rounded">Person</code>.</li>
                  <li><strong>Para tus proyectos:</strong> Puedes usar <code className="font-mono text-sm bg-muted p-1 rounded">SoftwareApplication</code>, <code className="font-mono text-sm bg-muted p-1 rounded">WebSite</code>, o <code className="font-mono text-sm bg-muted p-1 rounded">CreativeWork</code> dependiendo del tipo de proyecto.</li>
                </ul>
                Puedes generar estos fragmentos JSON-LD y añadirlos al <code className="font-mono text-sm bg-muted p-1 rounded">&lt;head&gt;</code> de tus páginas o directamente en el cuerpo del HTML. Next.js permite modificar el head dinámicamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <BarChart3 className="mr-3 h-5 w-5 text-primary/80" /> Uso de Google Search Console
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Google Search Console (GSC) es una herramienta gratuita esencial.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li><strong>Verifica tu sitio:</strong> Añade y verifica tu portafolio en GSC.</li>
                  <li><strong>Envía tu Sitemap:</strong> Ayuda a Google a descubrir todas tus páginas.</li>
                  <li><strong>Monitoriza el Rendimiento:</strong> Ve qué consultas de búsqueda llevan tráfico a tu sitio, cómo se posicionan tus páginas, y los clics/impresiones que reciben.</li>
                  <li><strong>Identifica Errores:</strong> GSC te alertará sobre problemas de rastreo, indexación, usabilidad móvil, etc.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <ShieldCheck className="mr-3 h-5 w-5 text-primary/80" /> HTTPS y Seguridad del Sitio
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                HTTPS no solo es crucial para la seguridad del usuario, sino que también es un factor de ranking para Google.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li>Asegúrate de que tu portafolio se sirva a través de HTTPS. Plataformas como Vercel y Netlify suelen configurar esto automáticamente.</li>
                  <li>Considera cabeceras de seguridad como Content Security Policy (CSP) para mayor protección, aunque esto es más avanzado.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-foreground">
                <Info className="mr-3 h-5 w-5 text-primary/80" /> SEO Técnico Básico
              </AccordionTrigger>
              <AccordionContent className="text-md text-muted-foreground leading-relaxed pt-2 pl-8">
                Más allá del contenido, algunos aspectos técnicos son importantes.
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                    <li><strong>Robots.txt:</strong> Un archivo <code className="font-mono text-sm bg-muted p-1 rounded">robots.txt</code> en la raíz de tu sitio puede indicar a los rastreadores qué partes de tu sitio deben o no deben rastrear. Para un portafolio, generalmente querrás que todo sea rastreable, pero es bueno saber que existe. Next.js puede generar uno básico.</li>
                    <li><strong>Sitemap.xml:</strong> Como se mencionó, es una hoja de ruta de tu sitio para los motores de búsqueda. Asegúrate de que se genere y se envíe a Google Search Console.</li>
                    <li><strong>Manejo de Redirecciones (301):</strong> Si cambias URLs de proyectos antiguos, usa redirecciones 301 para pasar la "autoridad" a la nueva URL y evitar errores 404.</li>
                    <li><strong>Páginas 404 Personalizadas:</strong> Crea una página 404 amigable que ayude a los usuarios a volver a la navegación si llegan a una URL inexistente.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
