// src/services/projectService.ts
'use server';

import { adminFirestore } from '@/lib/firebase-admin';
import { firestore } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  type DocumentData,
  query,
  orderBy,
  getDoc,
} from 'firebase/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import type { Project } from '@/lib/data';

const FIRESTORE_UNINITIALIZED_ERROR = "Firestore (cliente) no está inicializado. Verifica la configuración de Firebase.";
const ADMIN_FIRESTORE_UNINITIALIZED_ERROR = "El SDK de administrador de Firestore no está disponible. Asegúrate de que las credenciales de administrador estén configuradas correctamente en el servidor.";


function mapDocToProject(docSnap: DocumentData, id: string): Project {
  const data = docSnap.data();
  const technologies = Array.isArray(data?.technologies) ? data.technologies : [];
  
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

// --- OPERACIONES DE LECTURA (usando SDK de cliente para el lado público) ---

// READ (ALL)
export async function getProjectsFromFirestore(): Promise<Project[]> {
  if (!firestore) throw new Error(FIRESTORE_UNINITIALIZED_ERROR);

  try {
    const q = query(collection(firestore, 'projects'), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(docSnap => mapDocToProject(docSnap, docSnap.id));
    return projects;
  } catch (error) {
    console.error("[Servidor - Cliente SDK] Error al obtener proyectos:", error);
    throw new Error("No se pudieron obtener los proyectos. Verifica las reglas de seguridad de Firestore para permitir lecturas públicas.");
  }
}

// READ (ONE)
export async function getProjectByIdFromFirestore(projectId: string): Promise<Project | null> {
  if (!firestore) throw new Error(FIRESTORE_UNINITIALIZED_ERROR);
  if (!projectId) throw new Error('ID de proyecto inválido.');

  try {
    const docRef = doc(firestore, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? mapDocToProject(docSnap, docSnap.id) : null;
  } catch (error) {
    console.error(`[Servidor - Cliente SDK] Error al obtener proyecto por ID ${projectId}:`, error);
    throw new Error(`No se pudo obtener el proyecto. Verifica las reglas de seguridad de Firestore.`);
  }
}


// --- OPERACIONES DE ESCRITURA (usando SDK de Admin para seguridad) ---
// CREATE
export async function addProjectToFirestore(projectData: Omit<Project, 'id' | 'downloadUrl'>): Promise<{ id: string }> {
  if (!adminFirestore) throw new Error(ADMIN_FIRESTORE_UNINITIALIZED_ERROR);
  try {
    const collectionRef = adminFirestore.collection('projects');
    const docRef = await collectionRef.add({
      ...projectData,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id };
  } catch (error: any) {
    console.error("[Admin SDK] Error al añadir proyecto:", error);
    if (error.code === 7 || (error.errorInfo && error.errorInfo.code.includes('PERMISSION_DENIED'))) {
      throw new Error(
        "Permiso Denegado. La cuenta de servicio usada por el servidor no tiene el rol 'Editor de Cloud Datastore'. Por favor, añádelo en la consola de Google Cloud IAM."
      );
    }
    throw new Error(`No se pudo crear el proyecto: ${error.message}`);
  }
}

// UPDATE
export async function updateProjectInFirestore(projectId: string, projectData: Omit<Project, 'id' | 'downloadUrl'>): Promise<void> {
  if (!adminFirestore) throw new Error(ADMIN_FIRESTORE_UNINITIALIZED_ERROR);
  try {
    const docRef = adminFirestore.collection('projects').doc(projectId);
    await docRef.update({
      ...projectData,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error(`[Admin SDK] Error al actualizar el proyecto ${projectId}:`, error);
    if (error.code === 7 || (error.errorInfo && error.errorInfo.code.includes('PERMISSION_DENIED'))) {
      throw new Error(
        "Permiso Denegado. La cuenta de servicio no tiene permiso para actualizar documentos."
      );
    }
    throw new Error(`No se pudo actualizar el proyecto: ${error.message}`);
  }
}


// DELETE
export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  if (!adminFirestore) throw new Error(ADMIN_FIRESTORE_UNINITIALIZED_ERROR);
  try {
    const docRef = adminFirestore.collection('projects').doc(projectId);
    await docRef.delete();
  } catch (error: any) {
    console.error(`[Admin SDK] Error al eliminar el proyecto ${projectId}:`, error);
    if (error.code === 7 || (error.errorInfo && error.errorInfo.code.includes('PERMISSION_DENIED'))) {
      throw new Error(
        "Permiso Denegado. La cuenta de servicio no tiene permiso para eliminar documentos."
      );
    }
    throw new Error(`No se pudo eliminar el proyecto: ${error.message}`);
  }
}