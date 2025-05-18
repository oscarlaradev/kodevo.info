
// src/app/admin/seo/page.tsx
"use client";

import Link from 'next/link';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, FileText, Lightbulb, Link2, Settings2, BarChart3, Loader2, AlertTriangle, Wand2 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from 'react';
import { generateSeoContentIdeas, type SeoContentIdeasInput } from '@/ai/flows/generate-seo-ideas-flow';
import { generateMetaTags, type MetaTagsInput } from '@/ai/flows/generate-meta-tags-flow';
import { generateRelatedKeywords, type RelatedKeywordsInput } from '@/ai/flows/generate-related-keywords-flow';
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
            <CardDescription className="text-sm h-12">Descubre palabras clave relacionadas y variaciones con IA.</CardDescription>
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
                <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-40 overflow-y-auto">
                  {relatedKeywords.map((keyword, index) => (
                    <li key={index}>{keyword}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tool 2: On-Page SEO Analyzer (Placeholder) */}
        <Card className="shadow-lg rounded-lg opacity-70 bg-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-7 w-7 text-primary/70" />
              <CardTitle className="text-lg font-semibold">Análisis On-Page</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Evalúa la optimización SEO de una página específica. (Próximamente)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="url-input">URL de la Página a Analizar</Label>
              <Input id="url-input" placeholder="Ej: /projects/mi-proyecto" disabled />
            </div>
            <Button className="mt-4 w-full" disabled>Analizar Página</Button>
          </CardContent>
        </Card>

        {/* Tool 3: Meta Tag Generator (AI) */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Settings2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Generador de Meta Tags (IA)</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Crea meta tags optimizados para tus páginas o temas.</CardDescription>
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
        
        {/* Tool 4: Content Idea Generator (AI) - Already Functional */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Generador de Ideas (IA)</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Obtén ideas de contenido o descripciones de proyectos con IA.</CardDescription>
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
              {isGeneratingIdeas ? 'Generando...' : 'Generar Ideas de Contenido'}
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
                <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-40 overflow-y-auto">
                  {generatedIdeas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tool 5: Sitemap Status (Placeholder) */}
        <Card className="shadow-lg rounded-lg opacity-70 bg-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Link2 className="h-7 w-7 text-primary/70" />
              <CardTitle className="text-lg font-semibold">Sitemap</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Gestiona y verifica el sitemap de tu sitio. (Próximamente)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Un sitemap ayuda a los motores de búsqueda a descubrir tu contenido.
            </p>
            <Button variant="outline" className="w-full" disabled>Verificar Sitemap (sitemap.xml)</Button>
             <Button className="mt-2 w-full" disabled>Generar/Actualizar Sitemap</Button>
            <p className="text-xs text-muted-foreground mt-2">
              Next.js puede generar sitemaps dinámicamente.
            </p>
          </CardContent>
        </Card>

        {/* Tool 6: Internal Link Analyzer (Placeholder) */}
        <Card className="shadow-lg rounded-lg opacity-70 bg-muted/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-7 w-7 text-primary/70" />
                <CardTitle className="text-lg font-semibold">Análisis de Enlaces Internos</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Analiza la estructura de enlaces internos. (Próximamente)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Esta herramienta (próximamente) te ayudará a entender cómo fluye el link equity.
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
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Títulos y Descripciones Únicos</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Cada proyecto y página debe tener un título (<code className="font-mono text-sm bg-muted p-1 rounded">&lt;title&gt;</code>) y una meta descripción únicos.
                Los títulos: concisos (menos de 60 caract.), las descripciones: atractivas (menos de 160 caract.).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">URLs Amigables (Semánticas)</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Usa URLs cortas y descriptivas. Ej: <code className="font-mono text-sm bg-muted p-1 rounded">/projects/nombre-proyecto</code>.
                Next.js facilita esto con su sistema de enrutamiento.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Optimización de Imágenes</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Comprime imágenes y usa <code className="font-mono text-sm bg-muted p-1 rounded">next/image</code>.
                Añade texto <code className="font-mono text-sm bg-muted p-1 rounded">alt</code> descriptivo.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Contenido de Calidad y Estructura</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Describe tus proyectos en detalle. Usa encabezados (H1, H2, H3) para estructurar.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
