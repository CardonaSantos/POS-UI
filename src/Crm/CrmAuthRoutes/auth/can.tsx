import type { ReactNode } from "react";

import type { CrmPermission } from "./crm-permissions";
import { useAuthorization } from "./use-authorization";

type CanProps = {
  permission: CrmPermission;
  children: ReactNode;
  fallback?: ReactNode;
};

export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = useAuthorization();

  if (!can(permission)) {
    return fallback;
  }

  return children;
}
