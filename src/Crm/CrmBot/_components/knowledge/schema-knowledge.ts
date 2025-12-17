import z from "zod";
import { KnowledgeDocumentType } from "@/Crm/features/bot-server/knowledge/knowledge";

export const knowledgeCreateSchemaZ = z.object({
  id: z
    .number({
      error: "ID no válido",
    })
    .int()
    .min(1, "ID inválido")
    .default(1)
    .optional(),

  empresaId: z
    .number({
      error: "La empresa es requerida",
    })
    .int()
    .min(1, "Empresa inválida"),

  tipo: z.nativeEnum(KnowledgeDocumentType, {
    error: "El tipo de conocimiento es requerido",
  }),

  titulo: z
    .string({
      error: "El título es requerido",
    })
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres"),

  descripcion: z.string().trim().optional(),

  origen: z.string().trim().optional(),

  idioma: z.string().trim().optional(),

  textoLargo: z
    .string({
      error: "El contenido es requerido",
    })
    .trim()
    .min(10, "El contenido debe tener al menos 10 caracteres"),
});

export type KnowledgeCreateType = z.input<typeof knowledgeCreateSchemaZ>;
