import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";
import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";

export function useInstalacionPppoeCapabilities() {
  const { can } = useAuthorization();

  return {
    canViewAudit: can(CRM_PERMISSION.PPPOE_AUDITORIA_VER),

    canViewOperations: can(CRM_PERMISSION.PPPOE_OPERACIONES_VER),

    canRetryOperations: can(CRM_PERMISSION.PPPOE_OPERACIONES_REINTENTAR),

    canViewSensitiveDiagnostics: can(
      CRM_PERMISSION.PPPOE_DIAGNOSTICO_SENSIBLE_VER,
    ),

    canRevealCredentials: can(CRM_PERMISSION.PPPOE_CREDENCIALES_REVELAR),
  };
}
