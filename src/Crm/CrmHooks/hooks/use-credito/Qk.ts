export const creditoQkeys = {
  all: ["creditos"] as const,
  specific: (id: number) => ["creditos", id] as const,
};

export const expedienteQkeys = {
  all: ["expediente"] as const,
  specific: (id: number) => ["expediente", id] as const,
};
