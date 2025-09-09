// hooks/index.ts

import { crmApi, posApi } from "./axiosClient";
import { createApiHooks } from "./hooks/createApiHooks";

export const CRM = createApiHooks(crmApi);
export const POS = createApiHooks(posApi);
