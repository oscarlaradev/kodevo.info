// src/app/admin/projects/edit/[id]/page.tsx
import { getProjectByIdFromFirestore } from '@/services/projectService';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params;
  const project = await getProjectByIdFromFirestore(id);

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error: Proyecto no encontrado</AlertTitle>
          <AlertDescription>
            No se pudo encontrar el proyecto con el ID proporcionado. Es posible que haya sido eliminado.
            <Button asChild variant="link" className="p-0 h-auto ml-2">
              <Link href="/admin/projects">Volver a la lista de proyectos</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title={`Editando: ${project.title}`} description="Modifica los detalles del proyecto y guarda los cambios.">
        <Button asChild variant="outline">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar y Volver
          </Link>
        </Button>
      </AdminPageHeader>
      
      <ProjectForm project={project} mode="edit" />
    </div>
  );
}
