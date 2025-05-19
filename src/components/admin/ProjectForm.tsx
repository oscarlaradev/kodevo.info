// src/components/admin/ProjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/lib/schemas";
import { projectSchema } from "@/lib/schemas";
import { addProjectToFirestore, updateProjectInFirestore } from '@/services/projectService';
import type { Project } from '@/lib/data';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react"; // Added useMemo
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  initialData?: Project | null; // Allow null for initialData
  onSubmitSuccess?: (projectId: string) => void;
}

// Define default values for a new project to ensure technologies is always a string
const newProjectDefaultValues: ProjectFormData = {
  title: "",
  shortDescription: "",
  longDescription: "",
  category: "",
  technologies: [], // Zod transform will handle string input, but react-hook-form may prefer array here for type safety
  projectUrl: "",
  sourceCodeUrl: "",
  thumbnailUrl: "", // Will be URLs
  previewUrl: "",   // Will be URLs
  downloadUrl: "",  // Will be URL
};

// Helper to transform Project to ProjectFormData for the form
const projectToFormData = (project: Project | null | undefined): Partial<ProjectFormData> => {
  if (!project) return newProjectDefaultValues;
  return {
    title: project.title,
    shortDescription: project.shortDescription,
    longDescription: project.longDescription,
    category: project.category,
    // Ensure technologies is always a string for the form field, Zod will transform it
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    projectUrl: project.projectUrl || "",
    sourceCodeUrl: project.sourceCodeUrl || "",
    thumbnailUrl: project.thumbnailUrl || "",
    previewUrl: project.previewUrl || "",
    downloadUrl: project.downloadUrl || "",
  };
};


export function ProjectForm({ initialData, onSubmitSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = !!initialData?.id;

  // Memoize default values to prevent unnecessary re-renders or effect triggers
  const formDefaultValues = useMemo(() => {
    if (initialData) {
      return {
        title: initialData.title || "",
        shortDescription: initialData.shortDescription || "",
        longDescription: initialData.longDescription || "",
        category: initialData.category || "",
        // The form field expects a string, Zod schema handles string[]
        technologies: Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : "",
        projectUrl: initialData.projectUrl || "",
        sourceCodeUrl: initialData.sourceCodeUrl || "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        previewUrl: initialData.previewUrl || "",
        downloadUrl: initialData.downloadUrl || "",
      };
    }
    return { // Defaults for a new project
      title: "",
      shortDescription: "",
      longDescription: "",
      category: "",
      technologies: "", // Zod schema starts with string
      projectUrl: "",
      sourceCodeUrl: "",
      thumbnailUrl: "",
      previewUrl: "",
      downloadUrl: "",
    };
  }, [initialData]);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: formDefaultValues,
  });
  
  useEffect(() => {
    // When initialData changes (e.g., loading for edit page, or switching between new/edit)
    // Reset the form with the new defaultValues.
    // The `formDefaultValues` itself is memoized and only changes if `initialData` changes.
    form.reset(formDefaultValues);
  }, [formDefaultValues, form.reset]);


  async function onSubmit(values: ProjectFormData) {
    setIsSubmittingForm(true);
    // The 'technologies' field from Zod validated 'values' will be string[]
    // The service functions expect ProjectFormData which has technologies as string[]
    // So, no further transformation of values.technologies is needed here if schema is correct.

    try {
      let projectId = initialData?.id;
      if (isEditMode && projectId) {
        // `values` from Zod already has technologies as string[]
        await updateProjectInFirestore(projectId, values);
        toast({
          title: "Proyecto Actualizado",
          description: `El proyecto "${values.title}" ha sido actualizado.`,
        });
      } else {
        // `values` from Zod already has technologies as string[]
        projectId = await addProjectToFirestore(values);
        toast({
          title: "Proyecto Guardado",
          description: `El proyecto "${values.title}" ha sido guardado con ID: ${projectId}.`,
        });
        form.reset(formDefaultValues); // Reset form fields after successful creation
      }

      if (onSubmitSuccess && projectId) {
        onSubmitSuccess(projectId);
      } else {
        router.push('/admin/projects');
        router.refresh();
      }

    } catch (error) {
      const err = error as Error;
      toast({
        title: "Error al Guardar Proyecto",
        description: err.message || "No se pudo guardar el proyecto. Revisa los logs del servidor para más detalles.",
        variant: "destructive",
      });
      console.error("[ProjectForm Error] onSubmit:", err.message, err.stack);
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del Proyecto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mi Increíble Aplicación Web" {...field} disabled={isSubmittingForm} />
              </FormControl>
              <FormDescription>El nombre principal de tu proyecto.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción Corta</FormLabel>
              <FormControl>
                <Textarea placeholder="Una breve descripción (1-2 frases)." className="resize-none" {...field} disabled={isSubmittingForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción Larga</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe tu proyecto en detalle." className="min-h-[150px] resize-y" {...field} disabled={isSubmittingForm} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: App Web, App Móvil" {...field} disabled={isSubmittingForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tecnologías Usadas</FormLabel>
                <FormControl>
                  {/* The field.value here should be the string from the form state */}
                  <Input 
                    placeholder="Ej: React, Next.js, Firebase" 
                    {...field} 
                    // Ensure field.value is treated as a string for the Input component
                    value={typeof field.value === 'string' ? field.value : (Array.isArray(field.value) ? field.value.join(', ') : '')}
                    onChange={(e) => field.onChange(e.target.value)} // Ensure onChange passes string
                    disabled={isSubmittingForm} 
                  />
                </FormControl>
                <FormDescription>Separa las tecnologías con comas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Miniatura del Proyecto</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/thumbnail.jpg" {...field} value={field.value || ''} disabled={isSubmittingForm} />
              </FormControl>
              <FormDescription>URL de la imagen para la tarjeta del proyecto (600x400px recomendado).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="previewUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen de Vista Previa</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/preview.jpg" {...field} value={field.value || ''} disabled={isSubmittingForm} />
              </FormControl>
              <FormDescription>URL de la imagen para el modal del proyecto (1200x800px recomendado).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Proyecto (Opcional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://tuproyecto.com" {...field} value={field.value || ''} disabled={isSubmittingForm}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sourceCodeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Código Fuente (Opcional)</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://github.com/tu/repo" {...field} value={field.value || ''} disabled={isSubmittingForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="downloadUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Archivo Descargable (Opcional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/proyecto.zip" {...field} value={field.value || ''} disabled={isSubmittingForm} />
              </FormControl>
              <FormDescription>URL del archivo del proyecto para descargar (ej. .zip).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmittingForm} className="w-full sm:w-auto">
          {isSubmittingForm ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Actualizando..." : "Guardando..."}</>
          ) : (
            isEditMode ? "Actualizar Proyecto" : "Guardar Proyecto"
          )}
        </Button>
      </form>
    </Form>
  );
}
