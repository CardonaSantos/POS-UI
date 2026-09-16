import { ClipboardList, FilePenLine, History } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppStateHandlers } from "@/components/app/handlers";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs } from "@/components/app/primitives/app-tabs";

import {
  getClienteNombre,
  getEstadoToneInstalacion,
  humanizeEnum,
} from "./instalacion-utils.utils";

import {
  InstalacionDetailTab,
  InstalacionDetailViewProps,
} from "../instalacion-detail.types";

import { InstalacionGeneralTab } from "../tabs/instalacion-general-tab";
import { InstalacionPppoeAuditoriaTab } from "../tabs/instalacion-pppoe-auditoria-tab";
// import { InstalacionPppoeAdministracionTab } from "../tabs/instalacion-pppoe-administracion-tab";
import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";
import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";
import {
  AppDropdownMenu,
  AppDropdownMenuContent,
  AppDropdownMenuItem,
  AppDropdownMenuTrigger,
} from "@/components/app/primitives/app-dropdown-menu";

const mutedTextClass = "text-[hsl(var(--app-muted-foreground))]";

export function InstalacionDetailView(props: InstalacionDetailViewProps) {
  const { instalacion } = props;

  const clienteNombre = getClienteNombre(instalacion);

  const { can } = useAuthorization();

  const canViewAudit = can(CRM_PERMISSION.PPPOE_AUDITORIA_VER);

  // const canViewPppoeAdministration = can(
  //   CRM_PERMISSION.PPPOE_ADMINISTRACION_VER,
  // );

  const tabs = useAppStateHandlers<{
    activeTab: InstalacionDetailTab;
  }>({
    activeTab: "detalle",
  });

  const activeTab = tabs.state.activeTab;

  return (
    <AppStack gap="md">
      <AppInline
        justify="between"
        align="start"
        collapseBelow="sm"
        gap="sm"
        fullWidth
      >
        <div className="min-w-0">
          <AppInline align="center" gap="xs" wrap>
            <h1 className="text-base font-semibold">
              Instalación #{instalacion.id}
            </h1>

            <AppBadge
              tone={getEstadoToneInstalacion(instalacion.estado)}
              appearance="soft"
              size="xs"
              radius="full"
            >
              {humanizeEnum(instalacion.estado)}
            </AppBadge>

            <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
              {humanizeEnum(instalacion.tipo)}
            </AppBadge>
          </AppInline>

          <p className={`truncate text-sm ${mutedTextClass}`}>
            {clienteNombre}
          </p>
        </div>

        <AppInline>
          <AppDropdownMenu>
            <AppDropdownMenuTrigger asChild>
              <AppButton
                type="button"
                variant="ghost"
                size="xs"
                width="auto"
                leftIcon={<FilePenLine size={13} />}
                className="h-7"
              >
                Contrato
              </AppButton>
            </AppDropdownMenuTrigger>

            <AppDropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              width="md"
              size="xs"
              className="z-[120]"
            >
              {props.plantillas.length ? (
                props.plantillas.map((plantilla) => (
                  <Link
                    to={`/crm/instalaciones/${instalacion.id}/contrato?plantilla=${plantilla.id}`}
                    className="flex w-full items-center gap-2"
                  >
                    <AppDropdownMenuItem key={plantilla.id}>
                      <span className="truncate">{plantilla.nombre}</span>
                    </AppDropdownMenuItem>
                  </Link>
                ))
              ) : (
                <div className="px-2 py-1.5 text-xs italic text-[hsl(var(--app-muted-foreground))]">
                  Sin plantillas disponibles
                </div>
              )}
            </AppDropdownMenuContent>
          </AppDropdownMenu>

          <AppButton asChild variant="outline" size="sm">
            <Link to={`/crm/pppoe/cuentas/${instalacion.cuentaPppoe.id}`}>
              PPPOE
            </Link>
          </AppButton>

          <AppButton asChild variant="outline" size="sm">
            <Link to={`/crm/cliente/${instalacion.cliente.id}/?tab=resumen`}>
              Ver cliente
            </Link>
          </AppButton>
        </AppInline>
      </AppInline>

      <AppTabs
        value={activeTab}
        onValueChange={(value) =>
          tabs.setField("activeTab", value as InstalacionDetailTab)
        }
        variant="minimal"
        size="sm"
        contentSpacing="sm"
        tabs={[
          {
            value: "detalle",
            label: "Detalle de instalación",
            icon: <ClipboardList aria-hidden="true" />,
            content: <InstalacionGeneralTab {...props} />,
          },

          ...(canViewAudit
            ? [
                {
                  value: "auditoria",
                  label: "Auditoría",
                  icon: <History aria-hidden="true" />,
                  content: (
                    <InstalacionPppoeAuditoriaTab
                      instalacionId={instalacion.id}
                      enabled={activeTab === "auditoria"}
                    />
                  ),
                } as const,
              ]
            : []),

          // ...(canViewPppoeAdministration
          //   ? [
          //       {
          //         value: "pppoe",
          //         label: "Administración PPPoE",
          //         icon: <Router aria-hidden="true" />,
          //         content: (
          //           <InstalacionPppoeAdministracionTab
          //             instalacion={instalacion}
          //             enabled={activeTab === "pppoe"}
          //           />
          //         ),
          //       } as const,
          //     ]
          //   : []),
        ]}
      />
    </AppStack>
  );
}
