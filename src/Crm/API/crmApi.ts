import { createApiClient } from "./createApiClient";
import { createApiHooks } from "./useQueryHooksCrm";
const baseUrl = import.meta.env.VITE_CRM_API_URL;
const crmClient = createApiClient(baseUrl);

export const crm = createApiHooks(crmClient);
