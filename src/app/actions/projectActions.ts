// src/app/actions/projectActions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addProjectToFirestore, updateProjectInFirestore, deleteProjectFromFirestore } from '@/services/projectService';

// Esquema para la validación interna, un poco más refinado que el del formulario
const projectActionSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  shortDescription: z.string().min(10).max(150),
  longDescription: z.string().min(20),
  technologies: z.array(z.string()).min(1, "Debe haber al menos una tecnología."),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  previewUrl: z.string().url().optional().or(z.literal('')),
  projectUrl: z.string().url().optional().or(z.literal('')),
  sourceCodeUrl: z.string().url().optional().or(z.literal('')),
});

export async function addProject(data: unknown) {
  // 1. Validar los datos con el esquema refinado
  const validationResult = projectActionSchema.safeParse(data);

  if (!validationResult.success) {
    console.error("Error de validación en Server Action:", validationResult.error.flatten());
    return {
      success: false,
      error: "Los datos del proyecto no son válidos. " + validationResult.error.flatten().fieldErrors,
    };
  }

  // 2. Llamar al servicio para añadir a Firestore
  try {
    const projectData = validationResult.data;
    const { id } = await addProjectToFirestore(projectData);
    
    // 3. Revalidar el path para que la lista de proyectos se actualice
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');
    
    return { success: true, projectId: id };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido al crear el proyecto.";
    console.error("Error en addProject Action:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updateProject(id: string, data: unknown) {
  const validationResult = projectActionSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Los datos del proyecto no son válidos. " + validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    await updateProjectInFirestore(id, validationResult.data);
    revalidatePath('/admin/projects');
    revalidatePath(`/projects`); 
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido al actualizar el proyecto.";
    return { success: false, error: errorMessage };
  }
}

export async function deleteProject(id: string) {
  try {
    await deleteProjectFromFirestore(id);
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido al eliminar el proyecto.";
    return { success: false, error: errorMessage };
  }
}
