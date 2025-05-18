// src/components/admin/ProjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/lib/schemas";
import { projectSchema } from "@/lib/schemas";
import { addProjectToFirestore } from "@/services/projectService"; // Import the service

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
import { useState } from "react";
// import { useRouter } from 'next/navigation'; // Uncomment if redirection is needed

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData> & { technologies?: string[] | string };
  onSubmitSuccess?: (projectId: string) => void; // Pass projectId on success
}

export function ProjectForm({ initialData, onSubmitSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = useRouter(); // Uncomment for redirection

  const computedDefaultValues = {
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    category: initialData?.category || "",
    technologies: Array.isArray(initialData?.technologies)
      ? initialData.technologies.join(', ')
      : (typeof initialData?.technologies === 'string' ? initialData.technologies : ""),
    projectUrl: initialData?.projectUrl || "",
    sourceCodeUrl: initialData?.sourceCodeUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "https://placehold.co/600x400.png",
    previewUrl: initialData?.previewUrl || "https://placehold.co/1200x800.png",
    downloadUrl: initialData?.downloadUrl || "",
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: computedDefaultValues,
  });
  
  async function onSubmit(values: ProjectFormData) {
    setIsSubmitting(true);
    try {
      // Call the service function to add to Firestore
      const projectId = await addProjectToFirestore(values);
      toast({
        title: "Proyecto Guardado en Firebase",
        description: `El proyecto "${values.title}" ha sido guardado con ID: ${projectId}.`,
        variant: "default",
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(projectId);
      }
      form.reset(); // Reset form after successful submission
      // Optionally redirect: router.push('/admin/projects');
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Error al Guardar",
        description: (error as Error).message || "No se pudo guardar el proyecto. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                <Input placeholder="Ej: Mi Increíble Aplicación Web" {...field} />
              </FormControl>
              <FormDescription>
                El nombre principal de tu proyecto.
              </FormDescription>
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
                <Textarea
                  placeholder="Una breve descripción (1-2 frases) que capture la esencia del proyecto."
                  className="resize-none"
                  {...field}
                />
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
                <Textarea
                  placeholder="Describe tu proyecto en detalle: qué problema resuelve, características principales, tu rol, etc."
                  className="min-h-[150px] resize-y"
                  {...field}
                />
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
                    <Input placeholder="Ej: Web App, Mobile App, UI Kit" {...field} />
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
                    <Input 
                      placeholder="Ej: React, Next.js, Firebase" 
                      {...field} 
                    />
                </FormControl>
                <FormDescription>
                    Separa las tecnologías con comas.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Miniatura</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/600x400.png" {...field} data-ai-hint="project thumbnail"/>
                </FormControl>
                <FormDescription>
                    Imagen para la tarjeta del proyecto (600x400px recomendado).
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="previewUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL de Vista Previa</FormLabel>
                <FormControl>
                    <Input placeholder="https://placehold.co/1200x800.png" {...field} data-ai-hint="project preview"/>
                </FormControl>
                <FormDescription>
                    Imagen para el modal del proyecto (1200x800px recomendado).
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>URL del Proyecto (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="https://tuproyecto.com" {...field} />
                </FormControl>
                <FormDescription>
                    Enlace al proyecto desplegado, si existe.
                </FormDescription>
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
                    <Input placeholder="https://github.com/tu/repo" {...field} />
                </FormControl>
                <FormDescription>
                    Enlace al repositorio de código, si es público.
                </FormDescription>
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
                <Input placeholder="https://ejemplo.com/descargas/proyecto.zip" {...field} />
              </FormControl>
              <FormDescription>
                Enlace directo al archivo del proyecto para descargar (ej. un .zip). La subida de archivos se implementará más adelante.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Proyecto"
          )}
        </Button>
      </form>
    </Form>
  );
}
