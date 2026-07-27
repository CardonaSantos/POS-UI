import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";

function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}

export const INSTALACION_ESTADO_OPTIONS = Object.values(
  EstadoInstalacionCliente,
).map((value) => ({
  value,
  label: humanizeEnum(value),
}));

export const INSTALACION_TIPO_OPTIONS = Object.values(
  TipoInstalacionCliente,
).map((value) => ({
  value,
  label: humanizeEnum(value),
}));
