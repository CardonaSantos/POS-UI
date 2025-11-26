import { z } from "zod";

const ipv4Regex =
  /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

const hostnameRegex = /^(?=.{3,253}$)([a-z0-9-]{1,63}\.)*[a-z0-9-]{1,63}$/; // lowercase

export const routerMkSchemaZ = z.object({
  nombre: z.string().trim().min(3, "Nombre mínimo de 3 caracteres"),
  host: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => ipv4Regex.test(value) || hostnameRegex.test(value), {
      message: "Host inválido: debe ser una IPv4 o un hostname válido.",
    }),

  sshPort: z.number().int().min(1).optional().default(22),

  usuario: z.string().trim().min(3, "Usuario mínimo de 3 caracteres"),

  descripcion: z.string().optional(),

  // passwordEnc: z.string().trim().min(8, "Mínimo de 8 caracteres"),
  passwordEnc: z
    .string()
    .optional()
    .transform((v) => v ?? "") // normalizamos a string
    .refine((v) => v === "" || v.length >= 8, {
      message: "Mínimo de 8 caracteres",
    }),

  empresaId: z.number().int().min(1),

  id: z.int().optional(),
});

export type RouterMkType = z.input<typeof routerMkSchemaZ>;
