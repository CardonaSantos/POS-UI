import { RolUsuario } from "../users/users-rol";

interface Usuario {
  nombre: string;
  rol: RolUsuario;
  telefono: string;
  avatarUrl?: string;
}

export interface RealTimeLocationRaw {
  usuarioId: number;
  latitud: number;
  longitud: number;
  precision: number;
  bateria?: number;
  velocidad?: number;
  actualizadoEn: Date;
  usuario: Usuario;
  ticketsEnProceso: {
    id: number;
    titulo: string;
  }[];
}
