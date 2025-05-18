// src/services/projectService.ts
'use server';

import { firestore, storage } from '@/lib/firebase';
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
import {
  ref as storageRef,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import type { ProjectFormData } from '@/lib/schemas';
import type { Project } from '@/lib/data';
import { FirebaseError } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// Helper function to convert Firestore document data to Project type
function mapDocToProject(docSnap: DocumentData, id: string): Project {
  const data = docSnap.data();
  // Ensure technologies is always an array, even if it's undefined or null in Firestore
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
    // Optionally convert Timestamps if you add them to the Project type
    // createdAt: (data?.createdAt as Timestamp)?.toDate(),
    // updatedAt: (data?.updatedAt as Timestamp)?.toDate(),
  };
}

/**
 * Uploads a file (from a Data URI) to Firebase Storage and returns its public URL.
 * @param dataUri The file content as a Data URI.
 * @param pathPrefix The prefix for the storage path (e.g., 'thumbnails', 'project_files').
 * @param originalFileName The original name of the file, used to extract the extension.
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileFromDataUri(
  dataUri: string,
  pathPrefix: 'thumbnails' | 'previews' | 'downloads',
  originalFileName: string
): Promise<string> {
  console.log(`[Server Action] uploadFileFromDataUri called for prefix: ${pathPrefix}, filename: ${originalFileName}`);
  try {
    const mimeTypeMatch = dataUri.match(/^data:(.+);base64,/);
    if (!mimeTypeMatch || !mimeTypeMatch[1]) {
      throw new Error('Invalid Data URI: MIME type not found.');
    }
    const mimeType = mimeTypeMatch[1];
    const base64Data = dataUri.split(',')[1];

    if (!base64Data) {
      throw new Error('Invalid Data URI: Base64 data not found.');
    }
    
    const fileExtension = originalFileName.split('.').pop() || 'file';
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${pathPrefix}/${uniqueFileName}`;
    
    const fileStorageRef = storageRef(storage, filePath);

    console.log(`[Server Action] Uploading to Storage path: ${filePath} with MIME type: ${mimeType}`);
    const snapshot = await uploadString(fileStorageRef, base64Data, 'base64', {
      contentType: mimeType,
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('[Server Action] File uploaded successfully. Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    let errorMessage = `Failed to upload file ${originalFileName}. An unknown error occurred.`;
     if (error instanceof FirebaseError) {
      errorMessage = `Firebase error uploading file: ${error.message} (Code: ${error.code})`;
      console.error("[Server Action FirebaseError] Error uploading file to Storage: ", error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to upload file: ${error.message}.`;
      console.error("[Server Action Error] Error uploading file to Storage: ", error.name, error.message, error.stack);
    } else {
      console.error("[Server Action Unknown Error] Error uploading file to Storage: ", error);
    }
    throw new Error(errorMessage);
  }
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
    let errorMessage = "Failed to add project. An unknown error occurred.";
    if (error instanceof FirebaseError) {
      errorMessage = `Firebase error adding project: ${error.message} (Code: ${error.code})`;
      console.error("[Server Action FirebaseError] Error adding project to Firestore: ", error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to add project: ${error.message}.`;
      console.error("[Server Action Error] Error adding project to Firestore: ", error.name, error.message, error.stack);
    } else {
      console.error("[Server Action Unknown Error] Error adding project to Firestore: ", error);
    }
    throw new Error(errorMessage);
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
    let errorMessage = "Failed to fetch projects. An unknown error occurred.";
    if (error instanceof FirebaseError) {
      errorMessage = `Firebase error fetching projects: ${error.message} (Code: ${error.code})`;
      console.error("[Server Action FirebaseError] Error fetching projects from Firestore: ", error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to fetch projects: ${error.message}.`;
      console.error("[Server Action Error] Error fetching projects from Firestore: ", error.name, error.message, error.stack);
    } else {
      console.error("[Server Action Unknown Error] Error fetching projects from Firestore: ", error);
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
  console.log(`[Server Action] getProjectByIdFromFirestore called for ID: ${projectId}`);
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'Invalid project ID provided to getProjectByIdFromFirestore.';
    console.error('[Server Action Error]', invalidIdErrorMsg, 'Received:', projectId);
    throw new Error(invalidIdErrorMsg);
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
    let errorMessage = `Failed to fetch project with ID ${projectId}. An unknown error occurred.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Firebase error fetching project ID ${projectId}: ${error.message} (Code: ${error.code})`;
      console.error(`[Server Action FirebaseError] Error fetching project by ID ${projectId} from Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to fetch project with ID ${projectId}: ${error.message}.`;
      console.error(`[Server Action Error] Error fetching project by ID ${projectId} from Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Server Action Unknown Error] Error fetching project by ID ${projectId} from Firestore: `, error);
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
  console.log(`[Server Action] updateProjectInFirestore called for ID: ${projectId} with data:`, JSON.stringify(projectData, null, 2));
   if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'Invalid project ID provided for update in updateProjectInFirestore.';
    console.error('[Server Action Error]', invalidIdErrorMsg, 'Received:', projectId);
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
    console.log('[Server Action] Document data to be updated:', JSON.stringify(docData, null, 2));
    await updateDoc(projectDocRef, docData);
    console.log(`[Server Action] Project with ID ${projectId} updated successfully.`);
  } catch (error)
 {
    let errorMessage = `Failed to update project with ID ${projectId}. An unknown error occurred.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Firebase error updating project ID ${projectId}: ${error.message} (Code: ${error.code})`;
      console.error(`[Server Action FirebaseError] Error updating project ${projectId} in Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to update project with ID ${projectId}: ${error.message}.`;
      console.error(`[Server Action Error] Error updating project ${projectId} in Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Server Action Unknown Error] Error updating project ${projectId} in Firestore: `, error);
    }
    throw new Error(errorMessage);
  }
}

/**
 * Deletes a project from Firestore. Also attempts to delete associated files from Storage if their URLs are stored.
 * @param projectId The ID of the project to delete.
 * @param project An optional project object containing file URLs to delete from Storage.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteProjectFromFirestore(projectId: string, project?: Project): Promise<void> {
  console.log(`[Server Action] deleteProjectFromFirestore called for ID: ${projectId}`);
  if (!projectId || typeof projectId !== 'string' || projectId.trim() === '') {
    const invalidIdErrorMsg = 'Invalid project ID provided for deletion.';
    console.error('[Server Action Error]', invalidIdErrorMsg, 'Received:', projectId);
    throw new Error(invalidIdErrorMsg);
  }
  try {
    // Attempt to delete associated files from Firebase Storage
    if (project) {
      const fileUrlsToDelete: (string | undefined)[] = [
        project.thumbnailUrl,
        project.previewUrl,
        project.downloadUrl,
      ];
      for (const url of fileUrlsToDelete) {
        if (url && url.includes('firebasestorage.googleapis.com')) {
          try {
            // Extract the path from the URL. Example:
            // https://firebasestorage.googleapis.com/v0/b/your-bucket.appspot.com/o/thumbnails%2Fimage.png?alt=media&token=...
            // The path is "thumbnails/image.png" (after unescaping)
            const pathWithBucket = url.split('/o/')[1].split('?')[0];
            const decodedPath = decodeURIComponent(pathWithBucket);
            const fileRef = storageRef(storage, decodedPath);
            await deleteObject(fileRef);
            console.log(`[Server Action] Successfully deleted file from Storage: ${decodedPath}`);
          } catch (storageError) {
            if (storageError instanceof FirebaseError && storageError.code === 'storage/object-not-found') {
              console.warn(`[Server Action] File not found in Storage (may have been already deleted or URL was incorrect): ${url}`, storageError.message);
            } else {
              console.error(`[Server Action] Error deleting file from Storage: ${url}`, storageError);
              // Decide if you want to throw here or just log and continue with Firestore deletion
            }
          }
        }
      }
    }

    const projectDocRef = doc(firestore, 'projects', projectId);
    await deleteDoc(projectDocRef);
    console.log(`[Server Action] Project with ID ${projectId} deleted successfully from Firestore.`);
  } catch (error) {
    let errorMessage = `Failed to delete project with ID ${projectId}. An unknown error occurred.`;
    if (error instanceof FirebaseError) {
      errorMessage = `Firebase error deleting project ID ${projectId}: ${error.message} (Code: ${error.code})`;
      console.error(`[Server Action FirebaseError] Error deleting project ${projectId} from Firestore: `, error.code, error.message, error.customData);
    } else if (error instanceof Error) {
      errorMessage = `Failed to delete project with ID ${projectId}: ${error.message}.`;
      console.error(`[Server Action Error] Error deleting project ${projectId} from Firestore: `, error.name, error.message, error.stack);
    } else {
      console.error(`[Server Action Unknown Error] Error deleting project ${projectId} from Firestore: `, error);
    }
    throw new Error(errorMessage);
  }
}
