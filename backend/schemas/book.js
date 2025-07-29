import { z } from "zod";

export const validateBookToCreate = z.object({
    title: z.string().min(1, "El título es requerido"),
    author: z.string().min(1, "El autor es requerido"),
    year: z.number().int().min(0, "El año debe ser un número válido"),
    publisher: z.string().min(1, "La editorial es requerida"),
    genreIds: z.array(z.number().int()).nonempty("Debe tener al menos un género"),
    cover: z.string().url("La portada debe ser una URL válida").optional(),
    description: z.string().min(1, "La descripción es requerida")
});

export const validateBookFromDB = z.object({
    id: z.number().int(),
    title: z.string(),
    author: z.string(),
    year: z.number().int(),
    publisher: z.string(),
    cover: z.string().url(),
    description: z.string(),
    genres: z.array(z.string()).optional()
});

export const validateBookPatch = z.object({
    title: z.string().min(1).optional(),
    author: z.string().min(1).optional(),
    year: z.number().int().min(0).optional(),
    publisher: z.string().min(1).optional(),
    genreIds: z.array(z.number().int()).optional(),
    cover: z.string().url().optional(),
    description: z.string().optional() 
});
