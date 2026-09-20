import { useCallback, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  useAppDisclosure,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetAutorizacionesDesinstalacionPendientes } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import { createAutorizacionesPendientesColumns } from "./table/autorizaciones-pendientes.columns";

import { toAutorizacionesPendientesQueryParams } from "./filters/autorizaciones-pendientes-filters";

import type { AutorizacionDesinstalacionActionRequest } from "./actions/autorizacion-action.types";
import { AutorizacionPendienteListItem } from "../features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";
import { DESINSTALACIONES_ROUTES } from "../CrmDesinstalaciones/table/routes.route";
import { AutorizacionDesinstalacionActionHost } from "./components/AutorizacionDesinstalacionActionHost";
import { AutorizacionesPendientesTable } from "./table/autorizaciones-pendientes-table";
import { CRM_PERMISSION } from "../CrmAuthRoutes/auth/crm-permissions";
import { useAuthorization } from "../CrmAuthRoutes/auth/use-authorization";

const EMPTY_ITEMS: AutorizacionPendienteListItem[] = [];

function AutorizacionesDesinstalacionPage() {
  const navigate = useNavigate();

  const { can } = useAuthorization();

  const canAuthorize = can(CRM_PERMISSION.DESINSTALACIONES_AUTORIZAR);

  const table = useAppTableHandlers({
    initialPageIndex: 0,

    initialPageSize: 10,

    initialDensity: "xs",
  });

  const actionDialog = useAppDisclosure();

  const [actionRequest, setActionRequest] =
    useState<AutorizacionDesinstalacionActionRequest | null>(null);

  const handleAction = useCallback(
    (request: AutorizacionDesinstalacionActionRequest) => {
      if (!canAuthorize) {
        return;
      }

      setActionRequest(request);
      actionDialog.open();
    },
    [actionDialog.open, canAuthorize],
  );

  const handleActionOpenChange = useCallback(
    (open: boolean) => {
      actionDialog.setOpen(open);

      if (!open) {
        setActionRequest(null);
      }
    },
    [actionDialog.setOpen],
  );

  const handleActionCompleted = useCallback(() => {
    actionDialog.setOpen(false);

    setActionRequest(null);
  }, [actionDialog.setOpen]);

  const columns = useMemo(
    () =>
      createAutorizacionesPendientesColumns({
        canAuthorize,

        onViewDesinstalacion: (desinstalacionId) => {
          navigate(DESINSTALACIONES_ROUTES.detalle(desinstalacionId));
        },

        onAprobar: (item) => {
          handleAction({
            action: "aprobar",
            item,
          });
        },

        onRechazar: (item) => {
          handleAction({
            action: "rechazar",
            item,
          });
        },
      }),
    [canAuthorize, handleAction, navigate],
  );

  const queryParams = useMemo(
    () =>
      toAutorizacionesPendientesQueryParams({
        pageIndex: table.pagination.pageIndex,

        pageSize: table.pagination.pageSize,
      }),
    [table.pagination.pageIndex, table.pagination.pageSize],
  );

  const query = useGetAutorizacionesDesinstalacionPendientes(queryParams);

  const items = query.data?.data ?? EMPTY_ITEMS;

  const total = query.data?.meta.total ?? 0;

  return (
    <PageTransitionCrm
      titleHeader="Autorizaciones de desinstalación"
      variant="fade-pure"
    >
      <AppContainer>
        <AppStack gap="md">
          <AutorizacionesPendientesTable
            data={items}
            columns={columns}
            totalRows={total}
            table={table}
            isLoading={query.isPending}
            isFetching={query.isFetching}
            error={query.error}
            onRetry={() => query.refetch()}
          />
        </AppStack>

        <AutorizacionDesinstalacionActionHost
          request={actionRequest}
          open={actionDialog.isOpen}
          onOpenChange={handleActionOpenChange}
          onCompleted={handleActionCompleted}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default AutorizacionesDesinstalacionPage;
