
// src/services/projectService.ts
'use server';

import { firestore } from '@/lib/firebase'; 
import {
  collection,
  addDoc,
  getDocs,
  doc,
  serverTimestamp,
  Timestamp,
  getDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from 'firebase/firestore';
import type { ProjectFormData } from '@/lib/schemas';
import type { Project } from '@/lib/data';
import { FirebaseError } from 'firebase/app';

// Helper function to convert Firestore document data to Project type
function mapDocToProject(docSnap: DocumentData, id: string): Project {
  const data = docSnap.data();
  const technologies = Array.isArray(data?.technologies)
    ? data.technologies
    : [];

  return {
    id: id,
    title: data?.title || '',
    shortDescription: data?.shortDescription || '',
    longDescription: data?.longDescription || '',
    category: data?.category || '',
    technologies: technologies,
    thumbnailUrl: data?.thumbnailUrl || 'https://placehold.co/600x400.png',
    previewUrl: data?.previewUrl || 'https://placehold.co/1200x800.png',
    projectUrl: data?.projectUrl || undefined,
    sourceCodeUrl: data?.sourceCodeUrl || undefined,
    downloadUrl: data?.downloadUrl || undefined,
  };
}

/**
 * Adds a new project to Firestore.
 * @param projectData The data for the new project from the form.
 * @returns The ID of the newly created project document.
 */
export async function addProjectToFirestore(projectData: ProjectFormData): Promise<string> {
  console.log('[Acción de Servidor] addProjectToFirestore llamada con:', JSON.stringify(projectData, null, 2));
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    const technologiesArray = Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (typeof projectData.technologies === 'string' ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    const docData = {
      ...projectData,
      technologies: technologiesArray,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log('[Acción de Servidor] Datos del documento a añadir:', JSON.stringify(docData, null, 2));
    const docRef = await addDoc(projectsCollectionRef, docData);
    console.log('[Acción de Servidor] Proyecto añadido con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    let errorMessage = "No se pudo añadir el proyecto. Ocurrió un error desconocido.";
    if (error instanceof FirebaseError) {
      errorMessage = `Error de Firebase al añadir proyecto: ${error.message} (Código: ${error.code})`;
      console.error("[Acción de Servidor FirebaseError] Error al añadir proyecto a Firestore: ", error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `No se pudo añadir el proyecto: ${error.message}.`;
      console.error("[Acción de Servidor Error] Error al añadir proyecto a Firestore: ", error.name, error.message, error.stack);
    } else {
      console.error("[Acción de Servidor Error Desconocido] Error al añadir proyecto a Firestore: ", error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Fetches all projects from Firestore.
 * @returns A promise that resolves to an array of projects.
 */
export async function getProjectsFromFirestore(): Promise<Project[]> {
  console.log('[Acción de Servidor] getProjectsFromFirestore llamada');
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    const querySnapshot = await getDocs(projectsCollectionRef);

    const projects: Project[] = querySnapshot.docs.map(docSnap => {
      return mapDocToProject(docSnap, docSnap.id);
    });
    console.log(`[Acción de Servidor] Obtenidos ${projects.length} proyectos.`);
    return projects;
  } catch (error) {
    let errorMessage = "No se pudieron obtener los proyectos. Ocurrió un error desconocido.";
    if (error instanceof FirebaseError) {
      errorMessage = `Error de Firebase al obtener proyectos: ${error.message} (Código: ${error.code})`;
      console.error("[Acción de Servidor FirebaseError] Error al obtener proyectos de Firestore: ", error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `No se pudieron obtener los proyectos: ${error.message}.`;
      console.error("[Acción de Servidor Error] Error al obtener proyectos de Firestore: ", error.name, error.message, error.stack);
    } else {
      console.error("[Acción de Servidor Error Desconocido] Error al obtener proyectos de Firestore: ", error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Fetches a single project by its ID from Firestore.
 * @param projectId The ID of the project to fetch.
 * @returns A promise that resolves to the project data or null if not found.
 */
export async function getProjectByIdFromFirestore(projectId: string): Promise<Project | null> {
  console.log(`[Acción de Servidor] getProjectByIdFromFirestore llamada para ID: ${projectId}`);
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'ID de proyecto inválido proporcionado a getProjectByIdFromFirestore.';
    console.error('[Acción de Servidor Error]', invalidIdErrorMsg, 'Recibido:', projectId);
    throw new Error(invalidIdErrorMsg);
  }
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    const docSnap = await getDoc(projectDocRef);

    if (docSnap.exists()) {
      const project = mapDocToProject(docSnap, docSnap.id);
      console.log(`[Acción de Servidor] Encontrado proyecto con ID ${projectId}`);
      return project;
    } else {
      console.warn(`[Acción de Servidor] No existe documento de proyecto con ID: ${projectId}`);
      return null;
    }
  } catch (error) {
    let errorMessage = `No se pudo obtener el proyecto con ID ${projectId}. Ocurrió un error desconocido.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Error de Firebase al obtener proyecto ID ${projectId}: ${error.message} (Código: ${error.code})`;
      console.error(`[Acción de Servidor FirebaseError] Error al obtener proyecto por ID ${projectId} de Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `No se pudo obtener el proyecto con ID ${projectId}: ${error.message}.`;
      console.error(`[Acción de Servidor Error] Error al obtener proyecto por ID ${projectId} de Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Acción de Servidor Error Desconocido] Error al obtener proyecto por ID ${projectId} de Firestore: `, error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Updates an existing project in Firestore.
 * @param projectId The ID of the project to update.
 * @param projectData The new data for the project.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateProjectInFirestore(projectId: string, projectData: ProjectFormData): Promise<void> {
  console.log(`[Acción de Servidor] updateProjectInFirestore llamada para ID: ${projectId} con datos:`, JSON.stringify(projectData, null, 2));
   if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'ID de proyecto inválido proporcionado para actualizar en updateProjectInFirestore.';
    console.error('[Acción de Servidor Error]', invalidIdErrorMsg, 'Recibido:', projectId);
    throw new Error(invalidIdErrorMsg);
  }
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    const technologiesArray = Array.isArray(projectData.technologies)
      ? projectData.technologies
      : (typeof projectData.technologies === 'string' ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    const docData = {
      ...projectData,
      technologies: technologiesArray,
      updatedAt: serverTimestamp(),
    };
    console.log('[Acción de Servidor] Datos del documento a actualizar:', JSON.stringify(docData, null, 2));
    await updateDoc(projectDocRef, docData);
    console.log(`[Acción de Servidor] Proyecto con ID ${projectId} actualizado exitosamente.`);
  } catch (error)
 {
    let errorMessage = `No se pudo actualizar el proyecto con ID ${projectId}. Ocurrió un error desconocido.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Error de Firebase al actualizar proyecto ID ${projectId}: ${error.message} (Código: ${error.code})`;
      console.error(`[Acción de Servidor FirebaseError] Error al actualizar proyecto ${projectId} en Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `No se pudo actualizar el proyecto con ID ${projectId}: ${error.message}.`;
      console.error(`[Acción de Servidor Error] Error al actualizar proyecto ${projectId} en Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Acción de Servidor Error Desconocido] Error al actualizar proyecto ${projectId} en Firestore: `, error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Deletes a project from Firestore.
 * @param projectId The ID of the project to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  console.log(`[Acción de Servidor] deleteProjectFromFirestore llamada para ID: ${projectId}`);
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'ID de proyecto inválido proporcionado para eliminar.';
    console.error('[Acción de Servidor Error]', invalidIdErrorMsg, 'Recibido:', projectId);
    throw new Error(invalidIdErrorMsg);
  }
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    await deleteDoc(projectDocRef);
    console.log(`[Acción de Servidor] Proyecto con ID ${projectId} eliminado exitosamente de Firestore.`);
  } catch (error) {
    let errorMessage = `No se pudo eliminar el proyecto con ID ${projectId}. Ocurrió un error desconocido.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Error de Firebase al eliminar proyecto ID ${projectId}: ${error.message} (Código: ${error.code})`;
      console.error(`[Acción de Servidor FirebaseError] Error al eliminar proyecto ${projectId} de Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `No se pudo eliminar el proyecto con ID ${projectId}: ${error.message}.`;
      console.error(`[Acción de Servidor Error] Error al eliminar proyecto ${projectId} de Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Acción de Servidor Error Desconocido] Error al eliminar proyecto ${projectId} de Firestore: `, error);
    }
    throw new Error(errorMessage);
  }
}
