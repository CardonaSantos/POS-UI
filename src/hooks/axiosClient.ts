// api/axiosClient.ts (o api/http.ts)
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// Pon esto una sola vez en tu cliente (arriba del archivo)
declare module "axios" {
  interface AxiosRequestConfig {
    metadata?: { start: number };
  }
  // Axios v1 usa InternalAxiosRequestConfig en .config de AxiosError
  interface InternalAxiosRequestConfig {
    metadata?: { start: number };
  }
}

function fullUrlFrom(cfg?: AxiosRequestConfig) {
  try {
    return new URL(cfg?.url ?? "", cfg?.baseURL ?? "").toString();
  } catch {
    return `${cfg?.baseURL ?? ""}${cfg?.url ?? ""}`;
  }
}

function attachLogging(client: AxiosInstance, name: string) {
  client.interceptors.request.use((cfg) => {
    (cfg as any).metadata = { start: performance.now() };
    const url = (() => {
      try {
        return new URL(cfg.url ?? "", cfg.baseURL ?? "").toString();
      } catch {
        return `${cfg.baseURL ?? ""}${cfg.url ?? ""}`;
      }
    })();
    console.groupCollapsed(
      `➡️ [${name}] ${String(cfg.method).toUpperCase()} ${url}`
    );
    console.log("params:", cfg.params);
    if (cfg.data) console.log("data:", cfg.data);
    console.log("headers:", cfg.headers);
    console.groupEnd();
    return cfg;
  });

  client.interceptors.response.use(
    (res: AxiosResponse) => {
      const ms = Math.round(
        performance.now() - (res.config as any).metadata?.start!
      );
      const url = (() => {
        try {
          return new URL(
            res.config.url ?? "",
            res.config.baseURL ?? ""
          ).toString();
        } catch {
          return `${res.config.baseURL ?? ""}${res.config.url ?? ""}`;
        }
      })();
      console.groupCollapsed(
        `✅ [${name}] ${res.status} ${res.statusText} — ${String(
          res.config.method
        ).toUpperCase()} ${url} (${ms} ms)`
      );
      console.log("data:", res.data);
      console.log("headers:", res.headers);
      console.groupEnd();
      return res;
    },
    (error: unknown) => {
      if (!axios.isAxiosError(error)) {
        // Error que no viene de Axios
        console.groupCollapsed(`⛔ [${name}] Error no-Axios`);
        console.error(error);
        console.groupEnd();
        return Promise.reject(error);
      }

      const ax = error; // AxiosError
      const cfg = ax.config as AxiosRequestConfig | undefined;
      const url = fullUrlFrom(cfg);
      const method = String(cfg?.method ?? "GET").toUpperCase();

      const start = (cfg as any)?.metadata?.start as number | undefined;
      const ms =
        typeof start === "number"
          ? Math.round(performance.now() - start)
          : undefined;

      console.groupCollapsed(
        `⛔ [${name}] Axios error — ${method} ${url}` +
          (ms != null ? ` (${ms} ms)` : "")
      );
      console.error("message:", ax.message);
      console.error("code:", ax.code);
      console.error("status:", ax.response?.status ?? "(sin status)");
      console.error("response data:", ax.response?.data);
      console.groupEnd();

      return Promise.reject(error);
    }
  );
}

// 🔹 API CRM
export const crmApi = axios.create({
  baseURL: import.meta.env.VITE_CRM_API_URL,
  withCredentials: false, // ← déjalo false si NO usas cookies/sesión
  timeout: 10000,
  headers: { Accept: "application/json" },
});
attachLogging(crmApi, "CRM");

// 🔹 API POS
export const posApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  timeout: 10000,
  headers: { Accept: "application/json" },
});
attachLogging(posApi, "POS");

// (Opcional) compatibilidad hacia atrás: tu código viejo puede seguir importando axiosClient
export const axiosClient = crmApi;
