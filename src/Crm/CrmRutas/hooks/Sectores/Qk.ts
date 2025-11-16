export const sectoresQkeys = {
  all: ["sectores"] as const, //cliente literal, tupla
};
// export const clienteKeys = {
//   all: ["cliente"] as const,
//   details: (clienteId: number) => ["cliente", "details", clienteId] as const,//--> cliente:namespsace base, details:subkey, diferenciar de otros queries, clienteId:identificador unico del recurso, as const, tupla readonly
//   plantillasContrato: ["cliente", "plantillas-contrato"] as const,
//   media: (clienteId: number) => ["cliente", "media", clienteId] as const,
// };
