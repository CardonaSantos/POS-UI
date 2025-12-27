
export const TicketSolucionesQkeys = {
    all: ["ticket-soluciones"]as const,
    specific:(id:number)=> ["ticket-soluciones", id] as const
}