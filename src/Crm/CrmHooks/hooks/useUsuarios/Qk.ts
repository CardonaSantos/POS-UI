export const usersQkeys = {
    all: ["usuarios"] as const,
    specific: (id:number)=> ["usuarios", id] as const
}