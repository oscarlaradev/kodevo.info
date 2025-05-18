
"use client";

import Image from 'next/image';
import type { Project } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/use-favorites'; // Import useFavorites

interface ProjectCardProps {
  project: Project;
  onViewProject: (project: Project) => void;
}

export function ProjectCard({ project, onViewProject }: ProjectCardProps) {
  const { toggleFavorite, isFavorite, isMounted } = useFavorites();
  const favorite = isMounted ? isFavorite(project.id) : false;

  // Determine placeholder hint based on project category or title
  let dataAiHint = "project technology"; // Default hint
  if (project.title.toLowerCase().includes("ai")) dataAiHint = "artificial intelligence";
  else if (project.category.toLowerCase().includes("web")) dataAiHint = "web design";
  else if (project.category.toLowerCase().includes("ui")) dataAiHint = "modern interface";
  else if (project.title.toLowerCase().includes("space") || project.title.toLowerCase().includes("stellar")) dataAiHint = "galaxy stars";


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl overflow-hidden transform hover:-translate-y-1 animate-fade-in-up relative group">
      <CardHeader className="p-0 relative">
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          width={600}
          height={400}
          className="object-cover w-full h-48 md:h-56 transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={dataAiHint}
        />
         <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-primary font-semibold">{project.category}</Badge>
        </div>
        {isMounted && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-1.5 z-10 shadow-md hover:shadow-lg transition-all"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering onViewProject if card itself is clickable
              toggleFavorite(project.id);
            }}
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            aria-pressed={favorite}
          >
            <Heart className={`h-5 w-5 ${favorite ? 'fill-destructive text-destructive' : 'text-muted-foreground group-hover:text-destructive'}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold text-primary mb-2">{project.title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm mb-4 h-20 overflow-hidden">
          {project.shortDescription}
        </CardDescription>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs border-primary/50 text-primary/80">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs border-primary/50 text-primary/80">
              +{project.technologies.length - 3} más
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onViewProject(project)}
          className="w-full rounded-lg shadow-md hover:shadow-lg transform transition-all hover:scale-105"
          variant="default"
        >
          <Eye className="mr-2 h-4 w-4" /> Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
