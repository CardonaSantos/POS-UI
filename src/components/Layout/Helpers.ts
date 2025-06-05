import { CRM_ROUTES, Route } from "./RoutesCrm";
import { POS_ROUTES } from "./RoutesPOS";

export function selectRoutes(
  isCrm: boolean,
  crmRole: string,
  posRole: string
): Route[] {
  if (isCrm) {
    return CRM_ROUTES[crmRole] ?? CRM_ROUTES.DEFAULT;
  }
  return POS_ROUTES[posRole] ?? POS_ROUTES.DEFAULT;
}
