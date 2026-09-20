import type { ReactNode } from "react";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import {
  AppDrawer,
  AppDrawerBody,
  AppDrawerContent,
  AppDrawerDescription,
  AppDrawerHeader,
  AppDrawerTitle,
} from "@/components/app/primitives/app-drawer";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { formattFechaWithMinutes } from "@/utils/formattFechas";
import {
  PerfilHomologacionListItem,
  PerfilHomologacionResponse,
} from "../../features/pppoe-homologaciones/intefaces";

interface PerfilDetailDrawerProps {
  open: boolean;
  summary: PerfilHomologacionListItem | null;
  detail: PerfilHomologacionResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onOpenChange: (open: boolean) => void;
  onRetry: () => void;
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] leading-tight text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-xs font-medium leading-snug">
        {value || (
          <span className="italic text-muted-foreground">Sin registrar</span>
        )}
      </dd>
    </div>
  );
}

export function PerfilDetailDrawer({
  open,
  summary,
  detail,
  isLoading,
  isFetching,
  error,
  onOpenChange,
  onRetry,
}: PerfilDetailDrawerProps) {
  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent side="right" className="sm:max-w-xl">
        <AppDrawerHeader>
          <AppDrawerTitle>
            Homologación {summary ? `#${summary.id}` : "PPPoE"}
          </AppDrawerTitle>
          <AppDrawerDescription>
            Relación entre el plan comercial y el perfil configurado en
            MikroTik.
          </AppDrawerDescription>
        </AppDrawerHeader>

        <AppDrawerBody className="p-4">
          <AppDataState
            isLoading={isLoading}
            isFetching={isFetching}
            error={error}
            isEmpty={!detail}
            onRetry={onRetry}
            loadingVariant="skeleton-card"
            loadingRows={5}
            minHeight="md"
          >
            {detail && summary ? (
              <AppStack gap="sm">
                <AppInline justify="between" align="center" fullWidth>
                  <code className="rounded bg-muted px-2 py-1 text-xs font-semibold">
                    {detail.codigoPerfil}
                  </code>
                  <AppBadge
                    tone={detail.activo ? "success" : "neutral"}
                    appearance="soft"
                    size="xs"
                    radius="full"
                    dot
                  >
                    {detail.activo ? "Activa" : "Inactiva"}
                  </AppBadge>
                </AppInline>

                <AppCard
                  variant="outline"
                  size="xs"
                  radius="md"
                  title="Router y plan"
                  description="Destino técnico y servicio comercial homologado."
                >
                  <dl>
                    <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                      <DetailItem
                        label="Router MikroTik"
                        value={summary.mikrotikRouter.nombre}
                      />
                      <DetailItem
                        label="Host SSH"
                        value={`${summary.mikrotikRouter.host}:${summary.mikrotikRouter.sshPort}`}
                      />
                      <DetailItem
                        label="Plan de internet"
                        value={summary.servicioInternet.nombre}
                      />
                      <DetailItem
                        label="Velocidad"
                        value={summary.servicioInternet.velocidad}
                      />
                      <DetailItem
                        label="Precio"
                        value={formattMonedaGT(summary.servicioInternet.precio)}
                      />
                      <DetailItem
                        label="Estado del plan"
                        value={summary.servicioInternet.estado}
                      />
                    </AppGrid>
                  </dl>
                </AppCard>

                <AppCard
                  variant="outline"
                  size="xs"
                  radius="md"
                  title="Uso y auditoría"
                >
                  <dl>
                    <AppGrid cols={{ base: 2 }} gap="sm">
                      <DetailItem
                        label="Cuentas vinculadas"
                        value={summary.conteos.cuentas}
                      />
                      <DetailItem
                        label="Auditorías"
                        value={summary.conteos.auditorias}
                      />
                      <DetailItem
                        label="Creado por"
                        value={summary.creadoPor?.nombre}
                      />
                      <DetailItem
                        label="Actualizado por"
                        value={summary.actualizadoPor?.nombre}
                      />
                    </AppGrid>
                  </dl>
                </AppCard>

                <AppCard
                  variant="outline"
                  size="xs"
                  radius="md"
                  title="Registro"
                >
                  <dl>
                    <AppGrid cols={{ base: 1, sm: 2 }} gap="sm">
                      <DetailItem label="ID" value={`#${detail.id}`} />
                      <DetailItem
                        label="ID del router"
                        value={detail.mikrotikRouterId}
                      />
                      <DetailItem
                        label="ID del servicio"
                        value={detail.servicioInternetId}
                      />
                      <DetailItem
                        label="Empresa"
                        value={`#${detail.empresaId}`}
                      />
                      <DetailItem
                        label="Creado"
                        value={formattFechaWithMinutes(detail.creadoEn)}
                      />
                      <DetailItem
                        label="Última actualización"
                        value={formattFechaWithMinutes(detail.actualizadoEn)}
                      />
                    </AppGrid>
                  </dl>
                </AppCard>
              </AppStack>
            ) : null}
          </AppDataState>
        </AppDrawerBody>
      </AppDrawerContent>
    </AppDrawer>
  );
}
