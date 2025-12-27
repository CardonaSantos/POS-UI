import { z } from 'zod';

// 1. Definimos el Schema (Reglas de validación)
export const createSolucionTicketSchema = z.object({
  solucion: z
    .string({ error: "La solución es obligatoria" })
    .min(3, { message: "La solución debe tener al menos 3 caracteres" })
    .max(100, { message: "El título de la solución es muy largo" }),
    
  descripcion: z
    .string({ error: "La descripción es obligatoria" })
    .min(10, { message: "La descripción debe ser más detallada (mínimo 10 letras)" }),
    
  isEliminado: z.boolean().optional(), 
});

export type CreateSolucionTicketDto = z.infer<typeof createSolucionTicketSchema>;
export type UpdateSolucionTicketDto = Partial<CreateSolucionTicketDto> & { id: number };
