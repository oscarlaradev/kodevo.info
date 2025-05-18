// src/components/admin/ProjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/lib/schemas";
import { projectSchema } from "@/lib/schemas";

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

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>; // For editing later
  onSubmitSuccess?: (data: ProjectFormData) => void;
}

export function ProjectForm({ initialData, onSubmitSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute defaultValues correctly, ensuring technologies is a string for the form input
  const computedDefaultValues = {
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    category: initialData?.category || "",
    technologies: (initialData?.technologies && Array.isArray(initialData.technologies))
      ? initialData.technologies.join(', ') // For editing: convert string[] from ProjectFormData to string
      : (initialData?.technologies as unknown as string || ""), // Handle if initialData.technologies is already a string, or default to empty string for new
    projectUrl: initialData?.projectUrl || "",
    sourceCodeUrl: initialData?.sourceCodeUrl || "",
    thumbnailUrl: initialData?.thumbnailUrl || "https://placehold.co/600x400.png",
    previewUrl: initialData?.previewUrl || "https://placehold.co/1200x800.png",
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: computedDefaultValues,
  });
  
  async function onSubmit(values: ProjectFormData) {
    setIsSubmitting(true);
    console.log("Project form data (after Zod transformation):", values);
    // Note: values.technologies will be string[] here due to Zod transform

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Replace with actual Firebase call
    // For now, we'll just show a success toast and log to console

    toast({
      title: "Proyecto (Simulado) Guardado",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });

    if (onSubmitSuccess) {
      onSubmitSuccess(values);
    }
    // form.reset(); // Optionally reset form after successful submission
    setIsSubmitting(false);
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
            render={({ field }) => ( // field.value here will be a string
                <FormItem>
                <FormLabel>Tecnologías Usadas</FormLabel>
                <FormControl>
                    <Input 
                      placeholder="Ej: React, Next.js, Firebase" 
                      {...field} // Input expects value to be a string
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
                    <Input placeholder="https://placehold.co/600x400.png" {...field} />
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
                    <Input placeholder="https://placehold.co/1200x800.png" {...field} />
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
