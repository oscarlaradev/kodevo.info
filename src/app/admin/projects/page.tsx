// src/app/admin/projects/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, PlusCircle, ArrowLeft, Info, Edit, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/data';
import { getProjectsFromFirestore } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteProject } from '@/app/actions/projectActions';


export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProjects = await getProjectsFromFirestore();
      setProjects(fetchedProjects);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
      const errorMessage = err instanceof Error ? err.message : "No se pudieron cargar los proyectos.";
      setError(errorMessage);
      toast({
        title: "Error al Cargar Proyectos",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
  };
  
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteProject(projectToDelete.id);
      if (result.success) {
        toast({
          title: "Proyecto Eliminado",
          description: `El proyecto "${projectToDelete.title}" ha sido eliminado.`,
        });
        // Refrescar la lista de proyectos
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      } else {
        throw new Error(result.error || "Ocurrió un error desconocido al eliminar.");
      }
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : "No se pudo eliminar el proyecto.";
       toast({
          title: "Error al Eliminar",
          description: errorMessage,
          variant: "destructive",
       });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
    }
  };
  

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Gestionar Proyectos" description="Añade, edita y visualiza los proyectos de tu portafolio.">
         <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/admin/projects/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Proyecto
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Link>
            </Button>
        </div>
      </AdminPageHeader>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Lista de Proyectos ({projects.length})</CardTitle>
          <CardDescription>
            Mostrando todos los proyectos desde Firebase Firestore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Cargando proyectos...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="text-center py-10 text-destructive bg-destructive/10 p-4 rounded-md">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold mb-1">Error al Cargar Proyectos</p>
              <p className="text-sm mb-3">{error}</p>
              <Button onClick={fetchProjects} variant="outline">
                Reintentar
              </Button>
            </div>
          )}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 hidden md:table-cell">Miniatura</TableHead>
                  <TableHead className="min-w-[150px]">Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="hidden lg:table-cell">Tecnologías</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="hidden md:table-cell">
                      {project.thumbnailUrl && (
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          width={48}
                          height={32}
                          className="rounded object-cover aspect-[3/2]"
                          data-ai-hint="project thumbnail"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate">
                      {project.technologies.slice(0, 3).join(', ')}
                      {project.technologies.length > 3 && '...'}
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/projects/edit/${project.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(project)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                             <span className="sr-only">Eliminar</span>
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && !isLoading && !error && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay proyectos para mostrar. Añade uno para empezar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog for Deletion */}
       <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto
              <strong className="mx-1">"{projectToDelete?.title}"</strong>
              de los servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)} disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
