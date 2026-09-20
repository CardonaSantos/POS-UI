// import { useCallback, useMemo } from "react";
// import { RefreshCcw, Router } from "lucide-react";

// import { useAppConfirmHandler } from "@/components/app/handlers";
// import { AppAlert } from "@/components/app/primitives/app-alert";
// import { AppBadge } from "@/components/app/primitives/app-badge";
// import { AppButton } from "@/components/app/primitives/app-button";
// import { AppCard } from "@/components/app/primitives/app-card";
// import { AppDataState } from "@/components/app/primitives/app-data-state";
// import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
// import { AppInline } from "@/components/app/primitives/app-inline";
// import { AppStack } from "@/components/app/primitives/app-stack";

// import { useGetAuditoriaPppoeInstalacion } from "@/Crm/CrmHooks/hooks/pppoe-auditoria/pppoe-auditoria-instalacion-hook";

// import type { ClienteInstalacionDetalle } from "@/Crm/features/instalaciones/instalaciones.interfaces";

// import type { FiltrarAuditoriaPppoeInstalacionParams } from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.filters";

// import type { PppoeAdminActionRequest } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";

// import { findAuthorizablePendingOperation } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";

// import {
//   getEstadoToneInstalacion,
//   humanizeEnum,
// } from "../details/instalacion-utils.utils";

// import { PppoePendingOperationCard } from "../pppoe-admin/pppoe-pending-operation-card";
// import { PppoeAdminAccessCard } from "../pppoe-admin/pppoe-admin-access-card";
// import { PppoeAdminActionHost } from "../pppoe-admin/pppoe-admin-action-host";
// import { PppoeAdminProgress } from "../pppoe-admin/pppoe-admin-progress";
// import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";
// import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";

// type Props = {
//   instalacion: ClienteInstalacionDetalle;
//   enabled: boolean;
// };

// const SUMMARY_QUERY: FiltrarAuditoriaPppoeInstalacionParams = {
//   page: 1,
//   limit: 5,
//   ordenDireccion: "desc",
// };

// const PENDING_QUERY: FiltrarAuditoriaPppoeInstalacionParams = {
//   page: 1,
//   limit: 10,
//   estadoOperacion: "PENDIENTE",
//   ordenDireccion: "desc",
// };

// export function InstalacionPppoeAdministracionTab({
//   instalacion,
//   enabled,
// }: Props) {
//   const { can } = useAuthorization();

//   /*
//    * Permite entrar al módulo de administración.
//    *
//    * SUPER_ADMIN / COORDINADOR / OFICINA
//    * según la matriz que definimos.
//    */
//   const canViewAdministration = can(CRM_PERMISSION.PPPOE_ADMINISTRACION_VER);

//   /*
//    * Permite consultar operaciones internas/protegidas.
//    *
//    * OFICINA no debería necesitar esto para
//    * suspender, reactivar o revelar credenciales.
//    */
//   const canViewOperations = can(CRM_PERMISSION.PPPOE_OPERACIONES_VER);

//   /*
//    * No basta con ocultar la tab.
//    * Evitamos también ejecutar queries si el usuario
//    * no tiene acceso a Administración PPPoE.
//    */
//   const administrationEnabled = enabled && canViewAdministration;

//   /*
//    * Las operaciones pendientes son una capa más sensible.
//    * Sólo se consultan si el usuario tiene esa capacidad.
//    */
//   const pendingOperationsEnabled = administrationEnabled && canViewOperations;

//   const actionFlow = useAppConfirmHandler<PppoeAdminActionRequest>();

//   const summaryQuery = useGetAuditoriaPppoeInstalacion(
//     instalacion.id,
//     SUMMARY_QUERY,
//     administrationEnabled,
//   );

//   const pendingQuery = useGetAuditoriaPppoeInstalacion(
//     instalacion.id,
//     PENDING_QUERY,
//     pendingOperationsEnabled,
//   );

//   const summary = summaryQuery.data?.summary ?? null;

//   const accesses = summary?.accesosPppoe ?? [];

//   const pendingOperation = useMemo(() => {
//     if (!canViewOperations) {
//       return null;
//     }

//     return findAuthorizablePendingOperation(pendingQuery.data?.data ?? []);
//   }, [canViewOperations, pendingQuery.data?.data]);

//   const { refetch: refetchSummary } = summaryQuery;

//   const { refetch: refetchPending } = pendingQuery;

//   const handleRefresh = useCallback(async () => {
//     if (!canViewAdministration) {
//       return;
//     }

//     /*
//      * Importante:
//      * React Query permite llamar refetch()
//      * incluso sobre una query enabled:false.
//      *
//      * Por eso no debemos ejecutar
//      * refetchPending() para Oficina.
//      */
//     if (canViewOperations) {
//       await Promise.all([refetchSummary(), refetchPending()]);

//       return;
//     }

//     await refetchSummary();
//   }, [
//     canViewAdministration,
//     canViewOperations,
//     refetchPending,
//     refetchSummary,
//   ]);

