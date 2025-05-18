// src/components/admin/ProjectForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "@/lib/schemas";
import { projectSchema } from "@/lib/schemas";
import { addProjectToFirestore, updateProjectInFirestore, uploadFileFromDataUri } from "@/services/projectService";
import type { Project } from "@/lib/data";

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
import { Loader2, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface ProjectFormProps {
  initialData?: Project;
  onSubmitSuccess?: (projectId: string) => void;
}

type FileUploadState = {
  file: File | null;
  uploading: boolean;
  error: string | null;
  url: string | null; // Stores the Firebase Storage URL after successful upload
  preview: string | null; // For local image preview
};

export function ProjectForm({ initialData, onSubmitSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = !!initialData?.id;

  const [thumbnailState, setThumbnailState] = useState<FileUploadState>({ file: null, uploading: false, error: null, url: initialData?.thumbnailUrl || null, preview: initialData?.thumbnailUrl || null });
  const [previewState, setPreviewState] = useState<FileUploadState>({ file: null, uploading: false, error: null, url: initialData?.previewUrl || null, preview: initialData?.previewUrl || null });
  const [downloadFileState, setDownloadFileState] = useState<FileUploadState>({ file: null, uploading: false, error: null, url: initialData?.downloadUrl || null, preview: null });

  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  const previewFileRef = useRef<HTMLInputElement>(null);
  const downloadFileRef = useRef<HTMLInputElement>(null);

  const computedDefaultValues = {
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    longDescription: initialData?.longDescription || "",
    category: initialData?.category || "",
    technologies: initialData?.technologies
      ? (Array.isArray(initialData.technologies) ? initialData.technologies.join(', ') : String(initialData.technologies))
      : "",
    projectUrl: initialData?.projectUrl || "",
    sourceCodeUrl: initialData?.sourceCodeUrl || "",
    // URLs will be managed by file upload states, but schema expects strings
    thumbnailUrl: initialData?.thumbnailUrl || "", 
    previewUrl: initialData?.previewUrl || "",
    downloadUrl: initialData?.downloadUrl || "",
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: computedDefaultValues,
  });

  useEffect(() => {
    form.reset(computedDefaultValues);
    setThumbnailState(prev => ({ ...prev, url: initialData?.thumbnailUrl || null, preview: initialData?.thumbnailUrl || null, file: null, error: null, uploading: false }));
    setPreviewState(prev => ({ ...prev, url: initialData?.previewUrl || null, preview: initialData?.previewUrl || null, file: null, error: null, uploading: false }));
    setDownloadFileState(prev => ({ ...prev, url: initialData?.downloadUrl || null, file: null, error: null, uploading: false }));
  }, [initialData, form.reset]);


  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileUploadState>>,
    isImage: boolean
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setter({ file, uploading: false, error: null, url: null, preview: isImage ? URL.createObjectURL(file) : null });
      // Clear the corresponding URL field in the form when a new file is selected
      const fieldName = event.target.name as keyof ProjectFormData;
      form.setValue(fieldName, ""); // Clear the Zod schema field
    }
  };

  const handleFileUpload = async (
    state: FileUploadState,
    setter: React.Dispatch<React.SetStateAction<FileUploadState>>,
    pathPrefix: 'thumbnails' | 'previews' | 'downloads',
    formField: keyof ProjectFormData
  ) => {
    if (!state.file) {
      toast({ title: "No File Selected", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    setter(prev => ({ ...prev, uploading: true, error: null }));
    try {
      const reader = new FileReader();
      reader.readAsDataURL(state.file);
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        const uploadedUrl = await uploadFileFromDataUri(dataUri, pathPrefix, state.file!.name);
        setter(prev => ({ ...prev, uploading: false, url: uploadedUrl, file: null })); // Clear file after upload
        form.setValue(formField, uploadedUrl); // Set the URL in the form for Zod schema
        toast({ title: "File Uploaded", description: `${state.file!.name} uploaded successfully. URL set.` });
         if (formField === 'thumbnailUrl' || formField === 'previewUrl') {
            setter(prev => ({ ...prev, preview: uploadedUrl }));
        }
      };
      reader.onerror = (error) => {
        throw new Error("Failed to read file as Data URI.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "File upload failed.";
      setter(prev => ({ ...prev, uploading: false, error: errorMessage }));
      toast({ title: "Upload Error", description: errorMessage, variant: "destructive" });
    }
  };


  async function onSubmit(values: ProjectFormData) {
    setIsSubmittingForm(true);

    // Ensure file URLs from state are used if they exist (they should have been set by handleFileUpload)
    if (thumbnailState.url) values.thumbnailUrl = thumbnailState.url;
    if (previewState.url) values.previewUrl = previewState.url;
    if (downloadFileState.url) values.downloadUrl = downloadFileState.url;
    
    // Validate that required file URLs are present
    if (!values.thumbnailUrl) {
      toast({ title: "Missing Thumbnail", description: "Please upload a thumbnail image.", variant: "destructive" });
      setIsSubmittingForm(false);
      form.setError("thumbnailUrl", { type: "manual", message: "Thumbnail image is required." });
      return;
    }
     if (!values.previewUrl) {
      toast({ title: "Missing Preview Image", description: "Please upload a preview image.", variant: "destructive" });
      setIsSubmittingForm(false);
      form.setError("previewUrl", { type: "manual", message: "Preview image is required." });
      return;
    }

    try {
      let projectId = initialData?.id;
      if (isEditMode && projectId) {
        await updateProjectInFirestore(projectId, values);
        toast({
          title: "Proyecto Actualizado",
          description: `El proyecto "${values.title}" ha sido actualizado.`,
        });
      } else {
        projectId = await addProjectToFirestore(values);
        toast({
          title: "Proyecto Guardado",
          description: `El proyecto "${values.title}" ha sido guardado con ID: ${projectId}.`,
        });
        form.reset(computedDefaultValues); // Reset form fields
        // Reset file states
        setThumbnailState({ file: null, uploading: false, error: null, url: null, preview: null });
        setPreviewState({ file: null, uploading: false, error: null, url: null, preview: null });
        setDownloadFileState({ file: null, uploading: false, error: null, url: null, preview: null });
        if(thumbnailFileRef.current) thumbnailFileRef.current.value = "";
        if(previewFileRef.current) previewFileRef.current.value = "";
        if(downloadFileRef.current) downloadFileRef.current.value = "";

      }

      if (onSubmitSuccess && projectId) {
        onSubmitSuccess(projectId);
      } else {
        router.push('/admin/projects');
        router.refresh();
      }

    } catch (error) {
      toast({
        title: "Error al Guardar Proyecto",
        description: (error as Error).message || "No se pudo guardar el proyecto.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingForm(false);
    }
  }
  
  const renderFileUploadField = (
    label: string,
    fieldName: keyof ProjectFormData,
    state: FileUploadState,
    setter: React.Dispatch<React.SetStateAction<FileUploadState>>,
    pathPrefix: 'thumbnails' | 'previews' | 'downloads',
    accept: string,
    isImage: boolean,
    fileRef: React.RefObject<HTMLInputElement>,
    hint?: string
  ) => (
    <FormItem className="space-y-3">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-3">
        <FormControl>
          <Input
            type="file"
            accept={accept}
            className="flex-grow"
            onChange={(e) => handleFileChange(e, setter, isImage)}
            disabled={state.uploading || isSubmittingForm}
            name={fieldName} // Important for handleFileChange to identify field
            ref={fileRef}
          />
        </FormControl>
        <Button
          type="button"
          onClick={() => handleFileUpload(state, setter, pathPrefix, fieldName)}
          disabled={!state.file || state.uploading || isSubmittingForm}
          size="sm"
          variant="outline"
        >
          {state.uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline">Upload</span>
        </Button>
      </div>
      {state.uploading && <p className="text-xs text-muted-foreground">Subiendo {state.file?.name}...</p>}
      {state.error && <p className="text-xs text-destructive flex items-center"><AlertTriangle className="h-4 w-4 mr-1"/> {state.error}</p>}
      {state.url && !state.error && (
        <div className="text-xs text-green-600 flex items-center mt-1">
          <CheckCircle className="h-4 w-4 mr-1"/> Uploaded: <a href={state.url} target="_blank" rel="noopener noreferrer" className="truncate underline ml-1 max-w-[150px] sm:max-w-xs">{state.url.substring(state.url.lastIndexOf('/') + 1)}</a>
        </div>
      )}
       {isImage && state.preview && (
          <div className="mt-2 border rounded-md p-2">
            <Image src={state.preview} alt={`${label} preview`} width={100} height={isImage && label.toLowerCase().includes("thumbnail") ? (100 * 2/3) : (100 * 9/16)} className="object-contain rounded-md" />
            <p className="text-xs text-muted-foreground mt-1">Preview</p>
          </div>
        )}
      <FormDescription>{hint || `Sube un archivo ${isImage ? "de imagen" : ""}. La URL se guardará después de subirlo.`}</FormDescription>
      {/* Hidden input for Zod schema validation, value set by handleFileUpload */}
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => <Input type="hidden" {...field} />}
      />
      <FormMessage />
    </FormItem>
  );


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
                <Input placeholder="Ej: Mi Increíble Aplicación Web" {...field} disabled={isSubmittingForm} />
              </FormControl>
              <FormDescription>El nombre principal de tu proyecto.</FormDescription>
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
                <Textarea placeholder="Una breve descripción (1-2 frases)." className="resize-none" {...field} disabled={isSubmittingForm} />
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
                <Textarea placeholder="Describe tu proyecto en detalle." className="min-h-[150px] resize-y" {...field} disabled={isSubmittingForm} />
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
                  <Input placeholder="Ej: Web App, Mobile App" {...field} disabled={isSubmittingForm} />
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
                  <Input placeholder="Ej: React, Next.js, Firebase" {...field} disabled={isSubmittingForm} />
                </FormControl>
                <FormDescription>Separa las tecnologías con comas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {renderFileUploadField("Miniatura del Proyecto (Thumbnail)", "thumbnailUrl", thumbnailState, setThumbnailState, 'thumbnails', "image/*", true, thumbnailFileRef, "Imagen para la tarjeta del proyecto (600x400px recomendado).")}
        {renderFileUploadField("Imagen de Vista Previa (Preview)", "previewUrl", previewState, setPreviewState, 'previews', "image/*", true, previewFileRef, "Imagen para el modal del proyecto (1200x800px recomendado).")}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL del Proyecto (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://tuproyecto.com" {...field} disabled={isSubmittingForm}/>
                </FormControl>
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
                  <Input placeholder="https://github.com/tu/repo" {...field} disabled={isSubmittingForm} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {renderFileUploadField("Archivo Descargable del Proyecto (Opcional)", "downloadUrl", downloadFileState, setDownloadFileState, 'downloads', ".zip,.rar,.tar.gz,application/pdf", false, downloadFileRef, "Archivo del proyecto para descargar (ej. .zip).")}

        <Button type="submit" disabled={isSubmittingForm || thumbnailState.uploading || previewState.uploading || downloadFileState.uploading} className="w-full sm:w-auto">
          {isSubmittingForm ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Actualizando..." : "Guardando..."}</>
          ) : (
            isEditMode ? "Actualizar Proyecto" : "Guardar Proyecto"
          )}
        </Button>
      </form>
    </Form>
  );
}
