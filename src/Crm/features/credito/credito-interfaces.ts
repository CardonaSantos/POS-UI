export enum InteresTipo {
  FIJO = "FIJO",
  VARIABLE = "VARIABLE",
}

export enum FrecuenciaPago {
  MENSUAL = "MENSUAL",
  QUINCENAL = "QUINCENAL",
  SEMANAL = "SEMANAL",
  CUSTOM = "CUSTOM",
}

export enum OrigenCredito {
  TIENDA = "TIENDA",
  CAMPO = "CAMPO",
  ONLINE = "ONLINE",
  REFERIDO = "REFERIDO",
  USUARIO = "USUARIO",
}

export const OrigenCreditoArray = [
  "TIENDA",
  "CAMPO",
  "ONLINE",
  "REFERIDO",
  "USUARIO",
] as const;
