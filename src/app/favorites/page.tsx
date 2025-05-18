
"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import type { Project } from '@/lib/data';
import { useFavorites } from '@/hooks/use-favorites';
import { getProjectsFromFirestore } from '@/services/projectService'; // Import Firestore service
import { HeartPulse, Loader2, AlertTriangle } from 'lucide-react'; 

export default function FavoritesPage() {
  const { favorites, isMounted: favoritesMounted } = useFavorites();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Mis Proyectos Favoritos - Kodevo';
  }, []);

  // Fetch all projects once when favorites are mounted
  useEffect(() => {
    if (favoritesMounted) {
      setIsLoading(true);
      setError(null);
      getProjectsFromFirestore()
        .then(fetchedProjects => {
          setAllProjects(fetchedProjects);
        })
        .catch(err => {
          console.error("Error al obtener proyectos para la página de favoritos:", err);
          setError(err instanceof Error ? err.message : "No se pudieron cargar los detalles del proyecto para los favoritos.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [favoritesMounted]);

  // Filter allProjects to get favoriteProjects when favorites or allProjects change
  useEffect(() => {
    if (favoritesMounted && allProjects.length > 0) {
      const filteredProjects = allProjects.filter(project => favorites.includes(project.id));
      setFavoriteProjects(filteredProjects);
    } else if (favoritesMounted) { // Handle case where allProjects might be empty (e.g. no projects in DB)
        setFavoriteProjects([]);
    }
  }, [favorites, allProjects, favoritesMounted]);

  if (!favoritesMounted || isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
        <p className="text-lg text-muted-foreground">Cargando tus proyectos favoritos...</p>
      </div>
    ); 
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="text-center py-10 bg-destructive/10 text-destructive p-6 rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold mb-2">Error al Cargar Favoritos</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <HeartPulse className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Mis Proyectos Favoritos</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Proyectos que has guardado para más tarde. Gestiona tus favoritos aquí o en las tarjetas de los proyectos.
        </p>
      </header>
      {favoriteProjects.length > 0 ? (
        <ProjectList projects={favoriteProjects} />
      ) : (
        <div className="text-center py-10 bg-card shadow-lg rounded-xl p-8">
          <HeartPulse className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-3">¡Aún no hay favoritos!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Parece que no has añadido ningún proyecto a tus favoritos. 
            Haz clic en el icono del corazón en cualquier proyecto para guardarlo aquí y acceder fácilmente.
          </p>
        </div>
      )}
    </div>
  );
}
