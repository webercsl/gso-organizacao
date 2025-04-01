import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Obrigatório"),
});

export const registerSchema = z.object({
    name: z.string().trim().min(3, "Obrigatório"),
    email: z.string().email(),
    password: z.string().min(8, "Mínimo de 8 caracteres"),
})