// hooks/index.ts

import { botApi, crmApi, posApi } from "./axiosClient";
import { createApiHooks } from "./hooks/createApiHooks";

export const CRM = createApiHooks(crmApi);
export const POS = createApiHooks(posApi);
export const BOT = createApiHooks(botApi);
