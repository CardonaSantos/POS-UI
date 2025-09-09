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
    useApiQuery<TData>(
      key: QueryKey,
      endpoint: string,
      config?: AxiosRequestConfig,
      options?: Omit<
        UseQueryOptions<TData, Error, TData, QueryKey>,
        "queryKey" | "queryFn"
      >
    ) {
      return useQuery<TData, Error, TData, QueryKey>({
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
