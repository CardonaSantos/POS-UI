export enum RolUsuario {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  COORDINADOR_OPERACIONES = "COORDINADOR_OPERACIONES",
  OFICINA = "OFICINA",
  TIENDA = "TIENDA",
  TECNICO = "TECNICO",
  COBRADOR = "COBRADOR",
}

export const ROL_USUARIO_LABELS: Record<RolUsuario, string> = {
  [RolUsuario.SUPER_ADMIN]: "Super administrador",
  [RolUsuario.ADMIN]: "Administrador",
  [RolUsuario.COORDINADOR_OPERACIONES]: "Coordinador de operaciones",
  [RolUsuario.OFICINA]: "Oficina",
  [RolUsuario.TIENDA]: "Tienda",
  [RolUsuario.TECNICO]: "Técnico",
  [RolUsuario.COBRADOR]: "Cobrador",
};

export const ROL_USUARIO_OPTIONS = Object.values(RolUsuario).map((value) => ({
  value,
  label: ROL_USUARIO_LABELS[value],
}));

export function getRolUsuarioLabel(rol: RolUsuario | string): string {
  return ROL_USUARIO_LABELS[rol as RolUsuario] ?? rol.replace("_", " ");
}
