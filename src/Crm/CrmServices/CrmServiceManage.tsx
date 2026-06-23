"use client";

import { AlertCircle, PlusCircle, RefreshCw, Search } from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

import { useCrmServiceManager } from "./_components/use-crm-service-manager";
import { CrmServiceTable } from "./_components/crm-service-table";
import {
  CreateServicioDialog,
  CreateTipoServicioDialog,
  EditServicioDialog,
} from "./_components/crm-service-dialogs";

export default function CrmServiceManage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const vm = useCrmServiceManager(empresaId);

  return (
    <PageTransitionCrm
      titleHeader="Servicios Adicionales"
      subtitle="Servicios disponibles en el sistema"
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppInline align="center" gap="xs" wrap className="w-full md:w-auto">
            <AppInput
              value={vm.state.searchServicio}
              onChange={(event) => vm.setSearchServicio(event.target.value)}
              placeholder="Buscar servicios..."
              size="xs"
              fieldWidth="full"
              leftIcon={<Search size={13} />}
              className="md:w-[260px]"
              disabled={vm.isMutating}
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
              disabled={!vm.state.searchServicio || vm.isMutating}
              onClick={vm.clearSearch}
            >
              Limpiar
            </AppButton>
          </AppInline>

          <AppInline align="center" gap="xs" wrap>
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<PlusCircle size={13} />}
              disabled={vm.isMutating}
              onClick={vm.openCreateTipoServicio}
            >
              Nuevo tipo
            </AppButton>

            <AppButton
              type="button"
              variant="primary"
              size="xs"
              width="auto"
              leftIcon={<PlusCircle size={13} />}
              disabled={vm.isMutating}
              onClick={vm.openCreateServicio}
            >
              Nuevo servicio
            </AppButton>
          </AppInline>
        </AppInline>

        {vm.state.error ? (
          <AppAlert
            tone="danger"
            size="sm"
            icon={<AlertCircle size={15} />}
            title="Error"
            description={vm.state.error}
          />
        ) : null}

        <AppCard
          variant="outline"
          size="sm"
          title="Servicios existentes"
          description="Lista de servicios disponibles en el sistema"
        >
          {vm.isLoading ? (
            <AppEmptyState
              preset="search"
              variant="plain"
              size="sm"
              align="center"
              icon={<RefreshCw size={32} className="animate-spin" />}
              title="Cargando servicios"
              description="Espere mientras se cargan los registros."
              className="py-10"
            />
          ) : vm.filteredServicios.length === 0 ? (
            <AppEmptyState
              preset="search"
              variant="plain"
              size="sm"
              align="center"
              title="No se encontraron servicios"
              description={
                vm.state.searchServicio
                  ? `No hay resultados para "${vm.state.searchServicio}".`
                  : "No hay servicios registrados."
              }
              action={
                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<PlusCircle size={13} />}
                  onClick={vm.openCreateServicio}
                >
                  Crear servicio
                </AppButton>
              }
              className="py-10"
            />
          ) : (
            <CrmServiceTable
              data={vm.filteredServicios}
              tiposServicio={vm.tiposServicio}
              isLoading={vm.isLoading}
              onEdit={vm.openEditServicio}
              onDelete={vm.openDeleteServicio}
            />
          )}
        </AppCard>
      </AppStack>

      <CreateServicioDialog
        open={vm.createServicioDialog.isOpen}
        onOpenChange={(open) => {
          vm.createServicioDialog.setOpen(open);
          if (!open) vm.resetServicioForm();
        }}
        form={vm.state.servicioForm}
        tipoOptions={vm.tipoOptions}
        isLoading={vm.createServicioAction.isLoading}
        onPatch={vm.patchServicioForm}
        onSubmit={vm.submitCreateServicio}
      />

      <EditServicioDialog
        open={vm.editServicioDialog.isOpen}
        onOpenChange={(open) => {
          vm.editServicioDialog.setOpen(open);
          if (!open) vm.resetServicioForm();
        }}
        form={vm.state.servicioForm}
        tipoOptions={vm.tipoOptions}
        isLoading={vm.updateServicioAction.isLoading}
        onPatch={vm.patchServicioForm}
        onSubmit={vm.submitUpdateServicio}
      />

      <CreateTipoServicioDialog
        open={vm.createTipoDialog.isOpen}
        onOpenChange={(open) => {
          vm.createTipoDialog.setOpen(open);
          if (!open) vm.resetTipoServicioForm();
        }}
        form={vm.state.tipoServicioForm}
        isLoading={vm.createTipoServicioAction.isLoading}
        onPatch={vm.patchTipoServicioForm}
        onSubmit={vm.submitCreateTipoServicio}
      />

      <AppConfirmDialog
        open={vm.deleteDialog.isOpen}
        onOpenChange={vm.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar servicio"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={vm.deleteServicioAction.isLoading}
        preventClose={vm.deleteServicioAction.isLoading}
        closeOnConfirm={false}
        onConfirm={vm.confirmDeleteServicio}
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Servicio seleccionado:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {vm.deleteDialog.target?.nombre ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Si hay clientes asociados a este servicio, se perderá la relación con
          ellos.
        </p>
      </AppConfirmDialog>
    </PageTransitionCrm>
  );
}
