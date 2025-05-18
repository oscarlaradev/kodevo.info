
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
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    const docRef = await addDoc(projectsCollectionRef, {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project to Firestore: ", error);
    throw new Error(`Failed to add project: ${(error as Error).message}`);
  }
}

/**
 * Fetches all projects from Firestore.
 * @returns A promise that resolves to an array of projects.
 */
export async function getProjectsFromFirestore(): Promise<Project[]> {
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    const querySnapshot = await getDocs(projectsCollectionRef);
    
    const projects: Project[] = querySnapshot.docs.map(docSnap => {
      return mapDocToProject(docSnap, docSnap.id);
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects from Firestore: ", error);
    // For get operations that might return empty, it's often better to return empty or handle specific error types
    // For now, re-throwing with details to help debug.
    throw new Error(`Failed to fetch projects: ${(error as Error).message}`);
  }
}

/**
 * Fetches a single project by its ID from Firestore.
 * @param projectId The ID of the project to fetch.
 * @returns A promise that resolves to the project data or null if not found.
 */
export async function getProjectByIdFromFirestore(projectId: string): Promise<Project | null> {
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    const docSnap = await getDoc(projectDocRef);

    if (docSnap.exists()) {
      return mapDocToProject(docSnap, docSnap.id);
    } else {
      console.log("No such project document with ID:", projectId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching project by ID from Firestore: ", error);
    throw new Error(`Failed to fetch project with ID ${projectId}: ${(error as Error).message}`);
  }
}

/**
 * Updates an existing project in Firestore.
 * @param projectId The ID of the project to update.
 * @param projectData The new data for the project.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateProjectInFirestore(projectId: string, projectData: ProjectFormData): Promise<void> {
  try {
    const projectDocRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectDocRef, {
      ...projectData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating project in Firestore: ", error);
    throw new Error(`Failed to update project with ID ${projectId}: ${(error as Error).message}`);
  }
}

// TODO: Implement deleteProjectFromFirestore function later
