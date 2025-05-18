
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
    document.title = 'My Favorite Projects - CodeCanvas';
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
          console.error("Error fetching projects for favorites page:", err);
          setError(err instanceof Error ? err.message : "Could not load project details for favorites.");
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
        <p className="text-lg text-muted-foreground">Loading your favorite projects...</p>
      </div>
    ); 
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="text-center py-10 bg-destructive/10 text-destructive p-6 rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3" />
          <h2 className="text-2xl font-semibold mb-2">Error Loading Favorites</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <HeartPulse className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">My Favorite Projects</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Projects you've saved for later. Manage your favorites here or on the project cards.
        </p>
      </header>
      {favoriteProjects.length > 0 ? (
        <ProjectList projects={favoriteProjects} />
      ) : (
        <div className="text-center py-10 bg-card shadow-lg rounded-xl p-8">
          <HeartPulse className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-foreground mb-3">No Favorites Yet!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you haven't added any projects to your favorites. 
            Click the heart icon on any project to save it here for easy access.
          </p>
        </div>
      )}
    </div>
  );
}
