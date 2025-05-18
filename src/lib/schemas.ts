import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }).max(100, { message: "El título no puede exceder los 100 caracteres." }),
  shortDescription: z.string().min(10, { message: "La descripción corta debe tener al menos 10 caracteres." }).max(200, { message: "La descripción corta no puede exceder los 200 caracteres." }),
  longDescription: z.string().min(20, { message: "La descripción larga debe tener al menos 20 caracteres." }).max(2000, { message: "La descripción larga no puede exceder los 2000 caracteres." }),
  category: z.string().min(2, { message: "La categoría debe tener al menos 2 caracteres." }).max(50, { message: "La categoría no puede exceder los 50 caracteres." }),
  technologies: z.string()
    .min(1, { message: "Por favor, introduce al menos una tecnología." })
    .transform(val => val.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0))
    .refine(val => val.length > 0, { message: "Por favor, introduce al menos una tecnología válida." })
    .refine(val => val.every(tech => tech.length <= 50), { message: "Cada tecnología no puede exceder los 50 caracteres."}),
  projectUrl: z.string().url({ message: "Por favor, introduce una URL válida para el proyecto." }).optional().or(z.literal('')),
  sourceCodeUrl: z.string().url({ message: "Por favor, introduce una URL válida para el código fuente." }).optional().or(z.literal('')),
  thumbnailUrl: z.string().url({ message: "Por favor, introduce una URL válida para la miniatura." }).min(1, { message: "La URL de la miniatura es obligatoria." }),
  previewUrl: z.string().url({ message: "Por favor, introduce una URL válida para la vista previa." }).min(1, { message: "La URL de la vista previa es obligatoria." }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
