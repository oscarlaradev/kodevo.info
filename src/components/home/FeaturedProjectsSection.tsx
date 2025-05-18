// src/components/home/FeaturedProjectsSection.tsx
import Link from 'next/link';
import { ProjectList } from '@/components/projects/ProjectList';
import { getProjectsFromFirestore } from '@/services/projectService';
import type { Project } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRight } from 'lucide-react';

export async function FeaturedProjectsSection() {
  let projects: Project[] = [];
  let error: string | null = null;
  const MAX_FEATURED_PROJECTS = 3;

  try {
    const allProjects = await getProjectsFromFirestore();
    // Aquí podrías implementar una lógica para ordenar por fecha o un flag "destacado"
    // Por ahora, solo tomamos los primeros N proyectos.
    projects = allProjects.slice(0, MAX_FEATURED_PROJECTS);
  } catch (err) {
    console.error("Error al obtener proyectos destacados:", err);
    error = err instanceof Error ? err.message : "No se pudieron cargar los proyectos destacados.";
  }

  if (error) {
    // Podrías mostrar un mensaje de error o simplemente no renderizar la sección
    return null; 
  }

  if (projects.length === 0) {
    // No mostrar la sección si no hay proyectos
    return null;
  }

  return (
    <section id="featured-projects" className="py-16 md:py-24 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Proyectos Destacados</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">
            Una selección de mi trabajo más reciente y relevante.
          </p>
        </div>
        
        <ProjectList projects={projects} />

        {projects.length > 0 && ( // Solo mostrar si hay proyectos, aunque ya filtramos arriba
          <div className="text-center mt-12 md:mt-16 animate-fade-in-up">
            <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transform transition-all hover:scale-105">
              <Link href="/projects">
                Ver Todos los Proyectos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
