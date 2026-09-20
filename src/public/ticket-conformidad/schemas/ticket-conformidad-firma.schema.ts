import { z } from "zod";

export const ticketConformidadFirmaSchema = z.object({
  nombreFirmante: z
    .string()
    .trim()
    .min(2, "Ingrese el nombre completo")
    .max(160, "El nombre es demasiado largo"),

  telefonoFirmante: z
    .string()
    .trim()
    .min(6, "Ingrese un teléfono válido")
    .max(30, "El teléfono es demasiado largo")
    .regex(/^[0-9+\s()\-]+$/, "El teléfono contiene caracteres no válidos"),

  firmaCapturada: z.boolean().refine((value) => value, {
    message: "La firma es obligatoria",
  }),
});

export type TicketConformidadFirmaFormValues = z.infer<
  typeof ticketConformidadFirmaSchema
>;

export const TICKET_CONFORMIDAD_FIRMA_DEFAULTS: TicketConformidadFirmaFormValues =
  {
    nombreFirmante: "",
    telefonoFirmante: "",
    firmaCapturada: false,
  };
