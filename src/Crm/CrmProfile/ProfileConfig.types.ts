import type { RolUsuario } from "../features/users/users-rol";

export interface UpdateOneUserPayload {
  nombre?: string;
  correo?: string;
  telefono?: string | null;
  contrasena?: string;
  rol?: RolUsuario;
  activo?: boolean;
}

export type UserStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
export type UserRoleFilter = "ALL" | RolUsuario;
export type UserSortField = "nombre" | "correo" | "rol" | "activo" | "creadoEn";
export type UserSortDirection = "asc" | "desc";
