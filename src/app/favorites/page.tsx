
"use client";

import { useState, useEffect } from 'react';
import { ProjectList } from '@/components/projects/ProjectList';
import { projectsData, type Project } from '@/lib/data';
import { useFavorites } from '@/hooks/use-favorites';
import { HeartPulse } from 'lucide-react'; // Using a slightly different Heart icon for page title

export const metadata = {
  title: 'My Favorite Projects - CodeCanvas',
  description: 'A collection of your saved favorite projects from CodeCanvas.',
};

export default function FavoritesPage() {
  const { favorites, isMounted } = useFavorites();
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (isMounted) {
      const filteredProjects = projectsData.filter(project => favorites.includes(project.id));
      setFavoriteProjects(filteredProjects);
    }
  }, [favorites, isMounted, projectsData]); // Added projectsData to dependencies

  if (!isMounted) {
    // Optional: show a loading state or null until client-side hydration
    // You can replace this with a Skeleton loader component if you have one
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="animate-pulse">
          <HeartPulse className="h-16 w-16 text-muted mx-auto mb-4" />
          <div className="h-8 bg-muted rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
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
