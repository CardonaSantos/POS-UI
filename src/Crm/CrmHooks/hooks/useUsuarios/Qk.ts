export const usersQkeys = {
  all: ["usuarios"] as const,
  my_user: (id: number) => ["user-profile", id] as const,
  specific: (id: number) => ["usuarios", id] as const,
};
