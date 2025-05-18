// src/services/projectService.ts
'use server'; // For potential future use if called from Server Actions, though primarily client-side for now

import { firestore } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import type { ProjectFormData } from '@/lib/schemas';
import type { Project } from '@/lib/data'; // Using existing Project type

// Firestore typically stores dates as Timestamps. If you add date fields, adjust accordingly.
// For now, our ProjectFormData and Project types don't have explicit date fields managed by this service.

/**
 * Adds a new project to Firestore.
 * @param projectData The data for the new project from the form.
 * @returns The ID of the newly created project document.
 */
export async function addProjectToFirestore(projectData: ProjectFormData): Promise<string> {
  try {
    const projectsCollectionRef = collection(firestore, 'projects');
    // You might want to add a createdAt/updatedAt timestamp
    const docRef = await addDoc(projectsCollectionRef, {
      ...projectData,
      // technologies field is already an array string[] from Zod transform
      createdAt: serverTimestamp(), // Automatically adds a server-side timestamp
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project to Firestore: ", error);
    throw new Error("Failed to add project."); // Re-throw for the caller to handle
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
      const data = docSnap.data();
      // Ensure all fields match the Project interface, handling potential undefined fields from Firestore
      return {
        id: docSnap.id,
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        longDescription: data.longDescription || '',
        category: data.category || '',
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        thumbnailUrl: data.thumbnailUrl || 'https://placehold.co/600x400.png',
        previewUrl: data.previewUrl || 'https://placehold.co/1200x800.png',
        projectUrl: data.projectUrl || undefined,
        sourceCodeUrl: data.sourceCodeUrl || undefined,
        downloadUrl: data.downloadUrl || undefined,
        // If you have a createdAt field as Firestore Timestamp, you might want to convert it
        // createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(), // Example conversion
      } as Project; // Cast to Project type
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects from Firestore: ", error);
    // Depending on how you want to handle errors, you might return [] or throw
    return []; 
  }
}

// TODO: Implement updateProject and deleteProject functions later
