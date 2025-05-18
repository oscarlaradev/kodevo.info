
"use client";

import Image from 'next/image';
import type { Project } from '@/lib/data';
import { useFavorites } from '@/hooks/use-favorites';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink, Github, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';


interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { toggleFavorite, isFavorite, isMounted } = useFavorites();
  const favorite = isMounted ? isFavorite(project.id) : false;

  let dataAiHintPreview = "project preview";
  if (project.title.toLowerCase().includes("ai")) dataAiHintPreview = "interface screenshot";
  else if (project.category.toLowerCase().includes("web")) dataAiHintPreview = "website mockup";
  else if (project.category.toLowerCase().includes("ui")) dataAiHintPreview = "design system";
  else if (project.title.toLowerCase().includes("space") || project.title.toLowerCase().includes("stellar")) dataAiHintPreview = "space visualization";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] p-0 rounded-xl shadow-2xl bg-card flex flex-col"
      >
        <DialogHeader className="p-6 pb-4 border-b border-border text-left">
          <DialogTitle className="text-3xl font-bold text-primary mb-1">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {project.category}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            <div className="rounded-lg overflow-hidden shadow-lg aspect-video relative">
              <Image
                src={project.previewUrl}
                alt={`${project.title} vista previa`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                data-ai-hint={dataAiHintPreview}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Resumen del Proyecto</h3>
              <p className="text-foreground/80 leading-relaxed mb-6 text-sm">
                {project.longDescription}
              </p>

              <h4 className="text-lg font-semibold text-foreground mb-3">Tecnologías Utilizadas</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-border bg-muted/30 rounded-b-xl flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
            {project.projectUrl && (
              <Button variant="outline" asChild className="rounded-lg shadow-sm hover:shadow-md">
                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Demo en Vivo
                </a>
              </Button>
            )}
            {project.sourceCodeUrl && (
              <Button variant="outline" asChild className="rounded-lg shadow-sm hover:shadow-md">
                <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Código Fuente
                </a>
              </Button>
            )}
            {project.downloadUrl && project.downloadUrl !== "#" && (
              <Button variant="outline" asChild className="rounded-lg shadow-sm hover:shadow-md">
                <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 h-4 w-4" /> Descargar Proyecto
                </a>
              </Button>
            )}
          </div>
          <Button
            onClick={() => toggleFavorite(project.id)}
            variant={favorite ? 'default' : 'outline'}
            className="rounded-lg shadow-sm hover:shadow-md"
            aria-pressed={favorite}
            title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart className={`mr-2 h-4 w-4 ${favorite ? 'fill-current text-destructive-foreground' : ''}`} />
            {favorite ? 'En Favoritos' : 'Añadir a Favoritos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
