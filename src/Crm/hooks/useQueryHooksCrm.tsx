// hooks/createApiHooks.ts
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

export function createApiHooks(client: AxiosInstance) {
  return {
    // 🔹 Query: TData (respuesta), TError opcional (por defecto Error)
    useApiQuery<TData, TError = Error>(
      key: QueryKey,
      endpoint: string,
      config?: AxiosRequestConfig,
      options?: Omit<
        UseQueryOptions<TData, TError, TData, QueryKey>,
        "queryKey" | "queryFn"
      >
    ) {
      return useQuery<TData, TError, TData, QueryKey>({
        queryKey: key,
        queryFn: async () => {
          const { data } = await client.get<TData>(
            endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
            config
          );
          return data;
        },
        ...options,
      });
    },

    // 🔹 Mutation: TData (respuesta), TVariables (body), TError
    useApiMutation<TData, TVariables = unknown, TError = unknown>(
      method: "post" | "put" | "patch" | "delete",
      endpoint: string,
      config?: AxiosRequestConfig,
      options?: UseMutationOptions<TData, TError, TVariables>
    ) {
      return useMutation<TData, TError, TVariables>({
        mutationFn: async (variables: TVariables) => {
          const { data } = await client.request<TData>({
            url: endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
            method,
            // opcional: si algún día quieres DELETE con body,
            // aquí lo puedes ajustar. Por ahora igual que tenías:
            data: ["post", "put", "patch"].includes(method)
              ? variables
              : undefined,
            ...config,
          });
          return data;
        },
        ...options,
      });
    },
  };
}
