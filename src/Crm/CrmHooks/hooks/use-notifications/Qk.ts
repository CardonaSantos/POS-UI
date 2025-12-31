export const notificationsSystemQkeys = {
  all: ["notifications"] as const,
  specific: (id: number) => ["notifications", id] as const,
};
