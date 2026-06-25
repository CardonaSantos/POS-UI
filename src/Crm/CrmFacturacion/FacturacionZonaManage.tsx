"use client";
import { FileText, Map, Plus, RefreshCw, Search, Users } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { FacturacionZonaTable } from "./_components/facturacion-zona-table";
import { useFacturacionZonaManager } from "./_components/use-facturacion-zona-manager";
import {
  CreateZonaDialog,
  EditZonaDialog,
} from "./_components/facturacion-zona-dialogs";

function ZonaStatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <AppCard variant="outline" size="xs" className="px-3 py-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppInline align="center" gap="xs" className="min-w-0">
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
            {icon}
          </span>

          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {label}
            </p>
            <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {description}
            </p>
          </div>
        </AppInline>

        <span className="shrink-0 text-sm font-bold tabular-nums leading-none text-[hsl(var(--app-foreground,var(--foreground)))]">
          {value}
        </span>
      </AppInline>
    </AppCard>
  );
}

export default function FacturacionZonaManage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const vm = useFacturacionZonaManager(empresaId);

  const statItems = [
    {
      label: "Zonas",
      value: vm.stats.totalZonas,
      description: "Configuradas",
      icon: <Map size={13} />,
    },
    {
      label: "Clientes",
      value: vm.stats.totalClientes,
      description: "Asignados",
      icon: <Users size={13} />,
    },
    {
      label: "Facturas",
      value: vm.stats.totalFacturas,
      description: "Generadas",
      icon: <FileText size={13} />,
    },
  ];

  return (
    <PageTransitionCrm
      titleHeader="Zonas de facturación"
      subtitle="Configuración de ciclos de cobro, recordatorios y cortes"
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppInline align="center" gap="xs" wrap className="w-full sm:w-auto">
            <AppInput
              value={vm.ui.searchZona}
              onChange={(event) => vm.setSearchZona(event.target.value)}
              placeholder="Buscar zona..."
              size="xs"
              fieldWidth="full"
              leftIcon={<Search size={13} />}
              className="sm:w-[260px]"
              disabled={vm.isMutating}
            />

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<RefreshCw size={13} />}
              loading={vm.isFetching}
              loadingText="Actualizando..."
              disabled={vm.isMutating}
              onClick={() => vm.refetch()}
            >
              Actualizar
            </AppButton>

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              disabled={!vm.ui.searchZona || vm.isMutating}
              onClick={vm.clearSearch}
            >
              Limpiar
            </AppButton>
          </AppInline>

          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<Plus size={13} />}
            disabled={vm.isMutating}
            onClick={vm.openCreateDialog}
          >
            Nueva zona
          </AppButton>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 3 }} gap="xs">
          {statItems.map((item) => (
            <ZonaStatCard
              key={item.label}
              label={item.label}
              value={
                vm.isLoading ? <AppSkeleton className="h-4 w-10" /> : item.value
              }
              description={item.description}
              icon={item.icon}
            />
          ))}
        </AppGrid>

        <AppCard
          variant="outline"
          size="sm"
          title="Zonas de facturación"
          description={`${vm.filteredZonas.length} de ${vm.zonas.length} zonas`}
        >
          {vm.isLoading ? (
            <AppStack gap="xs" className="py-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <AppSkeleton key={index} className="h-9 w-full" />
              ))}
            </AppStack>
          ) : vm.zonas.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<Map size={34} strokeWidth={1.5} />}
              title="Sin zonas de facturación"
              description="Cree una nueva zona para comenzar."
              action={
                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<Plus size={13} />}
                  onClick={vm.openCreateDialog}
                >
                  Nueva zona
                </AppButton>
              }
              className="py-10"
            />
          ) : vm.filteredZonas.length === 0 ? (
            <AppEmptyState
              preset="search"
              variant="plain"
              size="sm"
              align="center"
              icon={<Search size={34} strokeWidth={1.5} />}
              title="Sin resultados"
              description={`No se encontraron zonas para "${vm.ui.searchZona}".`}
              action={
                <AppButton
                  type="button"
                  variant="secondary"
                  size="xs"
                  width="auto"
                  onClick={vm.clearSearch}
                >
                  Limpiar búsqueda
                </AppButton>
              }
              className="py-10"
            />
          ) : (
            <FacturacionZonaTable
              zonas={vm.filteredZonas}
              onEdit={vm.openEditDialog}
              onDelete={vm.openDeleteDialog}
            />
          )}
        </AppCard>
      </AppStack>

      <CreateZonaDialog
        open={vm.createDialog.isOpen}
        onOpenChange={(open) => {
          vm.createDialog.setOpen(open);
          if (!open) vm.resetZonaForm();
        }}
        form={vm.ui.zonaForm}
        isLoading={vm.isCreating}
        onPatch={vm.patchZonaForm}
        onSubmit={vm.submitCreate}
      />

      <EditZonaDialog
        open={vm.editDialog.isOpen}
        onOpenChange={(open) => {
          vm.editDialog.setOpen(open);
          if (!open) vm.resetZonaForm();
        }}
        form={vm.ui.zonaForm}
        isLoading={vm.isPatching}
        onPatch={vm.patchZonaForm}
        onSubmit={vm.submitEdit}
      />

      <AppConfirmDialog
        open={vm.deleteDialog.isOpen}
        onOpenChange={vm.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar zona de facturación"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={vm.isDeleting}
        preventClose={vm.isDeleting}
        closeOnConfirm={false}
        onConfirm={vm.confirmDelete}
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Zona seleccionada:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {vm.deleteDialog.target?.nombre ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Si hay clientes o facturas asociadas a esta zona, se perderá la
          relación con ellos.
        </p>
      </AppConfirmDialog>
    </PageTransitionCrm>
  );
}
