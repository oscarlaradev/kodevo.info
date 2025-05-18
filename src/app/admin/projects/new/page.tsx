// src/app/admin/projects/new/page.tsx
"use client"; // <-- Add this directive

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRouter } from 'next/navigation'; // Uncomment if you want to redirect

export default function NewProjectPage() {
  // const router = useRouter(); // Uncomment if you want to redirect

  // Handler for when the form is successfully submitted
  // For now, it could redirect or show a persistent success message
  // For this example, we'll rely on the toast from ProjectForm
  const handleFormSuccess = () => {
    console.log("Project created successfully from page level!");
    // Potentially redirect: router.push('/admin/projects'); // Uncomment and use if needed
  };

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader
        title="Añadir Nuevo Proyecto"
        description="Completa los detalles de tu nuevo proyecto."
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
