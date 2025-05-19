// src/app/admin/projects/new/page.tsx
"use client"; 

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation'; 

export default function NewProjectPage() {
  const router = useRouter(); 

  const handleFormSuccess = (projectId: string) => {
    console.log(`Proyecto creado exitosamente con ID: ${projectId} desde el nivel de página.`);
    // Redirect to the projects list page after successful creation
    router.push('/admin/projects'); 
    // Refresh the data for the /admin/projects route
    router.refresh(); 
  };

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader
        title="Añadir Nuevo Proyecto a Firebase"
        description="Completa los detalles de tu nuevo proyecto. Se guardará en Firestore."
      />
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm onSubmitSuccess={handleFormSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
