export const UsuariosQkeys = {
  all: ["usuarios"] as const,
  specific: (userId: number) => ["usuarios", userId] as const,
};
