// hooks/crmApiHooks.ts
import { crmApi } from "./axiosClientCrm";
import { createApiHooks } from "./useQueryHooksCrm";

export const { useApiQuery: useCrmQuery, useApiMutation: useCrmMutation } =
  createApiHooks(crmApi);
