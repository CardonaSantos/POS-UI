"use client";
import { AlertCircle } from "lucide-react";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useAppStateHandlers } from "@/components/app/handlers";

import TagsTicketMain from "./_components/TagsTicketMain";
import SolucionesTicketMain from "./_components/SolucionesTicketMain";
import { SupportUtilitiesTabs } from "./_components/support-utilities-tabs";
import { EtiquetaTicketDialog } from "./_components/etiqueta-ticket-dialog";
import { useTicketTagsManager } from "./_components/use-ticket-tags-manager";
import { SupportUtilityTab } from "./_components/ticket-tags.helpers";

interface PageUiState {
  activeTab: SupportUtilityTab;
}

export default function EtiquetaTicketManage() {
  const ui = useAppStateHandlers<PageUiState>({
    activeTab: "TicketTags",
  });

  const tags = useTicketTagsManager();
  return (
    <PageTransitionCrm
      titleHeader="Utilidades Soporte"
      subtitle="Etiquetas de soporte y soluciones rápidas para seguimiento de tickets"
      variant="fade-pure"
    >
      <AppStack gap="md">
        <SupportUtilitiesTabs
          value={ui.state.activeTab}
          onChange={(value) => ui.setField("activeTab", value)}
          disabled={tags.isMutating}
        />

        {tags.state.error && !tags.isLoading ? (
          <AppAlert
            tone="danger"
            size="sm"
            icon={<AlertCircle size={15} />}
            title="No se pudieron cargar las etiquetas"
            description={tags.state.error}
          />
        ) : null}

        {ui.state.activeTab === "TicketTags" ? (
          <TagsTicketMain
            etiquetas={tags.etiquetas}
            filteredEtiquetas={tags.filteredEtiquetas}
            isLoading={tags.isLoading || tags.isMutating}
            searchEtiqueta={tags.state.searchEtiqueta}
            stats={tags.stats}
            onSearchChange={tags.setSearchEtiqueta}
            onCreateClick={tags.openCreateDialog}
            onEditClick={tags.openEditDialog}
            onDeleteClick={tags.openDeleteDialog}
          />
        ) : null}

        {ui.state.activeTab === "soluciones" ? <SolucionesTicketMain /> : null}
      </AppStack>

      <EtiquetaTicketDialog
        mode="create"
        open={tags.createDialog.isOpen}
        onOpenChange={(open) => {
          if (open) {
            tags.openCreateDialog();
            return;
          }

          tags.createDialog.close();
          tags.resetForm();
        }}
        nombre={tags.state.formData.nombre}
        isLoading={tags.createAction.isLoading}
        onNombreChange={tags.setNombre}
        onSubmit={tags.submitCreate}
      />

      <EtiquetaTicketDialog
        mode="edit"
        open={tags.editDialog.isOpen}
        onOpenChange={(open) => {
          tags.editDialog.setOpen(open);

          if (!open) {
            tags.resetForm();
          }
        }}
        nombre={tags.state.formData.nombre}
        isLoading={tags.editAction.isLoading}
        onNombreChange={tags.setNombre}
        onSubmit={tags.submitEdit}
      />

      <AppConfirmDialog
        open={tags.deleteDialog.isOpen}
        onOpenChange={tags.deleteDialog.setOpen}
        preset="delete"
        tone="danger"
        size="sm"
        footerAlign="between"
        title="Eliminar etiqueta"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loadingText="Eliminando..."
        isLoading={tags.deleteAction.isLoading}
        preventClose={tags.deleteAction.isLoading}
        closeOnConfirm={false}
        onConfirm={tags.confirmDelete}
      >
        <p className="text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Etiqueta seleccionada:{" "}
          <span className="font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            {tags.deleteDialog.target?.nombre ?? "Sin nombre"}
          </span>
        </p>

        <p className="mt-2 text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Si hay tickets asociados, se eliminará la relación con ellos.
        </p>
      </AppConfirmDialog>
    </PageTransitionCrm>
  );
}
