import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { usersQkeys } from "./Qk";

interface UsuarioToTicket {
  id: number;
  nombre: string;
}

export interface UserMediaInfo {
  url: string;
}

export interface UserExtendedProfileData {
  bio: string;
  telefono: string;
  notificarWhatsApp: boolean;
  notificarPush: boolean;
  notificarSonido: boolean;
  avatar: UserMediaInfo | null;
  portada: UserMediaInfo | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface UserExtendedProfile {
  id: number;
  empresaId: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string; // Si tienes tu enum RolUsuario, úsalo aquí
  activo: boolean;
  contrasena?: string; // Es buena práctica dejarlo opcional en el front
  creadoEn: string;
  actualizadoEn: string;
  perfil: UserExtendedProfileData | null;
}

export function useGetUsersToSelect() {
  return useCrmQuery<Array<UsuarioToTicket>>(
    usersQkeys.all,
    `user/get-users-to-create-tickets`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

export function useGetMyUserProfile(userId: number | undefined | null) {
  return useCrmQuery<UserExtendedProfile>(
    ["user-profile", userId],
    `user/user-profile-info/${userId}`,
    undefined,
    {
      enabled: !!userId,
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}
