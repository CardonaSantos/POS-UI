import { User } from "../CrmTickets/ticketTypes";
import { RolUsuario } from "../features/users/users-rol";

export interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  contrasena: string;
  telefono: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsersProfile extends UserProfile {}

//PARA EL DIALOG Y ELIMINACIONES
export interface UserDialog extends User {}
