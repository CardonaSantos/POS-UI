export const municipiosQKey = {
  all: ["municipios"] as const, //cliente literal, tupla
  specificMunicipios: (depaSelectedId: number) => [
    "municipios",
    depaSelectedId,
  ],
};
