import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Obrigatório"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ])
    .optional(),
    workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "Mínimo de 1 caractere requerido").optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ])
    .optional(),
});