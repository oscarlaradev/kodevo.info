// src/app/admin/seo/page.tsx
"use client"; // This page will have interactive elements

import Link from 'next/link';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, FileText, Lightbulb, Link2, Settings2, BarChart3 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function SeoToolsPage() {
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
        {/* Tool 1: Keyword Research */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Investigación de Palabras Clave</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Descubre palabras clave relevantes para tu contenido.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="keyword-input">Palabra Clave Principal</Label>
              <Input id="keyword-input" placeholder="Ej: desarrollo web, diseño UI/UX" disabled />
            </div>
            <Button className="mt-4 w-full" disabled>Analizar Palabra Clave</Button>
            <p className="text-xs text-muted-foreground mt-2">Próximamente: análisis de volumen y dificultad.</p>
          </CardContent>
        </Card>

        {/* Tool 2: On-Page SEO Analyzer */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Análisis On-Page</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Evalúa la optimización SEO de una página específica.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="url-input">URL de la Página a Analizar</Label>
              <Input id="url-input" placeholder="Ej: /projects/mi-proyecto" disabled />
            </div>
            <Button className="mt-4 w-full" disabled>Analizar Página</Button>
            <p className="text-xs text-muted-foreground mt-2">Próximamente: revisión de meta tags, encabezados, etc.</p>
          </CardContent>
        </Card>

        {/* Tool 3: Meta Tag Generator */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Settings2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Generador de Meta Tags</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Crea meta tags optimizados para tus páginas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input id="meta-title" placeholder="Título atractivo (max 60 caract.)" disabled />
              </div>
              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea id="meta-description" placeholder="Descripción persuasiva (max 160 caract.)" className="h-20" disabled />
              </div>
            </div>
            <Button className="mt-4 w-full" disabled>Generar Tags</Button>
          </CardContent>
        </Card>
        
        {/* Tool 4: Content Idea Generator (AI) */}
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
              <Label htmlFor="topic-input">Tema Principal / Proyecto</Label>
              <Input id="topic-input" placeholder="Ej: Nuevas tendencias en React" disabled />
            </div>
            <Button className="mt-4 w-full" disabled>Generar Ideas con IA</Button>
            <p className="text-xs text-muted-foreground mt-2">Integración con Genkit próximamente.</p>
          </CardContent>
        </Card>

        {/* Tool 5: Sitemap Status */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Link2 className="h-7 w-7 text-primary" />
              <CardTitle className="text-lg font-semibold">Sitemap</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Gestiona y verifica el sitemap de tu sitio.</CardDescription>
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
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-7 w-7 text-primary" />
                <CardTitle className="text-lg font-semibold">Análisis de Enlaces Internos</CardTitle>
            </div>
            <CardDescription className="text-sm h-12">Analiza la estructura de enlaces internos de tu portafolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Esta herramienta (próximamente) te ayudará a entender cómo fluye la autoridad de enlace (link equity) a través de tu sitio.
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
                Cada proyecto y página (incluyendo "Sobre mí", "Contacto") debe tener un título (<code className="font-mono text-sm bg-muted p-1 rounded">&lt;title&gt;</code>) y una meta descripción únicos y descriptivos.
                Los títulos deben ser concisos (idealmente menos de 60 caracteres) y las descripciones atractivas (menos de 160 caracteres) para mejorar el CTR en los resultados de búsqueda.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">URLs Amigables (Semánticas)</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Utiliza URLs cortas, descriptivas y que incluyan palabras clave relevantes si es posible. Por ejemplo, <code className="font-mono text-sm bg-muted p-1 rounded">/projects/nombre-del-proyecto</code> es preferible a <code className="font-mono text-sm bg-muted p-1 rounded">/projects/item?id=123</code>.
                Next.js facilita esto con su sistema de enrutamiento basado en archivos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Optimización de Imágenes</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Comprime tus imágenes sin perder calidad y utiliza el componente <code className="font-mono text-sm bg-muted p-1 rounded">next/image</code> para servirlas en formatos modernos (como WebP) y con tamaños responsivos.
                Siempre añade texto alternativo (<code className="font-mono text-sm bg-muted p-1 rounded">alt</code>) descriptivo a todas tus imágenes; esto es crucial para la accesibilidad y ayuda a los motores de búsqueda a entender el contenido visual.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Contenido de Calidad y Estructura</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Describe tus proyectos en detalle. Explica el problema que resolviste, las tecnologías que usaste, tu rol y los resultados obtenidos.
                Utiliza encabezados (H1, H2, H3) para estructurar tu contenido lógicamente. El H1 debe ser único por página y representar el tema principal.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Velocidad de Carga (Core Web Vitals)</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Un sitio rápido mejora significativamente la experiencia del usuario y es un factor de ranking importante. Next.js ofrece muchas optimizaciones por defecto (SSR, SSG, code splitting).
                Mide el rendimiento con herramientas como Google PageSpeed Insights y Lighthouse.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Diseño Responsivo (Mobile-First)</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Asegúrate de que tu portafolio se vea y funcione perfectamente en todos los dispositivos, especialmente móviles. Google prioriza la indexación mobile-first.
                Tailwind CSS facilita la creación de diseños responsivos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">Sitemap.xml y Robots.txt</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                Un <code className="font-mono text-sm bg-muted p-1 rounded">sitemap.xml</code> ayuda a los motores de búsqueda a descubrir todas las páginas importantes de tu sitio. Un <code className="font-mono text-sm bg-muted p-1 rounded">robots.txt</code> les indica qué páginas (no) deben rastrear.
                Next.js puede generar sitemaps dinámicamente o puedes crear uno estático.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
