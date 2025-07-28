
import { ProjectList } from '@/components/projects/ProjectList';
import { getProjectsFromFirestore } from '@/services/projectService';
import type { Project } from '@/lib/data';
import { Presentation, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proyectos - Kodevo',
  description: 'Explora una colección de proyectos innovadores desde Firebase.',
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let error: string | null = null;

  try {
    projects = await getProjectsFromFirestore();
    // Optional: sort projects if not handled by Firestore query (e.g., by title)
    projects.sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error("Error al obtener proyectos para la página pública:", err);
    error = err instanceof Error ? err.message : "No se pudieron cargar los proyectos en este momento. Por favor, inténtalo de nuevo más tarde.";
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <Presentation className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Mis Proyectos</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Una muestra de mi pasión por el desarrollo, el diseño y la resolución de problemas. Explora el trabajo del que estoy más orgulloso.
        </p>
      </header>
      
      {error && (
        <div className="text-center py-10 bg-destructive/10 text-destructive p-6 rounded-lg shadow-md mb-8">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold mb-2">¡Ups! Algo salió mal.</h2>
          <p>{error}</p>
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="text-center py-10 bg-card shadow-lg rounded-xl p-8">
          <Presentation className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-3">¡Aún no hay proyectos!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Parece que no hay proyectos para mostrar en este momento. 
            ¡Vuelve pronto o añade algunos proyectos desde el panel de administración!
          </p>
        </div>
      )}

      {!error && projects.length > 0 && (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
