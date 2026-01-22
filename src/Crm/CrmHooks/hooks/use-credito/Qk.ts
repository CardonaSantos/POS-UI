export const creditoQkeys = {
  all: ["creditos"] as const,
  specific: (id: number) => ["creditos", id] as const,
};
