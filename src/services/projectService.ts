
// src/services/projectService.ts
'use server'; 

import { firestore } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, serverTimestamp, Timestamp, getDoc, updateDoc, DocumentData } from 'firebase/firestore';
import type { ProjectFormData } from '@/lib/schemas';
import type { Project } from '@/lib/data'; 

// Helper function to convert Firestore document data to Project type
function mapDocToProject(docSnap: DocumentData, id: string): Project {
  const data = docSnap.data();
  return {
    id: id,
    title: data?.title || '',
    shortDescription: data?.shortDescription || '',
    longDescription: data?.longDescription || '',
    category: data?.category || '',
    technologies: Array.isArray(data?.technologies) ? data.technologies : [],
    thumbnailUrl: data?.thumbnailUrl || 'https://placehold.co/600x400.png',
    previewUrl: data?.previewUrl || 'https://placehold.co/1200x800.png',
    projectUrl: data?.projectUrl || undefined,
    sourceCodeUrl: data?.sourceCodeUrl || undefined,
    downloadUrl: data?.downloadUrl || undefined,
    // Optionally convert Timestamps if you add them to the Project type
    // createdAt: (data?.createdAt as Timestamp)?.toDate(),
    // updatedAt: (data?.updatedAt as Timestamp)?.toDate(),
  };
}

/**
 * Adds a new project to Firestore.
 * @param projectData The data for the new project from the form.
 * @returns The ID of the newly created project document.
 */
export async function addProjectToFirestore(projectData: ProjectFormData): Promise<string> {
  console.log('[Server Action] addProjectToFirestore called with:', JSON.stringify(projectData, null, 2));
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    // Ensure technologies is an array of strings, Zod transform should handle this, but good for safety.
    const technologiesArray = Array.isArray(projectData.technologies) 
      ? projectData.technologies 
      : (typeof projectData.technologies === 'string' ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    const docData = {
      ...projectData,
      technologies: technologiesArray,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    console.log('[Server Action] Document data to be added:', JSON.stringify(docData, null, 2));
    const docRef = await addDoc(projectsCollectionRef, docData);
    console.log('[Server Action] Project added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[Server Action Error] Error adding project to Firestore: ", error);
    if (error instanceof Error) {
      throw new Error(`Failed to add project: ${error.message}. Original error: ${error.name} - Stack: ${error.stack}`);
    }
    throw new Error(`Failed to add project. An unknown error occurred: ${String(error)}`);
  }
}

/**
 * Fetches all projects from Firestore.
 * @returns A promise that resolves to an array of projects.
 */
export async function getProjectsFromFirestore(): Promise<Project[]> {
  console.log('[Server Action] getProjectsFromFirestore called');
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    const querySnapshot = await getDocs(projectsCollectionRef);
    
    const projects: Project[] = querySnapshot.docs.map(docSnap => {
      return mapDocToProject(docSnap, docSnap.id);
    });
    console.log(`[Server Action] Fetched ${projects.length} projects.`);
    return projects;
  } catch (error) {
    console.error("[Server Action Error] Error fetching projects from Firestore: ", error);
     if (error instanceof Error) {
      throw new Error(`Failed to fetch projects: ${error.message}. Original error: ${error.name} - Stack: ${error.stack}`);
    }
    throw new Error(`Failed to fetch projects. An unknown error occurred: ${String(error)}`);
  }
}

/**
 * Fetches a single project by its ID from Firestore.
 * @param projectId The ID of the project to fetch.
 * @returns A promise that resolves to the project data or null if not found.
 */
export async function getProjectByIdFromFirestore(projectId: string): Promise<Project | null> {
  console.log(`[Server Action] getProjectByIdFromFirestore called for ID: ${projectId}`);
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    console.error('[Server Action Error] Invalid projectId received in getProjectByIdFromFirestore:', projectId);
    throw new Error('Invalid project ID provided.');
  }
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    const docSnap = await getDoc(projectDocRef);

    if (docSnap.exists()) {
      const project = mapDocToProject(docSnap, docSnap.id);
      console.log(`[Server Action] Found project with ID ${projectId}`);
      return project;
    } else {
      console.warn(`[Server Action] No such project document with ID: ${projectId}`);
      return null;
    }
  } catch (error) {
    console.error(`[Server Action Error] Error fetching project by ID ${projectId} from Firestore: `, error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch project with ID ${projectId}: ${error.message}. Original error: ${error.name} - Stack: ${error.stack}`);
    }
    throw new Error(`Failed to fetch project with ID ${projectId}. An unknown error occurred: ${String(error)}`);
  }
}

/**
 * Updates an existing project in Firestore.
 * @param projectId The ID of the project to update.
 * @param projectData The new data for the project.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateProjectInFirestore(projectId: string, projectData: ProjectFormData): Promise<void> {
  console.log(`[Server Action] updateProjectInFirestore called for ID: ${projectId} with data:`, JSON.stringify(projectData, null, 2));
   if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    console.error('[Server Action Error] Invalid projectId for update in updateProjectInFirestore:', projectId);
    throw new Error('Invalid project ID provided for update.');
  }
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    // Ensure technologies is an array of strings
    const technologiesArray = Array.isArray(projectData.technologies) 
      ? projectData.technologies 
      : (typeof projectData.technologies === 'string' ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    const docData = {
      ...projectData,
      technologies: technologiesArray,
      updatedAt: serverTimestamp(),
    };
    console.log('[Server Action] Document data to be updated:', JSON.stringify(docData, null, 2));
    await updateDoc(projectDocRef, docData);
    console.log(`[Server Action] Project with ID ${projectId} updated successfully.`);
  } catch (error) {
    console.error(`[Server Action Error] Error updating project ${projectId} in Firestore: `, error);
    if (error instanceof Error) {
      throw new Error(`Failed to update project with ID ${projectId}: ${error.message}. Original error: ${error.name} - Stack: ${error.stack}`);
    }
    throw new Error(`Failed to update project with ID ${projectId}. An unknown error occurred: ${String(error)}`);
  }
}

// TODO: Implement deleteProjectFromFirestore function later
