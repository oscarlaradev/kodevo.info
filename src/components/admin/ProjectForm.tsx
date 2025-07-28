// src/components/admin/ProjectForm.tsx
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/data';
import { addProject, updateProject } from '@/app/actions/projectActions';

// 1. Definir el esquema de validación con Zod
export const projectSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }),
  category: z.string().min(2, { message: "La categoría es obligatoria." }),
  shortDescription: z.string().min(10, { message: "La descripción corta es obligatoria (mín. 10 caracteres)." }).max(150, { message: "Máximo 150 caracteres." }),
  longDescription: z.string().min(20, { message: "La descripción larga es obligatoria (mín. 20 caracteres)." }),
  technologies: z.string().min(1, { message: "Añade al menos una tecnología, separada por comas." }),
  thumbnailUrl: z.string().url({ message: "Por favor, introduce una URL válida para la miniatura." }).optional().or(z.literal('')),
  previewUrl: z.string().url({ message: "Por favor, introduce una URL válida para la vista previa." }).optional().or(z.literal('')),
  projectUrl: z.string().url({ message: "Por favor, introduce una URL válida para el proyecto." }).optional().or(z.literal('')),
  sourceCodeUrl: z.string().url({ message: "Por favor, introduce una URL válida para el código fuente." }).optional().or(z.literal('')),
});

type ProjectFormInputs = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  mode?: 'create' | 'edit';
}

export function ProjectForm({ project, mode = 'create' }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormInputs>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      category: project?.category || '',
      shortDescription: project?.shortDescription || '',
      longDescription: project?.longDescription || '',
      technologies: project?.technologies.join(', ') || '',
      thumbnailUrl: project?.thumbnailUrl || 'https://placehold.co/600x400.png',
      previewUrl: project?.previewUrl || 'https://placehold.co/1200x800.png',
      projectUrl: project?.projectUrl || '',
      sourceCodeUrl: project?.sourceCodeUrl || '',
    }
  });

  const isSubmittingForm = isPending;

  const onSubmit: SubmitHandler<ProjectFormInputs> = async (data) => {
    setFormError(null);
    
    const processedData = {
        ...data,
        technologies: data.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
    };

    startTransition(async () => {
        try {
            let result;
            if (mode === 'create') {
                result = await addProject(processedData);
                if (result.success) {
                    toast({
                        title: "Proyecto Añadido",
                        description: `El proyecto "${data.title}" ha sido creado exitosamente.`,
                    });
                }
            } else if (project?.id) {
                result = await updateProject(project.id, processedData);
                 if (result.success) {
                    toast({
                        title: "Proyecto Actualizado",
                        description: `El proyecto "${data.title}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                 throw new Error("No se puede actualizar el proyecto sin un ID.");
            }

            if (result && result.success) {
                router.push('/admin/projects');
                router.refresh(); 
            } else {
                 throw new Error(result?.error || "Ocurrió un error desconocido");
            }
        } catch (err) {
            const error = err as Error;
            setFormError(error.message);
            toast({
                title: mode === 'create' ? "Error al Crear Proyecto" : "Error al Actualizar Proyecto",
                description: error.message,
                variant: "destructive",
            });
        }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Detalles del Nuevo Proyecto' : 'Editando Proyecto'}</CardTitle>
          <CardDescription>
            Rellena los campos con la información de tu proyecto. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Título del Proyecto *</Label>
              <Input id="title" {...register('title')} disabled={isSubmittingForm} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Categoría *</Label>
              <Input id="category" {...register('category')} placeholder="Ej: Web App, Mobile App, UI/UX" disabled={isSubmittingForm} />
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="technologies">Tecnologías (separadas por comas) *</Label>
              <Input id="technologies" {...register('technologies')} placeholder="Ej: React, Next.js, Firebase" disabled={isSubmittingForm} />
              {errors.technologies && <p className="text-sm text-destructive mt-1">{errors.technologies.message}</p>}
            </div>
             <div>
              <Label htmlFor="shortDescription">Descripción Corta *</Label>
              <Textarea id="shortDescription" {...register('shortDescription')} placeholder="Un resumen atractivo para la tarjeta del proyecto (máx 150 caracteres)." disabled={isSubmittingForm} />
              {errors.shortDescription && <p className="text-sm text-destructive mt-1">{errors.shortDescription.message}</p>}
            </div>
          </div>
          {/* Columna Derecha */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="longDescription">Descripción Larga *</Label>
              <Textarea id="longDescription" {...register('longDescription')} className="h-36" placeholder="Describe el proyecto en detalle: el problema, tu solución, y los resultados." disabled={isSubmittingForm} />
              {errors.longDescription && <p className="text-sm text-destructive mt-1">{errors.longDescription.message}</p>}
            </div>
             <div>
              <Label htmlFor="thumbnailUrl">URL de Miniatura (Thumbnail)</Label>
              <Input id="thumbnailUrl" {...register('thumbnailUrl')} placeholder="https://placehold.co/600x400.png" disabled={isSubmittingForm} />
              {errors.thumbnailUrl && <p className="text-sm text-destructive mt-1">{errors.thumbnailUrl.message}</p>}
            </div>
             <div>
              <Label htmlFor="previewUrl">URL de Vista Previa (Imagen Grande)</Label>
              <Input id="previewUrl" {...register('previewUrl')} placeholder="https://placehold.co/1200x800.png" disabled={isSubmittingForm} />
              {errors.previewUrl && <p className="text-sm text-destructive mt-1">{errors.previewUrl.message}</p>}
            </div>
          </div>
           {/* Sección de URLs opcionales */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
             <div>
                <Label htmlFor="projectUrl">URL del Proyecto en Vivo</Label>
                <Input id="projectUrl" {...register('projectUrl')} placeholder="https://mi-proyecto.com" disabled={isSubmittingForm} />
                {errors.projectUrl && <p className="text-sm text-destructive mt-1">{errors.projectUrl.message}</p>}
            </div>
            <div>
                <Label htmlFor="sourceCodeUrl">URL del Código Fuente (GitHub)</Label>
                <Input id="sourceCodeUrl" {...register('sourceCodeUrl')} placeholder="https://github.com/usuario/repo" disabled={isSubmittingForm} />
                {errors.sourceCodeUrl && <p className="text-sm text-destructive mt-1">{errors.sourceCodeUrl.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-6 border-t">
            {formError && (
                <div className="text-destructive text-sm flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>{formError}</span>
                </div>
            )}
            <div className="flex-grow"></div>
            <Button type="submit" disabled={isSubmittingForm}>
                {isSubmittingForm ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                {isSubmittingForm ? 'Guardando...' : (mode === 'create' ? 'Guardar Proyecto' : 'Actualizar Proyecto')}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
