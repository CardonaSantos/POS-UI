import { RolUsuario } from "../users/users-rol";

export interface UsuarioRaw {
  id: number;
  empresaId: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: RolUsuario;
  activo: boolean;
  contrasena?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RealTimeLocationRaw {
  usuarioId: number;
  latitud: number;
  longitud: number;
  precision: number;
  velocidad: number;
  bateria: number;
  actualizadoEn: string;
  usuario: UsuarioRaw;
}
