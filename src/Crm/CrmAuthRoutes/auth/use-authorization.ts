import { useCallback } from "react";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { ROLE_PERMISSIONS } from "./crm-role-permissions";
import type { CrmPermission } from "./crm-permissions";

export function useAuthorization() {
  const role = useStoreCrm((state) => state.rol);

  const can = useCallback(
    (permission: CrmPermission) => {
      if (!role) {
        return false;
      }

      return ROLE_PERMISSIONS[role].includes(permission);
    },
    [role],
  );

  const canAny = useCallback(
    (permissions: readonly CrmPermission[]) => {
      return permissions.some(can);
    },
    [can],
  );

  const canAll = useCallback(
    (permissions: readonly CrmPermission[]) => {
      return permissions.every(can);
    },
    [can],
  );

  return {
    role,
    can,
    canAny,
    canAll,
  };
}
