import { z } from "zod";

export const validateUserToCreate = z.object({
    username: z.string().min(3, "Username muy corto").max(50),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Password muy corto"),
    role: z.enum(["admin", "user"]).default("user"),
});

export const validateUserToUpdate = z.object({
    username: z.string().min(3).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["admin", "user"]).optional(),
});
