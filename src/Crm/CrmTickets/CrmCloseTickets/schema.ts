import z from "zod";

export const ticketResumenSchema = z.object({
  ticketId: z.number({ error: "ID requerido" }).int().positive(),
  
  solucionId: z.number().int().positive().optional().nullable(),
  
  resueltoComo: z.string().max(500).optional().nullable(),
  
  notasInternas: z.string().max(1000).optional().nullable(),
});

export type TicketResumenSchemaType = z.infer<typeof ticketResumenSchema>;
