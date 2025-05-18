// src/app/admin/projects/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Loader2 } from 'lucide-react';
import type { Project } from '@/lib/data';
import { getProjectsFromFirestore } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProjects = await getProjectsFromFirestore();
      // Sort projects by title, or createdAt if available and desired
      fetchedProjects.sort((a, b) => a.title.localeCompare(b.title));
      setProjects(fetchedProjects);
    } catch (err) {
      console.error("Error fetching projects for admin page:", err);
      setError("No se pudieron cargar los proyectos. Intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


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
            Mostrando proyectos desde Firebase Firestore. La funcionalidad de eliminar se añadirá pronto.
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
            <div className="text-center py-10 text-destructive">
              <p>{error}</p>
              <Button onClick={fetchProjects} variant="outline" className="mt-4">
                Reintentar
              </Button>
            </div>
          )}
          {!isLoading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Tecnologías</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {project.technologies.slice(0, 3).join(', ')}
                      {project.technologies.length > 3 && '...'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="mr-2" title="Editar Proyecto">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" disabled title="Eliminar (Próximamente)">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {projects.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
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
