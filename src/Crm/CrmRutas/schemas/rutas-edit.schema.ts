import { z } from "zod";

import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";

export const rutaEditSchema = z.object({
  nombreRuta: z
    .string()
    .trim()
    .min(1, "El nombre de la ruta es obligatorio")
    .max(160, "El nombre no puede superar los 160 caracteres"),

  cobradorId: z
    .string()
    .trim()
    .regex(/^\d+$/, "El cobrador seleccionado no es válido")
    .nullable(),

  estadoRuta: z.enum(EstadoRuta),

  observaciones: z
    .string()
    .trim()
    .max(2000, "Las observaciones no pueden superar los 2000 caracteres"),

  clientes: z
    .array(z.number().int().positive())
    .min(1, "La ruta debe conservar al menos un cliente"),
});

export type RutaEditFormValues = z.infer<typeof rutaEditSchema>;
