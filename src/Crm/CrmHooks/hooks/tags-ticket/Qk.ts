export const tagsTicketsQkeys = {
    all: ["tags-tickets"] as const,
    specific: (id:number)=> ["tags-tickets", id] as const
}