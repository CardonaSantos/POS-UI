import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import { useAuthorization } from "./use-authorization";

import type { CrmPermission } from "./crm-permissions";

interface RequirePermissionProps {
  permission: CrmPermission;
  children: ReactElement;
}

export function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const { can } = useAuthorization();

  if (!can(permission)) {
    return <Navigate to="/crm/forbidden" replace />;
  }

  return children;
}