//   const handleCompleted = useCallback(() => {
//     actionFlow.setOpen(false);

//     void handleRefresh();
//   }, [actionFlow.setOpen, handleRefresh]);

//   /*
//    * Defensa local.
//    *
//    * Aunque el padre normalmente no debería crear
//    * esta tab sin PPPOE_ADMINISTRACION_VER,
//    * este componente tampoco debe funcionar
//    * si se reutiliza accidentalmente en otro lugar.
//    */
//   if (!administrationEnabled) {
//     return null;
//   }

//   const isFetching =
//     summaryQuery.isFetching || (canViewOperations && pendingQuery.isFetching);

//   return (
//     <>
//       <AppStack gap="sm">
//         <AppCard variant="outline" size="xs" radius="md" className="p-3">
//           <AppInline
//             justify="between"
//             align="start"
//             gap="sm"
//             collapseBelow="sm"
//             fullWidth
//           >
//             <div className="min-w-0">
//               <AppInline align="center" gap="xs" wrap>
//                 <Router className="size-5" aria-hidden="true" />

//                 <p className="text-sm font-semibold">Administración PPPoE</p>

//                 <AppBadge
//                   tone={getEstadoToneInstalacion(instalacion.estado)}
//                   appearance="soft"
//                   size="xs"
//                   radius="full"
//                 >
//                   {humanizeEnum(instalacion.estado)}
//                 </AppBadge>
//               </AppInline>

//               <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
//                 {canViewOperations
//                   ? "Administración del acceso, credenciales y operaciones PPPoE."
//                   : "Administración operativa del acceso y credenciales del servicio."}
//               </p>
//             </div>

//             <AppButton
//               type="button"
//               variant="outline"
//               size="sm"
//               disabled={isFetching}
//               loadingText="Actualizando..."
//               onClick={handleRefresh}
//             >
//               <RefreshCcw aria-hidden="true" />
//               Actualizar
//             </AppButton>
//           </AppInline>
//         </AppCard>

//         <AppDataState
//           isLoading={summaryQuery.isLoading}
//           isFetching={isFetching}
//           error={summaryQuery.error}
//           isEmpty={Boolean(summaryQuery.data) && !summary}
//           onRetry={handleRefresh}
//           loadingVariant="skeleton-grid"
//           emptyTitle="Contexto PPPoE no disponible"
//           emptyDescription="No existe una instalación accesible para este identificador."
//           variant="plain"
//           size="sm"
//           minHeight="lg"
//         >
//           {summary ? (
//             <AppStack gap="sm">
//               <PppoeAdminProgress account={summary.cuentaPppoe} />

//               {summary.instalacion.fechaActivacionServicio == null &&
//               summary.cuentaPppoe?.estado === "ACTIVA" ? (
//                 <AppAlert
//                   tone="warning"
//                   title="Diferencia histórica detectada"
//                   size="xs"
//                 >
//                   La cuenta y el acceso aparecen activos, pero la instalación no
//                   tiene fechaActivacionServicio. La administración se basa en el
//                   estado operativo de la cuenta PPPoE.
//                 </AppAlert>
//               ) : null}

//               {accesses.length > 0 ? (
//                 accesses.map((access) => (
//                   <PppoeAdminAccessCard
//                     key={access.id}
//                     instalacionId={instalacion.id}
//                     fechaActivacionServicio={
//                       summary.instalacion.fechaActivacionServicio
//                     }
//                     access={access}
//                     fullAccount={
//                       summary.cuentaPppoe?.accesoInternetId === access.id
//                         ? summary.cuentaPppoe
//                         : null
//                     }
//                     onAction={actionFlow.open}
//                   />
//                 ))
//               ) : (
//                 <AppEmptyState
//                   title="Sin acceso GPON/PPPoE vinculado"
//                   description="La instalación no contiene un acceso administrable mediante este flujo."
//                 />
//               )}

//               {canViewOperations && pendingOperation ? (
//                 <PppoePendingOperationCard
//                   empresaId={summary.instalacion.empresaId}
//                   instalacionId={instalacion.id}
//                   item={pendingOperation}
//                   onAction={actionFlow.open}
//                 />
//               ) : null}

//               {canViewOperations && pendingQuery.error ? (
//                 <AppAlert
//                   tone="warning"
//                   title="Operaciones pendientes no disponibles"
//                   size="xs"
//                 >
//                   El estado principal pudo cargarse, pero no fue posible revisar
//                   operaciones protegidas pendientes.
//                 </AppAlert>
//               ) : null}
//             </AppStack>
//           ) : null}
//         </AppDataState>
//       </AppStack>

//       <PppoeAdminActionHost
//         request={actionFlow.target}
//         open={actionFlow.isOpen}
//         onOpenChange={actionFlow.setOpen}
//         onCompleted={handleCompleted}
//         onDataChanged={() => void handleRefresh()}
//       />
//     </>
//   );
// }
