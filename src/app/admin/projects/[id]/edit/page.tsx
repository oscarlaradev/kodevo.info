// src/app/admin/projects/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { getProjectByIdFromFirestore } from '@/services/projectService';
import type { Project } from '@/lib/data';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = typeof params.id === 'string' ? params.id : undefined;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      setError(null);
      getProjectByIdFromFirestore(projectId)
        .then((data) => {
          if (data) {
            setProject(data);
          } else {
            setError("Proyecto no encontrado.");
          }
        })
        .catch((err) => {
          console.error("Error al obtener el proyecto para editar:", err);
          setError("No se pudo cargar el proyecto para editar.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Should not happen if route is matched correctly
      setError("ID de proyecto no válido.");
      setIsLoading(false);
    }
  }, [projectId]);

  const handleFormSuccess = (updatedProjectId: string) => {
    console.log(`Proyecto ${updatedProjectId} actualizado exitosamente.`);
    router.push('/admin/projects');
    router.refresh(); // Important to re-fetch the list on the projects page
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando datos del proyecto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AdminPageHeader title="Error" />
        <Card className="shadow-lg rounded-lg">
          <CardContent className="py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button asChild variant="outline">
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Proyectos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
     // This case should ideally be covered by error state, but as a fallback
    return (
      <div className="container mx-auto py-8 text-center">
         <AdminPageHeader title="Proyecto no encontrado" />
         <Card className="shadow-lg rounded-lg">
          <CardContent className="py-8">
            <p className="text-muted-foreground mb-4">El proyecto que intentas editar no existe o no se pudo cargar.</p>
             <Button asChild variant="outline">
              <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Proyectos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader
        title="Editar Proyecto en Firebase"
        description={`Modifica los detalles del proyecto: ${project.title}`}
      >
        <Button asChild variant="outline">
            <Link href="/admin/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Proyectos
            </Link>
        </Button>
      </AdminPageHeader>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={project} onSubmitSuccess={handleFormSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
