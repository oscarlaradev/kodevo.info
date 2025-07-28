// src/app/admin/projects/new/page.tsx
import { ProjectForm } from '@/components/admin/ProjectForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Añadir Nuevo Proyecto" description="Completa el formulario para añadir un nuevo proyecto a tu portafolio.">
        <Button asChild variant="outline">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar y Volver
          </Link>
        </Button>
      </AdminPageHeader>
      
      {/* El formulario no necesita un proyecto inicial ya que es para crear uno nuevo */}
      <ProjectForm />
    </div>
  );
}
