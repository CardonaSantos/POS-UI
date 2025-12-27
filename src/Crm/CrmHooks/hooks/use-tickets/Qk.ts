
export const  ticketsSoporteQkeys = {
    all: ["tickets-soporte"],
    specific: (id:number)=> ["tickets-soporte", id] as const
}