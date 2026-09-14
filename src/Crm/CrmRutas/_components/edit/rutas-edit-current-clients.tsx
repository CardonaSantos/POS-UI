import { MapPin, Phone, RotateCcw, UserMinus, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";

import type { RutaEditCliente } from "@/Crm/features/rutas/ruta-edit.types";

import { ESTADO_CLIENTE_LABELS } from "@/Crm/CrmCustomers/customer-table.constants";

import { getEstadoTone } from "@/Crm/CrmCustomers/_components/customer-table.columns";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";

interface RutasEditCurrentClientsProps {
  clientes: RutaEditCliente[];
  selectedClientIds: ReadonlySet<string>;

  isDisabled?: boolean;

  onRemove: (clienteId: string) => void;
  onRestore: (clienteId: string) => void;
}

export function RutasEditCurrentClients({
  clientes,
  selectedClientIds,
  isDisabled = false,
  onRemove,
  onRestore,
}: RutasEditCurrentClientsProps) {
  const activeCount = clientes.filter((cliente) =>
    selectedClientIds.has(String(cliente.id)),
  ).length;

  const removedCount = clientes.length - activeCount;

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      title="Clientes actuales"
      description="Clientes que pertenecían a la ruta al abrir la edición."
      icon={<Users size={15} />}
      action={
        <div className="flex items-center gap-1">
          <AppBadge tone="info" appearance="soft" size="xs" radius="full">
            {activeCount} activos
          </AppBadge>

          {removedCount > 0 ? (
            <AppBadge tone="warning" appearance="soft" size="xs" radius="full">
              {removedCount} por quitar
            </AppBadge>
          ) : null}
        </div>
      }
    >
      {clientes.length === 0 ? (
        <AppEmptyState
          preset="empty"
          title="Sin clientes asignados"
          description="Esta ruta todavía no tiene clientes."
          size="sm"
          variant="plain"
        />
      ) : (
        <div className="max-h-[430px] space-y-1.5 overflow-y-auto pr-1">
          {clientes.map((cliente) => {
            const clienteId = String(cliente.id);

            const isSelected = selectedClientIds.has(clienteId);

            const nombre =
              `${cliente.nombre ?? ""} ${cliente.apellidos ?? ""}`.trim() ||
              `Cliente #${cliente.id}`;

            return (
              <div
                key={cliente.id}
                className={cn(
                  "rounded-[var(--app-radius-md)] border px-2.5 py-2 transition-opacity",
                  isSelected
                    ? "border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))]"
                    : "border-[hsl(var(--app-warning)/0.35)] bg-[hsl(var(--app-warning)/0.05)] opacity-65",
                )}
              >
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <span
                        className="max-w-full truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]"
                        title={nombre}
                      >
                        {nombre}
                      </span>

                      <span className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                        #{cliente.id}
                      </span>

                      {cliente.estadoCliente ? (
                        <AppBadge
                          tone={getEstadoTone(cliente.estadoCliente)}
                          appearance="soft"
                          size="xs"
                          radius="full"
                        >
                          {ESTADO_CLIENTE_LABELS[cliente.estadoCliente] ??
                            cliente.estadoCliente}
                        </AppBadge>
                      ) : null}

                      {!isSelected ? (
                        <AppBadge
                          tone="warning"
                          appearance="soft"
                          size="xs"
                          radius="full"
                        >
                          Se quitará
                        </AppBadge>
                      ) : null}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                      {cliente.telefono ? (
                        <span className="flex min-w-0 items-center gap-1">
                          <Phone size={11} className="shrink-0" />

                          <span className="truncate">{cliente.telefono}</span>
                        </span>
                      ) : null}

                      {cliente.direccion ? (
                        <span className="flex min-w-0 items-center gap-1">
                          <MapPin size={11} className="shrink-0" />

                          <span
                            className="max-w-[260px] truncate"
                            title={cliente.direccion}
                          >
                            {cliente.direccion}
                          </span>
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <AppBadge
                        tone={
                          Number(cliente.saldoPendiente ?? 0) > 0
                            ? "warning"
                            : "neutral"
                        }
                        appearance="soft"
                        size="xs"
                        radius="full"
                      >
                        Saldo{" "}
                        {formattMonedaGT(Number(cliente.saldoPendiente ?? 0))}
                      </AppBadge>

                      <AppBadge
                        tone={
                          Number(cliente.facturasPendientes ?? 0) > 0
                            ? "info"
                            : "neutral"
                        }
                        appearance="soft"
                        size="xs"
                        radius="full"
                      >
                        {Number(cliente.facturasPendientes ?? 0)} factura
                        {Number(cliente.facturasPendientes ?? 0) === 1
                          ? ""
                          : "s"}
                      </AppBadge>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="xs"
                        leftIcon={<UserMinus size={12} />}
                        disabled={isDisabled}
                        onClick={() => onRemove(clienteId)}
                        className="text-[hsl(var(--app-danger,var(--destructive)))]"
                      >
                        Quitar
                      </AppButton>
                    ) : (
                      <AppButton
                        type="button"
                        variant="secondary"
                        size="xs"
                        leftIcon={<RotateCcw size={12} />}
                        disabled={isDisabled}
                        onClick={() => onRestore(clienteId)}
                      >
                        Restaurar
                      </AppButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
