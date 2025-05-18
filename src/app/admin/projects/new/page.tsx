// src/app/admin/projects/new/page.tsx
"use client"; 

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation'; // Import useRouter

export default function NewProjectPage() {
  const router = useRouter(); 

  const handleFormSuccess = (projectId: string) => {
    console.log(`Proyecto creado exitosamente con ID: ${projectId} desde el nivel de página.`);
    // Redirect to the projects list page after successful creation
    router.push('/admin/projects'); 
    // You might also want to call router.refresh() if the projects page needs to re-fetch immediately
    // but since it fetches on mount, push should be enough if it re-mounts or re-runs useEffect.
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
