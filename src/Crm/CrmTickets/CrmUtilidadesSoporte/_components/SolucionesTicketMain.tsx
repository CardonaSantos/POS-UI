"use client";
import { CheckCheck, Plus, Settings2, X } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";

import { TicketSolucionesForm } from "./form/form";
import { TicketSolucionesList } from "./map/map-regists";
import { useTicketSolucionesManager } from "./use-ticket-soluciones-manager";

function SolucionesLoadingState() {
  return (
    <AppCard variant="outline" size="sm">
      <AppStack gap="sm">
        <AppSkeleton className="h-8 w-full" />
        <AppSkeleton className="h-8 w-full" />
        <AppSkeleton className="h-8 w-2/3" />
      </AppStack>
    </AppCard>
  );
}

export default function SolucionesTicketMain() {
  const vm = useTicketSolucionesManager();

  return (
    <AppStack gap="md">
      <AppCard
        variant="outline"
        size="sm"
        title={
          <AppInline align="center" gap="xs">
            <Settings2 size={15} className="text-[hsl(var(--app-primary))]" />
            <span>Catálogo de soluciones</span>
          </AppInline>
        }
        description="Soluciones rápidas para seguimiento, reparación y cierre de tickets."
        action={
          <AppButton
            type="button"
            variant={vm.createPanel.isOpen ? "danger" : "primary"}
            size="xs"
            width="auto"
            leftIcon={
              vm.createPanel.isOpen ? <X size={13} /> : <Plus size={13} />
            }
            onClick={vm.toggleCreatePanel}
            disabled={vm.isMutating}
          >
            {vm.createPanel.isOpen ? "Cancelar" : "Nueva solución"}
          </AppButton>
        }
      >
        <AppStack gap="md">
          {vm.createPanel.isOpen ? (
            <div className="rounded-[var(--app-radius-lg)] border border-dashed border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.12)] p-3">
              <div className="mx-auto w-full max-w-lg">
                <TicketSolucionesForm
                  form={vm.form}
                  onSubmit={vm.submitCreate}
                  isLoading={vm.isCreating}
                />
              </div>
            </div>
          ) : null}

          {vm.isLoadingList ? (
            <SolucionesLoadingState />
          ) : vm.ticketSolutions.length === 0 ? (
            <AppEmptyState
              preset="empty"
              variant="plain"
              size="sm"
              align="center"
              icon={<CheckCheck size={34} strokeWidth={1.5} />}
              title="No hay soluciones registradas"
              description="Cree una solución para comenzar a documentar reparaciones comunes."
              action={
                <AppButton
                  type="button"
                  variant="primary"
                  size="xs"
                  width="auto"
                  leftIcon={<Plus size={13} />}
                  onClick={vm.toggleCreatePanel}
                >
                  Crear solución
                </AppButton>
              }
              className="py-8"
            />
          ) : (
            <TicketSolucionesList
              data={vm.ticketSolutions}
              itemsPerPage={5}
              onEdit={vm.selectForEdit}
              onDelete={vm.selectForDelete}
            />
          )}
        </AppStack>
      </AppCard>

      <AppConfirmDialog
        open={vm.deleteDialog.isOpen}
        onOpenChange={vm.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar solución"
        description="Esta acción no se puede deshacer."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={vm.isDeleting}
        preventClose={vm.isDeleting}
        closeOnConfirm={false}
        onConfirm={vm.confirmDelete}
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Solución seleccionada:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {vm.deleteDialog.target?.solucion ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Se eliminarán sus referencias en tickets donde se haya usado.
        </p>
      </AppConfirmDialog>

      <AppDialog
        open={vm.editDialog.isOpen}
        onOpenChange={vm.editDialog.setOpen}
      >
        <AppDialogContent className="sm:max-w-[540px]">
          <AppDialogHeader>
            <AppDialogTitle>Editar solución</AppDialogTitle>
            <AppDialogDescription>
              Modifique la solución rápida seleccionada.
            </AppDialogDescription>
          </AppDialogHeader>

          <TicketSolucionesForm
            mode="edit"
            form={vm.form}
            onSubmit={vm.submitEdit}
            isLoading={vm.isUpdating}
          />
        </AppDialogContent>
      </AppDialog>
    </AppStack>
  );
}
