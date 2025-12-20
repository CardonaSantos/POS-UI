import { RolUsuario } from "@/Crm/CrmProfile/interfacesProfile";
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";

export interface LoginDto {
  correo: string;
  contrasena: string;
}

export interface RegisterDto {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: RolUsuario;
  empresaId: number;
}

export function useLogin(dto: LoginDto) {
  return useCrmMutation("post", `auth/login-user`, {
    params: dto,
  });
}

export function useRegister(dto: RegisterDto) {
  return useCrmMutation("post", `auth/regist-user`, {
    params: dto,
  });
}
