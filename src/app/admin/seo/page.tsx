
// src/app/admin/seo/page.tsx
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchCheck, Wrench, Lightbulb, FileText, BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SeoToolsPage() {
  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Herramientas SEO" description="Optimiza el contenido de tu portafolio para motores de búsqueda.">
        <Button asChild variant="outline">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
            </Link>
        </Button>
      </AdminPageHeader>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BrainCircuit className="mr-2 h-7 w-7 text-primary" />
              <CardTitle className="text-xl font-semibold">Asistente IA para SEO (Concepto)</CardTitle>
            </div>
            <CardDescription>
              Herramientas conceptuales impulsadas por IA para potenciar tu SEO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center"><SearchCheck className="mr-2 h-5 w-5 text-primary/80" />Análisis de Palabras Clave</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Introduce un tema o nicho para obtener sugerencias de palabras clave relevantes. (Funcionalidad futura)
              </p>
              <Textarea placeholder="Ej: 'Desarrollo web con Next.js', 'Diseño UI/UX para móviles'" className="mb-2" />
              <Button variant="outline" disabled>Obtener Sugerencias (Próximamente)</Button>
            </div>
            <hr className="my-4 border-border" />
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary/80" />Optimizador de Meta Tags</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Analiza y sugiere mejoras para los meta tags de tus proyectos o páginas. (Funcionalidad futura)
              </p>
              <div className="space-y-2">
                <div>
                    <Label htmlFor="metaTitle">Meta Título (Ejemplo)</Label>
                    <Input id="metaTitle" placeholder="Título atractivo y rico en palabras clave" disabled />
                </div>
                <div>
                    <Label htmlFor="metaDesc">Meta Descripción (Ejemplo)</Label>
                    <Textarea id="metaDesc" placeholder="Descripción persuasiva (155-160 caracteres)" className="resize-none" disabled/>
                </div>
                 <Button variant="outline" disabled>Analizar Meta Tags (Próximamente)</Button>
              </div>
            </div>
             <hr className="my-4 border-border" />
             <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary/80" />Generador de Sitemap</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Herramienta para generar un `sitemap.xml` para tu sitio. (Funcionalidad futura)
              </p>
              <Button variant="outline" disabled>Generar Sitemap.xml (Próximamente)</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
                <Lightbulb className="mr-2 h-7 w-7 text-primary" />
                <CardTitle className="text-xl font-semibold">Guía Rápida de SEO para Portafolios</CardTitle>
            </div>
            <CardDescription>Conceptos clave y buenas prácticas para mejorar el SEO de tu portafolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-3 text-muted-foreground">
              <li>
                <strong>Títulos y Descripciones Únicos:</strong> Cada proyecto y página debe tener un título (`<title>`) y una descripción (`<meta name="description">`) únicos, descriptivos y que incluyan palabras clave relevantes.
              </li>
              <li>
                <strong>Palabras Clave Estratégicas:</strong> Investiga e incorpora términos que tus potenciales clientes o empleadores podrían buscar para encontrar a alguien con tus habilidades.
              </li>
              <li>
                <strong>Optimización de Imágenes:</strong> Usa atributos `alt` descriptivos para todas las imágenes. Comprime las imágenes para reducir su tamaño sin perder calidad.
              </li>
              <li>
                <strong>Velocidad de Carga (Core Web Vitals):</strong> Un sitio rápido mejora la experiencia del usuario y el ranking SEO. Optimiza imágenes, código y usa el lazy loading.
              </li>
              <li>
                <strong>Diseño Responsivo (Mobile-First):</strong> Asegúrate de que tu portafolio se vea y funcione bien en todos los dispositivos, especialmente móviles.
              </li>
              <li>
                <strong>Contenido de Calidad y Estructurado:</strong> Describe tus proyectos detalladamente, mostrando el problema, tu solución y las tecnologías usadas. Usa encabezados (`H1`, `H2`, etc.) para estructurar tu contenido.
              </li>
               <li>
                <strong>URLs Amigables:</strong> Utiliza URLs cortas, descriptivas y que contengan palabras clave si es posible.
              </li>
              <li>
                <strong>Enlaces Internos:</strong> Enlaza entre tus propias páginas de forma lógica para ayudar a los motores de búsqueda a descubrir tu contenido y distribuir la "autoridad de enlace".
              </li>
              <li>
                <strong>Sitemap.xml y Robots.txt:</strong> Un `sitemap.xml` ayuda a los motores de búsqueda a encontrar todas tus páginas. Un `robots.txt` les indica qué páginas no deben rastrear.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
