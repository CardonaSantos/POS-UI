// hooks/botHooks.ts (por ejemplo)
import type { QueryKey } from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createApiHooks } from "../hooks/createApiHooks";
import { botApi } from "../axiosClient";

//  factory
const BOT = createApiHooks(botApi);

// Tipos genéricos opcionales para no repetir tanto donde los uses
export function useBotQuery<TData>(
  key: QueryKey,
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: Omit<
    UseQueryOptions<TData, Error, TData, QueryKey>,
    "queryKey" | "queryFn"
  >
) {
  return BOT.useApiQuery<TData>(key, endpoint, config, options);
}

export function useBotMutation<TData, TVariables = unknown, TError = unknown>(
  method: "post" | "put" | "patch" | "delete",
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return BOT.useApiMutation<TData, TVariables, TError>(
    method,
    endpoint,
    config,
    options
  );
}
