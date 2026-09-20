import type { AppSelectOption } from "@/components/app/primitives/app-single-select";

export enum RolUsuario {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",

  COORDINADOR_OPERACIONES = "COORDINADOR_OPERACIONES",

  OFICINA = "OFICINA",
  TIENDA = "TIENDA",

  TECNICO = "TECNICO",
  COBRADOR = "COBRADOR",
}

export const ROL_USUARIO_OPTIONS: AppSelectOption<RolUsuario>[] = [
  {
    value: RolUsuario.TIENDA,
    label: "Tienda",
  },
  {
    value: RolUsuario.OFICINA,
    label: "Oficina",
  },
  {
    value: RolUsuario.TECNICO,
    label: "Técnico",
  },
  {
    value: RolUsuario.COBRADOR,
    label: "Cobrador",
  },
  {
    value: RolUsuario.COORDINADOR_OPERACIONES,
    label: "Coordinador de operaciones",
  },
  {
    value: RolUsuario.ADMIN,
    label: "Administrador",
  },
  {
    value: RolUsuario.SUPER_ADMIN,
    label: "Super administrador",
  },
];
