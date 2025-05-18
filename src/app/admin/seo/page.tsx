
// src/app/admin/seo/page.tsx
"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <SearchCheck className="mr-2 h-6 w-6 text-primary" />
            Optimización SEO (Próximamente)
          </CardTitle>
          <CardDescription>
            Esta sección contendrá herramientas y guías para mejorar el posicionamiento de tu portafolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidades planeadas incluyen:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2 pl-4">
            <li>Análisis de palabras clave relevantes para tu nicho.</li>
            <li>Sugerencias para optimizar meta tags (títulos, descripciones) de tus páginas y proyectos.</li>
            <li>Comprobador de enlaces rotos.</li>
            <li>Generador de sitemap.xml.</li>
            <li>Integración con Google Search Console (si aplica).</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            El desarrollo de estas herramientas se realizará en futuras actualizaciones.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
                <Wrench className="mr-2 h-6 w-6 text-primary" />
                Conceptos Clave de SEO para Portafolios
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Títulos y Descripciones Únicos:</strong> Cada proyecto y página debe tener un título y una descripción meta únicos y descriptivos.</li>
                <li><strong>Palabras Clave Relevantes:</strong> Incorpora términos que tus potenciales clientes o empleadores podrían buscar.</li>
                <li><strong>Optimización de Imágenes:</strong> Usa atributos `alt` descriptivos para todas las imágenes.</li>
                <li><strong>Velocidad de Carga:</strong> Un sitio rápido mejora la experiencia del usuario y el ranking SEO.</li>
                <li><strong>Diseño Responsivo:</strong> Asegúrate de que tu portafolio se vea bien en todos los dispositivos.</li>
                <li><strong>Contenido de Calidad:</strong> Describe tus proyectos detalladamente, mostrando el problema, tu solución y las tecnologías usadas.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
