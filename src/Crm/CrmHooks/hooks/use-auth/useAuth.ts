import { RolUsuario } from "@/Crm/features/users/users-rol";
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

export function useLogin() {
  return useCrmMutation<LoginDto>("post", "auth/login-user");
}

export function useRegister() {
  return useCrmMutation<RegisterDto>("post", "auth/regist-user");
}
