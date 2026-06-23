"use client";
import { Plus } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import Metricas from "./_components/Metricas";
import { useMetasTecnicosPage } from "./_components/use-metas-tecnicos-page";
import { MetasPageTabs } from "./_components/metas-page-tabs";
import { MetasSummaryGrid } from "./_components/metas-summary-grid";
import { MetasTicketsTable } from "./_components/metas-tickets-table";
import { MetaTicketDialog } from "./_components/meta-ticket-dialog";

export default function MetasTecnicosPage() {
  const userRol = useStoreCrm((state) => state.rol) ?? "";

  const vm = useMetasTecnicosPage(userRol);

  const subtitle = `${vm.summary.totalMetas} Totales · ${vm.summary.abiertas} Abiertas · ${vm.summary.cerradas} Cerradas · ${vm.summary.finalizadas} Finalizadas`;

  return (
    <PageTransitionCrm
      titleHeader="Metas Ticket"
      subtitle={subtitle}
      variant="fade-pure"
    >
      <AppStack gap="md">
        <MetasPageTabs
          value={vm.ui.state.activeTab}
          onChange={(value) => vm.ui.setField("activeTab", value)}
        />

        {vm.ui.state.activeTab === "ticketsMeta" ? (
          <AppStack gap="md">
            <AppCard
              variant="outline"
              size="sm"
              title="Metas de soporte"
              description="Control de objetivos, avance y rendimiento por técnico."
              action={
                <AppButton
                  type="button"
                  size="xs"
                  variant="primary"
                  width="auto"
                  leftIcon={<Plus size={14} />}
                  onClick={vm.openCreateDialog}
                  disabled={!vm.canManage}
                  title={
                    vm.canManage
                      ? "Crear nueva meta"
                      : "No tienes permisos para crear metas"
                  }
                >
                  Nueva meta
                </AppButton>
              }
            >
              <AppStack gap="md">
                <MetasSummaryGrid className="" summary={vm.summary} />

                <MetasTicketsTable
                  metas={vm.data.state.metas}
                  isLoading={vm.data.state.isLoadingMetas}
                  canManage={vm.canManage}
                  operationLoading={vm.operationLoading}
                  onCreateFirst={vm.openCreateDialog}
                  onEdit={vm.openEditDialog}
                  onDelete={vm.openDeleteDialog}
                  onRefresh={vm.loadMetas}
                />
              </AppStack>
            </AppCard>
          </AppStack>
        ) : null}

        {vm.ui.state.activeTab === "metricas" ? <Metricas /> : null}
      </AppStack>

      <MetaTicketDialog
        mode="create"
        open={vm.createDialog.isOpen}
        onOpenChange={vm.createDialog.setOpen}
        formData={vm.form.state}
        tecnicoOptions={vm.tecnicoOptions}
        isLoading={vm.createAction.isLoading}
        onChangeField={vm.form.setField}
        onSubmit={vm.createAction.run}
      />

      <MetaTicketDialog
        mode="edit"
        open={vm.editDialog.isOpen}
        onOpenChange={vm.editDialog.setOpen}
        formData={vm.form.state}
        tecnicoOptions={vm.tecnicoOptions}
        isLoading={vm.editAction.isLoading}
        onChangeField={vm.form.setField}
        onSubmit={vm.editAction.run}
        disableTecnico
      />

      <AppConfirmDialog
        open={vm.deleteDialog.isOpen}
        onOpenChange={vm.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        title="Eliminar meta"
        description={
          vm.data.state.deletingMeta
            ? `Esta acción eliminará la meta de ${vm.data.state.deletingMeta.tecnico.nombre}. No se puede deshacer.`
            : "Esta acción eliminará la meta seleccionada. No se puede deshacer."
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={vm.deleteAction.isLoading}
        preventClose={vm.deleteAction.isLoading}
        onConfirm={async () => {
          await vm.deleteAction.run();
        }}
      />
    </PageTransitionCrm>
  );
}
