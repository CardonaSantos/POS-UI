import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import { RolUsuario } from "../features/users/users-rol";

const CRM_TOKEN_STORAGE_KEY = "tokenAuthCRM";

interface CrmJwtPayload {
  sub: number;
  id?: number;

  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
  empresaId: number;

  avatar?: string | null;
  portadaUrl?: string | null;

  iat?: number;
  exp?: number;
}

interface CrmSession {
  userIdCRM: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  empresaId: number;
  activo: boolean;
  avatar: string | null;
  portadaUrl: string | null;
}

interface CRM_PROPS {
  nombre: string | null;
  correo: string | null;
  rol: RolUsuario | null;
  empresaId: number | null;
  activo: boolean | null;

  avatar: string | null;
  portadaUrl: string | null;

  authTokenCRM: string | null;
  userIdCRM: number | null;

  isLoading: boolean;
  isAuthenticated: boolean;

  setNombre: (nombre: string) => void;
  setUserIdCrm: (userId: number) => void;
  setCorreo: (correo: string) => void;
  setRol: (rol: RolUsuario) => void;
  setEmpresaId: (empresaId: number) => void;
  setActivo: (activo: boolean) => void;
  setTokenCRM: (token: string) => void;

  setSession: (token: string) => boolean;
  checkAuthCRM: () => void;
  clearAuth: () => void;
  logout: () => void;
}

const CRM_ROLES = new Set<RolUsuario>(Object.values(RolUsuario));

function isRolUsuario(value: unknown): value is RolUsuario {
  return typeof value === "string" && CRM_ROLES.has(value as RolUsuario);
}

function decodeCrmSession(token: string): CrmSession | null {
  try {
    const payload = jwtDecode<CrmJwtPayload>(token);

    const userId = Number(payload.id ?? payload.sub);
    const empresaId = Number(payload.empresaId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0 ||
      !Number.isInteger(empresaId) ||
      empresaId <= 0 ||
      typeof payload.nombre !== "string" ||
      typeof payload.correo !== "string" ||
      !isRolUsuario(payload.rol) ||
      typeof payload.activo !== "boolean"
    ) {
      return null;
    }

    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      userIdCRM: userId,
      nombre: payload.nombre,
      correo: payload.correo,
      rol: payload.rol,
      empresaId,
      activo: payload.activo,
      avatar: payload.avatar ?? null,
      portadaUrl: payload.portadaUrl ?? null,
    };
  } catch {
    return null;
  }
}

const EMPTY_AUTH_STATE = {
  nombre: null,
  correo: null,
  rol: null,
  empresaId: null,
  activo: null,

  avatar: null,
  portadaUrl: null,

  authTokenCRM: null,
  userIdCRM: null,

  isAuthenticated: false,
};

export const useStoreCrm = create<CRM_PROPS>((set) => ({
  ...EMPTY_AUTH_STATE,

  isLoading: true,

  setNombre: (nombre) => set({ nombre }),

  setUserIdCrm: (userIdCRM) => set({ userIdCRM }),

  setCorreo: (correo) => set({ correo }),

  setRol: (rol) => set({ rol }),

  setEmpresaId: (empresaId) => set({ empresaId }),

  setActivo: (activo) => set({ activo }),

  setTokenCRM: (authTokenCRM) => set({ authTokenCRM }),

  setSession: (token) => {
    const session = decodeCrmSession(token);

    if (!session || !session.activo) {
      localStorage.removeItem(CRM_TOKEN_STORAGE_KEY);

      set({
        ...EMPTY_AUTH_STATE,
        isLoading: false,
      });

      return false;
    }

    localStorage.setItem(CRM_TOKEN_STORAGE_KEY, token);

    set({
      ...session,
      authTokenCRM: token,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  },

  checkAuthCRM: () => {
    const token = localStorage.getItem(CRM_TOKEN_STORAGE_KEY);

    if (!token) {
      set({
        ...EMPTY_AUTH_STATE,
        isLoading: false,
      });

      return;
    }

    const session = decodeCrmSession(token);

    if (!session || !session.activo) {
      localStorage.removeItem(CRM_TOKEN_STORAGE_KEY);

      set({
        ...EMPTY_AUTH_STATE,
        isLoading: false,
      });

      return;
    }

    set({
      ...session,
      authTokenCRM: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    localStorage.removeItem(CRM_TOKEN_STORAGE_KEY);

    set({
      ...EMPTY_AUTH_STATE,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem(CRM_TOKEN_STORAGE_KEY);

    set({
      ...EMPTY_AUTH_STATE,
      isLoading: false,
    });
  },
}));

// import { create } from "zustand";
// import { RolUsuario } from "../features/users/users-rol";

// interface CRM_PROPS {
//   nombre: string | null;
//   correo: string | null;
//   rol: RolUsuario | null;
//   empresaId: number | null;
//   activo: boolean | null;
//   authTokenCRM: string | null;
//   userIdCRM: number | null;

//   setNombre: (nombre: string) => void;
//   setUserIdCrm: (nombre: number) => void;

//   setCorreo: (nombre: string) => void;
//   setRol: (nombre: RolUsuario) => void;
//   setEmpresaId: (nombre: number) => void;
//   setActivo: (nombre: boolean) => void;
//   setTokenCRM: (token: string) => void;
//   clearAuth: () => void;
// }
// export const useStoreCrm = create<CRM_PROPS>((set) => ({
//   nombre: null,
//   activo: null,
//   correo: null,
//   rol: null,
//   empresaId: null,
//   authTokenCRM: null,
//   userIdCRM: null,

//   setNombre: (userNombre) => set({ nombre: userNombre }),
//   setActivo: (activo) => set({ activo: activo }),
//   setCorreo: (setCorreo) => set({ correo: setCorreo }),
//   setEmpresaId: (empresaId) => set({ empresaId: empresaId }),
//   setRol: (rol) => set({ rol: rol }),
//   setTokenCRM: (rol) => set({ authTokenCRM: rol }),
//   setUserIdCrm: (userID) => set({ userIdCRM: userID }),
//   //limpio el token
//   clearAuth: () => set({ authTokenCRM: null }),
// }));
