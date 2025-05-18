
// src/components/admin/ProjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/lib/schemas";
import { projectSchema } from "@/lib/schemas";
import { addProjectToFirestore, updateProjectInFirestore } from "@/services/projectService";
import type { Project } from "@/lib/data";

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
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
  initialData?: Project;
  onSubmitSuccess?: (projectId: string) => void;
}

export function ProjectForm({ initialData, onSubmitSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = !!initialData?.id;

  const computedDefaultValues = {
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    category: initialData?.category || "",
    technologies: initialData?.technologies
      ? (Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : String(initialData.technologies))
      : "",
    projectUrl: initialData?.projectUrl || "",
    sourceCodeUrl: initialData?.sourceCodeUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "",
    previewUrl: initialData?.previewUrl || "",
    downloadUrl: initialData?.downloadUrl || "",
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: computedDefaultValues,
  });

  useEffect(() => {
    form.reset(computedDefaultValues);
  }, [initialData, form.reset]);

  async function onSubmit(values: ProjectFormData) {
    setIsSubmittingForm(true);

    try {
      let projectId = initialData?.id;
      if (isEditMode && projectId) {
        await updateProjectInFirestore(projectId, values);
        toast({
          title: "Proyecto Actualizado",
          description: `El proyecto "${values.title}" ha sido actualizado.`,
        });
      } else {
        projectId = await addProjectToFirestore(values);
        toast({
          title: "Proyecto Guardado",
          description: `El proyecto "${values.title}" ha sido guardado con ID: ${projectId}.`,
        });
        form.reset(computedDefaultValues); // Reset form fields after successful creation
      }

      if (onSubmitSuccess && projectId) {
        onSubmitSuccess(projectId);
      } else {
        router.push('/admin/projects');
        router.refresh();
      }

    } catch (error) {
      toast({
        title: "Error al Guardar Proyecto",
        description: (error as Error).message || "No se pudo guardar el proyecto.",
        variant: "destructive",
      });
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
                  <Input placeholder="Ej: Web App, Mobile App" {...field} disabled={isSubmittingForm} />
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
                  <Input placeholder="Ej: React, Next.js, Firebase" {...field} disabled={isSubmittingForm} />
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
              <FormLabel>URL de Miniatura del Proyecto (Thumbnail)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/thumbnail.jpg" {...field} disabled={isSubmittingForm} />
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
              <FormLabel>URL de Imagen de Vista Previa (Preview)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/preview.jpg" {...field} disabled={isSubmittingForm} />
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
                  <Input type="url" placeholder="https://tuproyecto.com" {...field} disabled={isSubmittingForm}/>
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
                  <Input type="url" placeholder="https://github.com/tu/repo" {...field} disabled={isSubmittingForm} />
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
                <Input type="url" placeholder="https://ejemplo.com/proyecto.zip" {...field} disabled={isSubmittingForm} />
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
