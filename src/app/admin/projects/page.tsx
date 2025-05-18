// src/app/admin/projects/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import type { Project } from '@/lib/data';
import { getProjectsFromFirestore, deleteProjectFromFirestore } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image'; // Import next/image

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID of project being deleted
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProjects = await getProjectsFromFirestore();
      fetchedProjects.sort((a, b) => a.title.localeCompare(b.title));
      setProjects(fetchedProjects);
    } catch (err) {
      console.error("Error fetching projects for admin page:", err);
      const errorMessage = err instanceof Error ? err.message : "No se pudieron cargar los proyectos. Intenta de nuevo más tarde.";
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

  const handleDeleteProject = async (projectToDelete: Project) => {
    if (!projectToDelete || !projectToDelete.id) {
        toast({ title: "Error", description: "ID de proyecto inválido para eliminar.", variant: "destructive" });
        return;
    }
    setIsDeleting(projectToDelete.id);
    try {
      // Pass the full project object to deleteProjectFromFirestore so it can access file URLs
      await deleteProjectFromFirestore(projectToDelete.id, projectToDelete);
      toast({
        title: "Proyecto Eliminado",
        description: `El proyecto "${projectToDelete.title}" ha sido eliminado correctamente.`,
        variant: "default",
      });
      await fetchProjects(); 
    } catch (err) {
      console.error(`Error deleting project ${projectToDelete.id}:`, err);
      const errorMessage = err instanceof Error ? err.message : "No se pudo eliminar el proyecto.";
      setError(errorMessage); 
      toast({
        title: "Error al Eliminar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Gestionar Proyectos" description="Visualiza, añade, edita o elimina proyectos de tu portafolio.">
        <Button asChild>
          <Link href="/admin/projects/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Añadir Nuevo Proyecto
          </Link>
        </Button>
      </AdminPageHeader>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Lista de Proyectos ({isLoading ? '...' : projects.length})</CardTitle>
          <CardDescription>
            Mostrando proyectos desde Firebase Firestore.
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
                      <Button variant="ghost" size="icon" asChild className="mr-1" title="Editar Proyecto">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Eliminar Proyecto" disabled={!!isDeleting}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto
                              <span className="font-semibold"> {project.title}</span> de la base de datos y sus archivos asociados de Storage.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting === project.id}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProject(project)}
                              disabled={isDeleting === project.id}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              {isDeleting === project.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && !isLoading && !error && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No hay proyectos para mostrar en Firestore. ¡Añade uno nuevo!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
