import z from "zod";

export const botStatusEnum = z.enum(["ACTIVE", "DISABLED"]);

export const botSchemaZ = z.object({
  id: z.number().int().optional(),
  empresaId: z.number().int().min(1, "empresaId inválido"),

  nombre: z.string().trim().min(3, "Nombre mínimo de 3 caracteres"),
  slug: z.string().trim().min(3, "Slug mínimo de 3 caracteres"),

  descripcion: z.string().nullable().optional(),

  provider: z.string().trim().default("fireworks"),

  model: z.string().trim().default("accounts/fireworks/models/gpt-oss-120b"),

  systemPrompt: z.string().trim().min(5, "El system prompt es obligatorio"),

  contextPrompt: z.string().trim().nullable().optional(),
  historyPrompt: z.string().trim().nullable().optional(),
  outputStyle: z.string().trim().nullable().optional(),

  maxCompletionTokens: z.number().int().min(1).default(500),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(0.9),
  frequencyPenalty: z.number().min(-2).max(2).default(0.2),
  presencePenalty: z.number().min(-2).max(2).default(0.0),

  maxHistoryMessages: z.number().int().min(1).default(15),

  status: botStatusEnum.default("ACTIVE"),

  creadoEn: z.string().optional(), // viene del backend
  actualizadoEn: z.string().optional(),
});

export type BotType = z.input<typeof botSchemaZ>;
