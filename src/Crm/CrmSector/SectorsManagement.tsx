"use client";

import {
  Building2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
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
import { SectorTable } from "./_components/sector-table";
import { useSectorManager } from "./_components/use-sector-manager";
import {
  CreateSectorDialog,
  EditSectorDialog,
  SectorDetailsDialog,
} from "./_components/sector-dialogs";

function SectorStatCard({
  label,
  description,
  value,
  icon,
}: {
  label: string;
  description: string;
  value: React.ReactNode;
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

export default function SectorsManagement() {
  const vm = useSectorManager();

  const statItems = [
    {
      label: "Sectores",
      description: "Registrados",
      value: vm.stats.totalSectores,
      icon: <MapPin size={13} />,
    },
    {
      label: "Clientes",
      description: "Asignados",
      value: vm.stats.totalClientes,
      icon: <Users size={13} />,
    },
    {
      label: "Municipios",
      description: "Con sectores",
      value: vm.stats.totalMunicipios,
      icon: <Building2 size={13} />,
    },
  ];

  return (
    <PageTransitionCrm
      titleHeader="Sectores"
      subtitle={`${vm.sectores.length} sectores registrados`}
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppInline align="center" gap="xs" wrap className="w-full sm:w-auto">
            <AppInput
              value={vm.state.searchQuery}
              onChange={(event) => vm.setSearchQuery(event.target.value)}
              placeholder="Buscar sectores..."
              size="xs"
              fieldWidth="full"
              leftIcon={<Search size={13} />}
              className="sm:w-[280px]"
              disabled={vm.isMutating}
              clearable
              onClear={vm.clearSearch}
            />

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<RefreshCw size={13} />}
              loading={vm.loadAction.isLoading}
              loadingText="Actualizando..."
              disabled={vm.isMutating}
              onClick={() => vm.loadAction.run()}
            >
              Actualizar
            </AppButton>

            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              disabled={!vm.state.searchQuery || vm.isMutating}
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
            Nuevo sector
          </AppButton>
        </AppInline>

        {vm.state.error ? (
          <AppAlert
            tone="danger"
            size="sm"
            title="Error"
            description={vm.state.error}
          />
        ) : null}

        <AppGrid cols={{ base: 1, sm: 3 }} gap="xs">
          {statItems.map((item) => (
            <SectorStatCard
              key={item.label}
              label={item.label}
              description={item.description}
              icon={item.icon}
              value={
                vm.isLoading ? <AppSkeleton className="h-4 w-10" /> : item.value
              }
            />
          ))}
        </AppGrid>

        <AppCard
          variant="outline"
          size="sm"
          title={
            <AppInline align="center" gap="xs">
              <MapPin size={15} className="text-[hsl(var(--app-primary))]" />
              <span>Sectores registrados</span>
            </AppInline>
          }
          description={`${vm.filteredSectores.length} de ${vm.sectores.length} sectores`}
        >
          {vm.isLoading && vm.sectores.length === 0 ? (
            <AppStack gap="xs" className="py-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <AppSkeleton key={index} className="h-9 w-full" />
              ))}
            </AppStack>
          ) : vm.sectores.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<MapPin size={34} strokeWidth={1.5} />}
              title="No hay sectores"
              description="Comienza creando un nuevo sector."
              action={
                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<Plus size={13} />}
                  onClick={vm.openCreateDialog}
                >
                  Nuevo sector
                </AppButton>
              }
              className="py-10"
            />
          ) : vm.filteredSectores.length === 0 ? (
            <AppEmptyState
              preset="search"
              variant="plain"
              size="sm"
              align="center"
              icon={<Search size={34} strokeWidth={1.5} />}
              title="Sin resultados"
              description={`No se encontraron sectores para "${vm.state.searchQuery}".`}
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
            <SectorTable
              sectores={vm.filteredSectores}
              municipios={vm.municipios}
              onView={vm.openDetailDialog}
              onEdit={vm.openEditDialog}
              onDelete={vm.openDeleteDialog}
            />
          )}
        </AppCard>
      </AppStack>

      <CreateSectorDialog
        open={vm.createDialog.isOpen}
        onOpenChange={(open) => {
          vm.createDialog.setOpen(open);
          if (!open) vm.resetSectorForm();
        }}
        form={vm.state.sectorForm}
        departamentoOptions={vm.departamentoOptions}
        municipioOptions={vm.municipioOptions}
        isLoading={vm.isCreating}
        onPatch={vm.patchSectorForm}
        onDepartamentoChange={vm.handleDepartamentoChange}
        onMunicipioChange={vm.handleMunicipioChange}
        onSubmit={vm.submitCreate}
      />

      <EditSectorDialog
        open={vm.editDialog.isOpen}
        onOpenChange={(open) => {
          vm.editDialog.setOpen(open);
          if (!open) vm.resetSectorForm();
        }}
        form={vm.state.sectorForm}
        departamentoOptions={vm.departamentoOptions}
        municipioOptions={vm.municipioOptions}
        isLoading={vm.isUpdating}
        onPatch={vm.patchSectorForm}
        onDepartamentoChange={vm.handleDepartamentoChange}
        onMunicipioChange={vm.handleMunicipioChange}
        onSubmit={vm.submitEdit}
      />

      <SectorDetailsDialog
        open={vm.detailDialog.isOpen}
        onOpenChange={vm.detailDialog.setOpen}
        sector={vm.state.selectedSector}
      />

      <AppConfirmDialog
        open={vm.deleteDialog.isOpen}
        onOpenChange={vm.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar sector"
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
          Sector seleccionado:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {vm.deleteDialog.target?.nombre ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Si hay clientes asociados a este sector, se perderá la relación con
          ellos.
        </p>
      </AppConfirmDialog>
    </PageTransitionCrm>
  );
}
